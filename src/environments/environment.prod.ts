// environment.prod.ts

export const environment = {
  production: true,
  environmentName: "production",
	msalConfig: {
		auth: {
			clientId: 'ENTER_CLIENT_ID',
			authority: 'ENTER_AUTHORITY'
		}
	},
	apiConfig: {
		scopes: ['ENTER_SCOPE'],
		uri: 'ENTER_URI'
	}
};