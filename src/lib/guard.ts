/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Location } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, RouterStateSnapshot } from "@angular/router";
import { BrowserConfigurationAuthError, BrowserUtils, InteractionType, PopupRequest, RedirectRequest, UrlString } from "@azure/msal-browser";
import { Observable, of } from "rxjs";
import { concatMap, catchError, map } from "rxjs/operators";
import { MSAL_GUARD_CONFIGURATION } from "./constants";
import { MsalService } from "./service";
import { MsalGuardConfiguration } from '../types/MsalGuardConfiguration';

@Injectable()
export class MsalGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(
        private readonly location: Location,
        @Inject(MSAL_GUARD_CONFIGURATION)
        private readonly msalGuardConfiguration: MsalGuardConfiguration,
        private readonly msalService: MsalService,
    ) { }

    private activateHelper(state?: RouterStateSnapshot): Observable<boolean> {
        if (this.msalGuardConfiguration.interactionType !== InteractionType.Popup && this.msalGuardConfiguration.interactionType !== InteractionType.Redirect) {
            throw new BrowserConfigurationAuthError("invalid_interaction_type", "Invalid interaction type provided to MSAL Guard. InteractionType.Popup or InteractionType.Redirect must be provided in the MsalGuardConfiguration");
        }

        this.msalService.getLogger().verbose("MSAL Guard activated");

        /*
         * If a page with MSAL Guard is set as the redirect for acquireTokenSilent,
         * short-circuit to prevent redirecting or popups.
         * TODO: Update to allow running in iframe once allowRedirectInIframe is implemented
         */
        if (UrlString.hashContainsKnownProperties(window.location.hash) && BrowserUtils.isInIframe()) {
            this.msalService.getLogger().warning("Guard - redirectUri set to page with MSAL Guard. It is recommended to not set redirectUri to a page that requires authentication.");
            return of(false);
        }

        return this.msalService.handleRedirectObservable()
            .pipe(
                concatMap(() => {
                    if (!this.msalService.clientApplication.getAllAccounts().length) {
                        if (state) {
                            this.msalService.getLogger().verbose("Guard - no accounts retrieved, log in required to activate");
                            return this.loginInteractively(state.url);
                        }
                        this.msalService.getLogger().verbose("Guard - no accounts retrieved, no state, cannot load");
                        return of(false);
                    }

                    this.msalService.getLogger().verbose("Guard - account retrieved, can activate or load");

                    return of(true);
                }),
                catchError(() => {
                    this.msalService.getLogger().verbose("Guard - error while logging in, unable to activate");

                    return of(false);
                })
            );
    }
    private loginInteractively(url: string): Observable<boolean> {
        if (this.msalGuardConfiguration.interactionType === InteractionType.Popup) {
            this.msalService.getLogger().verbose("Guard - logging in by popup");

            return this.msalService.loginPopup({ ...this.msalGuardConfiguration.authRequest, } as PopupRequest)
                .pipe(
                    map(() => {
                        this.msalService.getLogger().verbose("Guard - login by popup successful, can activate");
                        return true;
                    }),
                    catchError(() => of(false))
                );
        }

        this.msalService.getLogger().verbose("Guard - logging in by redirect");
        const redirectStartPage = this.getDestinationUrl(url);
        this.msalService.loginRedirect({
            redirectStartPage,
            ...this.msalGuardConfiguration.authRequest,
        } as RedirectRequest);

        return of(false);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        this.msalService.getLogger().verbose("Guard - canActivate");

        return this.activateHelper(state);
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        this.msalService.getLogger().verbose("Guard - canActivateChild");

        return this.activateHelper(state);
    }
    canLoad(): Observable<boolean> {
        this.msalService.getLogger().verbose("Guard - canLoad");

        return this.activateHelper();
    }
    getDestinationUrl(path: string): string {
        this.msalService.getLogger().verbose("Guard - getting destination url");
        // Absolute base url for the application (default to origin if base element not present)
        const baseElements = document.getElementsByTagName("base");
        const baseUrl = this.location.normalize(baseElements.length ? baseElements[0].href : window.location.origin);

        // Path of page (including hash, if using hash routing)
        const pathUrl = this.location.prepareExternalUrl(path);

        // Hash location strategy
        if (pathUrl.startsWith("#")) {
            this.msalService.getLogger().verbose("Guard - destination by hash routing");
            return `${baseUrl}/${pathUrl}`;
        }

        /*
         * If using path location strategy, pathUrl will include the relative portion of the base path (e.g. /base/page).
         * Since baseUrl also includes /base, can just concatentate baseUrl + path
         */
        return `${baseUrl}${path}`;
    }
}
