/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Location } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { AuthenticationResult, AuthorizationUrlRequest, EndSessionRequest, IPublicClientApplication, Logger, PopupRequest, RedirectRequest, SilentRequest, SsoSilentRequest } from "@azure/msal-browser";
import { Observable, from } from "rxjs";
import { MODULE_NAME, MODULE_VERSION, MSAL_CLIENT_APPLICATION } from './constants';

export interface IMsalService {
    acquireTokenPopup(request: PopupRequest): Observable<AuthenticationResult>;
    acquireTokenRedirect(request: RedirectRequest): Observable<void>;
    acquireTokenSilent(silentRequest: SilentRequest): Observable<AuthenticationResult>;
    handleRedirectObservable(): Observable<AuthenticationResult | null>;
    getLogger(): Logger;
    loginPopup(request?: PopupRequest): Observable<AuthenticationResult>;
    loginRedirect(request?: RedirectRequest): Observable<void>;
    logout(logoutRequest?: EndSessionRequest): Observable<void>;
    setLogger(logger: Logger): void;
    ssoSilent(request: AuthorizationUrlRequest): Observable<AuthenticationResult>;
}

@Injectable()
export class MsalService implements IMsalService {
    private logger?: Logger;
    private redirectHash?: string;

    constructor(
        private readonly location: Location,
        @Inject(MSAL_CLIENT_APPLICATION)
        public readonly clientApplication: IPublicClientApplication,
    ) {
        const hash = this.location.path(true).split("#").pop();

        if (hash) {
            this.redirectHash = `#${hash}`;
        }
    }

    acquireTokenPopup(request: PopupRequest): Observable<AuthenticationResult> {
        return from(this.clientApplication.acquireTokenPopup(request));
    }
    acquireTokenRedirect(request: RedirectRequest): Observable<void> {
        return from(this.clientApplication.acquireTokenRedirect(request));
    }
    acquireTokenSilent(silentRequest: SilentRequest): Observable<AuthenticationResult> {
        return from(this.clientApplication.acquireTokenSilent(silentRequest));
    }
    getLogger(): Logger {
        if (!this.logger) {
            this.logger = this.clientApplication.getLogger().clone(MODULE_NAME, MODULE_VERSION);
        }

        return this.logger;
    }
    handleRedirectObservable(): (Observable<AuthenticationResult | null>) {
        const handleRedirect = from(this.clientApplication.handleRedirectPromise(this.redirectHash));

        this.redirectHash = "";

        return handleRedirect;
    }
    loginPopup(request?: PopupRequest): Observable<AuthenticationResult> {
        return from(this.clientApplication.loginPopup(request));
    }
    loginRedirect(request?: RedirectRequest): Observable<void> {
        return from(this.clientApplication.loginRedirect(request));
    }
    logout(logoutRequest?: EndSessionRequest): Observable<void> {
        return from(this.clientApplication.logout(logoutRequest));
    }
    setLogger(logger: Logger): void {
        this.logger = logger.clone(MODULE_NAME, MODULE_VERSION);
        this.clientApplication.setLogger(logger);
    }
    ssoSilent(request: SsoSilentRequest): Observable<AuthenticationResult> {
        return from(this.clientApplication.ssoSilent(request));
    }
}
