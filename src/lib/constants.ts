import { InjectionToken } from "@angular/core";

export const MODULE_NAME = "@byteterrace/msal-angular";
export const MODULE_VERSION = "0.0.0";

export const MSAL_GUARD_CONFIGURATION = new InjectionToken<string>("BYTETERRACE_MSAL_GUARD_CONFIGURATION");
export const MSAL_CLIENT_APPLICATION = new InjectionToken<string>("BYTETERRACE_MSAL_INSTANCE");
export const MSAL_INTERCEPTOR_CONFIGURATION = new InjectionToken<string>("BYTETERRACE_MSAL_INTERCEPTOR_CONFIGURATION");
