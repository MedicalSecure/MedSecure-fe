// environment.ts

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  environmentName: 'development',
  msalConfig: {
    auth: {
      clientId: '8a55b2b5-6a5c-4f56-97b6-9fa6623e2eba',
      authority: 'https://login.microsoftonline.com/0d7f968d-56cb-4ebf-b490-ee9e8c8c4566',
    },
  },
  apiConfig: {
    scopes: [
      'User.ReadBasic.All',
      'user.read',
      'User.ReadWrite.All',
      'Directory.ReadWrite.All',
    ],
    uri: 'https://graph.microsoft.com/v1.0/me',
  },
  roles: {
    DOCTOR_ROLE: 'doctor',
    PHARMACIST_ROLE: 'pharmacist',
    RECEPTIONIST_ROLE: 'receptionist',
    NUTRITIONIST_ROLE: 'nutritionist',
    SUPERVISOR_ROLE: 'supervisor',
    NURSE_ROLE: 'nurse',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
