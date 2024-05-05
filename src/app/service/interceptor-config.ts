import {
  MsalInterceptorConfiguration,
  ProtectedResourceScopes,
} from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import { protectedResources } from '../auth-config';

/**
 * MSAL Angular will automatically retrieve tokens for resources
 * added to protectedResourceMap. For more info, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/initialization.md#get-tokens-for-web-api-calls
 */
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<
    string,
    Array<string | ProtectedResourceScopes> | null
  >();

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
