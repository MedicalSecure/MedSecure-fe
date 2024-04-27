export const environment = {
    production: false,
    environmentName: "development",
    msalConfig: {
        auth: {
            clientId: 'ba8bc284-466c-4627-a83a-9833f26db722',
            authority: 'https://login.microsoftonline.com/0d7f968d-56cb-4ebf-b490-ee9e8c8c4566'
        }
    },
    apiConfig: {
        scopes: ['user.read'],
        uri: 'https://graph.microsoft.com/v1.0/me'
    }
  };
