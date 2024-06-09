// environment.prod.ts

export const environment = {
  production: true,
  environmentName: 'production',
  msalConfig: {
    auth: {
      clientId: 'ENTER_CLIENT_ID',
      authority: 'ENTER_AUTHORITY',
    },
  },
  apiConfig: {
    scopes: ['ENTER_SCOPE'],
    uri: 'ENTER_URI',
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
