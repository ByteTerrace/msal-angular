/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BrowserUtils, InteractionType, IPublicClientApplication, PublicClientApplication, UrlString } from '@azure/msal-browser';
import { of } from 'rxjs';
import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalModule, MsalService } from '../public-api';

let guard: MsalGuard;
let msalService: MsalService;
let routeMock: any = { snapshot: {} };
let routeStateMock: any = { snapshot: {}, url: '/' };
let routerMock = { navigate: jasmine.createSpy('navigate') };
let testInteractionType: InteractionType;

function initializeMsal() {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
        imports: [
            MsalModule.forRoot(
                MSALInstanceFactory(),
                MSALGuardConfigFactory(),
                { interactionType: InteractionType.Popup, protectedResourceMap: new Map() }),
            HttpClientTestingModule
        ],
        providers: [
            MsalGuard,
            { provide: Router, useValue: routerMock },
            MsalService,
            MsalBroadcastService
        ]
    });

    msalService = TestBed.inject(MsalService);
    guard = TestBed.inject(MsalGuard);
}
function MSALGuardConfigFactory(): MsalGuardConfiguration {
    return {
        //@ts-ignore
        interactionType: testInteractionType
    }
}
function MSALInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication({
        auth: {
            clientId: '6226576d-37e9-49eb-b201-ec1eeb0029b6',
            redirectUri: 'http://localhost:4200'
        }
    });
}

describe('MsalGuard', () => {
    beforeEach(() => {
        testInteractionType = InteractionType.Popup;
        initializeMsal();
    });

    it("is created", () => {
        expect(guard).toBeTruthy();
    });

    it("returns false if page with MSAL Guard is set as redirectUri", (done) => {
        spyOn(UrlString, "hashContainsKnownProperties").and.returnValue(true);
        spyOn(BrowserUtils, "isInIframe").and.returnValue(true);

        const listener = jasmine.createSpy();
        guard.canActivate(routeMock, routeStateMock).subscribe(listener);
        expect(listener).toHaveBeenCalledWith(false);
        done();
    });

    it("returns true for a logged in user", (done) => {
        spyOn(MsalService.prototype, "handleRedirectObservable").and.returnValue(
            //@ts-ignore
            of("test")
        );

        spyOn(PublicClientApplication.prototype, "getAllAccounts").and.returnValue([{
            homeAccountId: "test",
            localAccountId: "test",
            environment: "test",
            tenantId: "test",
            username: "test"
        }]);

        const listener = jasmine.createSpy();
        guard.canActivate(routeMock, routeStateMock).subscribe(listener);
        expect(listener).toHaveBeenCalledWith(true);
        done();
    });

    it("should return true after logging in with popup", (done) => {
        spyOn(MsalService.prototype, "handleRedirectObservable").and.returnValue(
            //@ts-ignore
            of("test")
        );

        spyOn(PublicClientApplication.prototype, "getAllAccounts").and.returnValue([]);

        spyOn(MsalService.prototype, "loginPopup").and.returnValue(
            //@ts-ignore
            of(true)
        );

        const listener = jasmine.createSpy();
        guard.canActivate(routeMock, routeStateMock).subscribe(listener);
        expect(listener).toHaveBeenCalledWith(true);
        done();
    });

    it("should return false after login with popup fails", (done) => {
        spyOn(MsalService.prototype, "handleRedirectObservable").and.returnValue(
            //@ts-ignore
            of("test")
        );

        spyOn(PublicClientApplication.prototype, "getAllAccounts").and.returnValue([]);

        spyOn(MsalService.prototype, "loginPopup").and.throwError("login error");

        const listener = jasmine.createSpy();
        guard.canActivate(routeMock, routeStateMock).subscribe(listener);
        expect(listener).toHaveBeenCalledWith(false);
        done();
    });

    it("should return false after logging in with redirect", (done) => {
        testInteractionType = InteractionType.Redirect;
        initializeMsal();

        spyOn(MsalService.prototype, "handleRedirectObservable").and.returnValue(
            //@ts-ignore
            of("test")
        );

        spyOn(PublicClientApplication.prototype, "getAllAccounts").and.returnValue([]);

        spyOn(PublicClientApplication.prototype, "loginRedirect").and.returnValue((
            new Promise((resolve) => {
                resolve();
            })
        ));

        const listener = jasmine.createSpy();
        guard.canActivate(routeMock, routeStateMock).subscribe(listener);
        expect(listener).toHaveBeenCalledWith(false);
        done();
    });

    it("canActivateChild returns true with logged in user", (done) => {
        spyOn(MsalService.prototype, "handleRedirectObservable").and.returnValue(
            //@ts-ignore
            of("test")
        );

        spyOn(PublicClientApplication.prototype, "getAllAccounts").and.returnValue([{
            homeAccountId: "test",
            localAccountId: "test",
            environment: "test",
            tenantId: "test",
            username: "test"
        }]);

        const listener = jasmine.createSpy();
        guard.canActivateChild(routeMock, routeStateMock).subscribe(listener);
        expect(listener).toHaveBeenCalledWith(true);
        done();
    });

    it("canLoad returns true with logged in user", (done) => {
        spyOn(MsalService.prototype, "handleRedirectObservable").and.returnValue(
            //@ts-ignore
            of("test")
        );

        spyOn(PublicClientApplication.prototype, "getAllAccounts").and.returnValue([{
            homeAccountId: "test",
            localAccountId: "test",
            environment: "test",
            tenantId: "test",
            username: "test"
        }]);

        const listener = jasmine.createSpy();
        guard.canLoad().subscribe(listener);
        expect(listener).toHaveBeenCalledWith(true);
        done();
    });

    it("canLoad returns false with no users logged in", (done) => {
        spyOn(MsalService.prototype, "handleRedirectObservable").and.returnValue(
            //@ts-ignore
            of("test")
        );

        spyOn(PublicClientApplication.prototype, "getAllAccounts").and.returnValue([]);

        const listener = jasmine.createSpy();
        guard.canLoad().subscribe(listener);
        expect(listener).toHaveBeenCalledWith(false);
        done();
    });
});
