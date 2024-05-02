import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideDaterangepickerLocale } from 'ngx-daterangepicker-bootstrap';
import { GanttChartComponent } from 'smart-webcomponents-angular/ganttchart';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { IPublicClientApplication, PublicClientApplication, InteractionType, LogLevel } from '@azure/msal-browser';
import { MsalInterceptor, MSAL_INSTANCE, MsalInterceptorConfiguration, MsalGuardConfiguration, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG, MsalService, MsalGuard, MsalBroadcastService, ProtectedResourceScopes } from '@azure/msal-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule} from '@angular/material/list';
import { loginRequest, msalConfig, protectedResources } from './auth-config';
import { HttpInterceptorService } from './service/spinner-interceptor.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    GanttChartComponent,
    importProvidersFrom(BrowserModule, MatButtonModule, MatToolbarModule, MatListModule, MatMenuModule),
    provideDaterangepickerLocale({ separator: ' - ', applyLabel: 'Okay' }),
    provideAnimationsAsync(),
    provideAnimations(),
    HttpClientModule,
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: MsalInterceptor,
        multi: true
    },
    {
        provide: MSAL_INSTANCE,
        useFactory: MSALInstanceFactory
    },
    {
        provide: MSAL_GUARD_CONFIG,
        useFactory: MSALGuardConfigFactory
    },
    {
        provide: MSAL_INTERCEPTOR_CONFIG,
        useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
};

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

/**
 * Here we pass the configuration parameters to create an MSAL instance.
 * For more info, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/configuration.md
 */
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

/**
* Set your default interaction type for MSALGuard here. If you have any
* additional scopes you want the user to consent upon login, add them here as well.
*/
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
      interactionType: InteractionType.Redirect,
      authRequest: loginRequest,
      //loginFailedRoute: '/login-failed'
  };
}


/**
* MSAL Angular will automatically retrieve tokens for resources
* added to protectedResourceMap. For more info, visit:
* https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/initialization.md#get-tokens-for-web-api-calls
*/
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string | ProtectedResourceScopes> | null>();

  protectedResourceMap.set(protectedResources.api.endpoint, [
      {
          httpMethod: 'GET',
          scopes: [...protectedResources.api.scopes.read]
      },
      {
          httpMethod: 'POST',
          scopes: [...protectedResources.api.scopes.write]
      },
      {
          httpMethod: 'PUT',
          scopes: [...protectedResources.api.scopes.write]
      },
      {
          httpMethod: 'DELETE',
          scopes: [...protectedResources.api.scopes.write]
      }
  ]);

  return {
      interactionType: InteractionType.Popup,
      protectedResourceMap,
  };
}