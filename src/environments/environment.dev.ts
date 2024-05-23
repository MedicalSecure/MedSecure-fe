export const environment = {
  production: false,
  msalConfig: {
      auth: {
          clientId: '8a55b2b5-6a5c-4f56-97b6-9fa6623e2eba',
          authority: 'https://login.microsoftonline.com/common'
      }
  },
  apiConfig: {
      scopes: ['user.read'],
      uri: 'https://graph.microsoft.com/v1.0/me'
  }
};
