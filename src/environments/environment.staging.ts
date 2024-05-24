// environment.staging.ts

export const environment = {
  production: false,
  environmentName: 'staging',
  msalConfig: {
    auth: {
      clientId: 'ENTER_CLIENT_ID',
      authority: 'ENTER_AUTHORITY'
    },
  },
  apiConfig: {
    scopes: ['user.read'],
    uri: 'https://graph.microsoft.com/v1.0/me',
  },
};
