/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IPublicClientApplication } from "@azure/msal-browser";
import { MsalBroadcastService } from './broadcast.service';
import { MSAL_GUARD_CONFIGURATION, MSAL_CLIENT_APPLICATION, MSAL_INTERCEPTOR_CONFIGURATION } from "./constants";
import { MsalGuard } from './guard';
import { MsalService } from "./service";
import { MsalGuardConfiguration } from '../types/MsalGuardConfiguration';
import { MsalInterceptorConfiguration } from '../types/MsalInterceptorConfiguration';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
    ],
    providers: [
        MsalBroadcastService,
        MsalGuard,
    ]
})
export class MsalModule {
    static forRoot(
        clientApplication: IPublicClientApplication,
        guardConfiguration: MsalGuardConfiguration,
        interceptorConfiguration: MsalInterceptorConfiguration,
    ): ModuleWithProviders<MsalModule> {
        return {
            ngModule: MsalModule,
            providers: [
                {
                    provide: MSAL_CLIENT_APPLICATION,
                    useValue: clientApplication,
                },
                {
                    provide: MSAL_GUARD_CONFIGURATION,
                    useValue: guardConfiguration,
                },
                {
                    provide: MSAL_INTERCEPTOR_CONFIGURATION,
                    useValue: interceptorConfiguration,
                },
                MsalService,
            ],
        };
    }
}
