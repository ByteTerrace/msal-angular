/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Inject, Injectable } from "@angular/core";
import { EventMessage, IPublicClientApplication } from "@azure/msal-browser";
import { Observable, Subject } from "rxjs";
import { MSAL_CLIENT_APPLICATION } from './constants';

@Injectable()
export class MsalBroadcastService {
    private _msalSubject: Subject<EventMessage>;
    public msalSubject$: Observable<EventMessage>;

    constructor(
        @Inject(MSAL_CLIENT_APPLICATION)
        private readonly clientApplication: IPublicClientApplication,
    ) {
        this._msalSubject = new Subject<EventMessage>();
        this.msalSubject$ = this._msalSubject.asObservable();
        this.clientApplication.addEventCallback((message: EventMessage) => {
            this._msalSubject.next(message);
        });
    }
}
