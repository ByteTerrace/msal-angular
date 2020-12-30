/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { TestBed } from '@angular/core/testing';
import { AuthenticationResult, AuthError, InteractionType, PublicClientApplication, SilentRequest } from '@azure/msal-browser';
import { MsalModule, MsalService } from '../public-api';

let msalService: MsalService;

const msalInstance = new PublicClientApplication({
    auth: {
        clientId: '6226576d-37e9-49eb-b201-ec1eeb0029b6',
        redirectUri: 'http://localhost:4200'
    }
});

function initializeMsal() {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
        imports: [
            MsalModule.forRoot(msalInstance, null as any, { interactionType: InteractionType.Popup, protectedResourceMap: new Map() })
        ],
        providers: [
            MsalService,
        ]
    });

    msalService = TestBed.inject(MsalService);
}

describe('MsalService', () => {
    beforeAll(initializeMsal);

    describe("loginPopup", () => {
        it("success", (done) => {
            const sampleIdToken = {
                idToken: "123abc"
            };

            spyOn(PublicClientApplication.prototype, "loginPopup").and.returnValue((
                new Promise((resolve) => {
                    //@ts-ignore
                    resolve(sampleIdToken);
                })
            ));

            const request = {
                scopes: ["user.read"]
            };

            msalService.loginPopup(request)
                .subscribe((response: AuthenticationResult) => {
                    expect(response.idToken).toBe(sampleIdToken.idToken);
                    expect(PublicClientApplication.prototype.loginPopup).toHaveBeenCalledWith(request);
                    done();
                });

        });
        it("failure", (done) => {
            const sampleError = new AuthError("123", "message");

            spyOn(PublicClientApplication.prototype, "loginPopup").and.returnValue((
                new Promise((resolve, reject) => {
                    reject(sampleError);
                })
            ));

            const request = {
                scopes: ["wrong.scope"]
            };

            msalService.loginPopup(request)
                .subscribe({
                    error: (error: AuthError) => {
                        expect(error.message).toBe(sampleError.message);
                        expect(PublicClientApplication.prototype.loginPopup).toHaveBeenCalledWith(request);
                        done();
                    }
                });
        });
    });
    describe("loginRedirect", () => {
        it("success", async () => {
            spyOn(PublicClientApplication.prototype, "loginRedirect").and.returnValue((
                new Promise((resolve) => {
                    resolve();
                })
            ));

            const request = {
                scopes: ["user.read"]
            };

            await msalService.loginRedirect(request);

            expect(PublicClientApplication.prototype.loginRedirect).toHaveBeenCalled();
        });
    });
    describe("ssoSilent", () => {
        it("success", (done) => {
            const sampleIdToken = {
                idToken: "id-token"
            };

            spyOn(PublicClientApplication.prototype, "ssoSilent").and.returnValue((
                new Promise((resolve) => {
                    //@ts-ignore
                    resolve(sampleIdToken);
                })
            ));

            const request = {
                scopes: ["user.read"],
                loginHint: "name@example.com"
            };

            msalService.ssoSilent(request)
                .subscribe((response: AuthenticationResult) => {
                    expect(response.idToken).toBe(sampleIdToken.idToken);
                    expect(PublicClientApplication.prototype.ssoSilent).toHaveBeenCalledWith(request);
                    done();
                });

        });
        it("failure", (done) => {
            const sampleError = new AuthError("123", "message");

            spyOn(PublicClientApplication.prototype, "ssoSilent").and.returnValue((
                new Promise((resolve, reject) => {
                    reject(sampleError);
                })
            ));

            const request = {
                scopes: ["user.read"],
                loginHint: "name@example.com"
            };

            msalService.ssoSilent(request)
                .subscribe({
                    error: (error: AuthError) => {
                        expect(error.message).toBe(sampleError.message);
                        expect(PublicClientApplication.prototype.ssoSilent).toHaveBeenCalledWith(request);
                        done();
                    }
                });
        });
    });
    describe("acquireTokenSilent", () => {
        it("success", (done) => {
            const sampleAccessToken = {
                accessToken: "123abc"
            };

            spyOn(PublicClientApplication.prototype, "acquireTokenSilent").and.returnValue((
                new Promise((resolve) => {
                    //@ts-ignore
                    resolve(sampleAccessToken);
                })
            ));

            const request: SilentRequest = {
                scopes: ["user.read"],
                account: null as any
            };

            msalService.acquireTokenSilent(request)
                .subscribe((response: AuthenticationResult) => {
                    expect(response.accessToken).toBe(sampleAccessToken.accessToken);
                    expect(PublicClientApplication.prototype.acquireTokenSilent).toHaveBeenCalledWith(request);
                    done();
                });

        });
        it("failure", (done) => {
            const sampleError = new AuthError("123", "message");

            spyOn(PublicClientApplication.prototype, "acquireTokenSilent").and.returnValue((
                new Promise((resolve, reject) => {
                    reject(sampleError);
                })
            ));

            const request: SilentRequest = {
                scopes: ["wrong.scope"],
                account: null as any
            };

            msalService.acquireTokenSilent(request)
                .subscribe({
                    error: (error: AuthError) => {
                        expect(error.message).toBe(sampleError.message);
                        expect(PublicClientApplication.prototype.acquireTokenSilent).toHaveBeenCalledWith(request);
                        done();
                    }
                });

        });
    });
    describe("acquireTokenRedirect", () => {
        it("success", async () => {
            spyOn(PublicClientApplication.prototype, "acquireTokenRedirect").and.returnValue((
                new Promise((resolve) => {
                    resolve();
                })
            ));

            await msalService.acquireTokenRedirect({
                scopes: ["user.read"]
            });

            expect(PublicClientApplication.prototype.acquireTokenRedirect).toHaveBeenCalled();
        });
    });
    describe("acquireTokenPopup", () => {
        it("success", (done) => {
            const sampleAccessToken = {
                accessToken: "123abc"
            };

            spyOn(PublicClientApplication.prototype, "acquireTokenPopup").and.returnValue((
                new Promise((resolve) => {
                    //@ts-ignore
                    resolve(sampleAccessToken);
                })
            ));

            const request = {
                scopes: ["user.read"]
            };

            msalService.acquireTokenPopup(request)
                .subscribe((response: AuthenticationResult) => {
                    expect(response.accessToken).toBe(sampleAccessToken.accessToken);
                    expect(PublicClientApplication.prototype.acquireTokenPopup).toHaveBeenCalledWith(request);
                    done();
                });

        });
        it("failure", (done) => {
            const sampleError = new AuthError("123", "message");

            spyOn(PublicClientApplication.prototype, "acquireTokenPopup").and.returnValue((
                new Promise((resolve, reject) => {
                    reject(sampleError);
                })
            ));

            const request = {
                scopes: ["wrong.scope"]
            };

            msalService.acquireTokenPopup(request)
                .subscribe({
                    error: (error: AuthError) => {
                        expect(error.message).toBe(sampleError.message);
                        expect(PublicClientApplication.prototype.acquireTokenPopup).toHaveBeenCalledWith(request);
                        done();
                    }
                });

        });
    });
    describe("handleRedirectObservable", () => {
        it("success", (done) => {
            const sampleAccessToken = {
                accessToken: "123abc"
            };

            spyOn(PublicClientApplication.prototype, "handleRedirectPromise").and.returnValue((
                new Promise((resolve) => {
                    //@ts-ignore
                    resolve(sampleAccessToken);
                })
            ));

            msalService.handleRedirectObservable()
                .subscribe((response: (AuthenticationResult | null)) => {
                    expect(response!.accessToken).toBe(sampleAccessToken.accessToken);
                    expect(PublicClientApplication.prototype.handleRedirectPromise).toHaveBeenCalled();
                    done();
                });
        });
        it("failure", (done) => {
            const sampleError = new AuthError("123", "message");

            spyOn(PublicClientApplication.prototype, "handleRedirectPromise").and.returnValue((
                new Promise((resolve, reject) => {
                    reject(sampleError);
                })
            ));

            msalService.handleRedirectObservable()
                .subscribe({
                    error: (error: AuthError) => {
                        expect(error.message).toBe(sampleError.message);
                        expect(PublicClientApplication.prototype.handleRedirectPromise).toHaveBeenCalled();
                        done();
                    }
                });
        });
    });
});
