/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { TestBed } from '@angular/core/testing';
import { EventType, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { MsalBroadcastService, MsalModule } from '../public-api';

const msalInstance = new PublicClientApplication({
    auth: {
        clientId: '6226576d-37e9-49eb-b201-ec1eeb0029b6',
        redirectUri: 'http://localhost:4200'
    }
});

describe('MsalBroadcastService', () => {
    let broadcastService: MsalBroadcastService;

    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [
                MsalModule.forRoot(msalInstance, null as any, { interactionType: InteractionType.Popup, protectedResourceMap: new Map() })
            ],
            providers: [
                MsalBroadcastService
            ]
        });
        broadcastService = TestBed.inject(MsalBroadcastService);
    });
    it('broadcasts event from PublicClientApplication', (done) => {
        broadcastService.msalSubject$.subscribe((result) => {
            expect(result.eventType).toEqual(EventType.LOGIN_START);
            expect(result.interactionType).toEqual(InteractionType.Popup);
            expect(result.payload).toEqual(null);
            expect(result.error).toEqual(null);
            expect(result.timestamp).toBeInstanceOf(Number);
            done();
        });

        //@ts-ignore
        msalInstance.emitEvent(EventType.LOGIN_START, InteractionType.Popup);
    });
});
