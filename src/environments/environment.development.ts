export const environment = {
  production: false,
  environmentName: 'development',
  msalConfig: {
    auth: {
      clientId: '8a55b2b5-6a5c-4f56-97b6-9fa6623e2eba',
      authority:
        'https://login.microsoftonline.com/0d7f968d-56cb-4ebf-b490-ee9e8c8c4566',

      // Directory (tenant) ID => 0d7f968d-56cb-4ebf-b490-ee9e8c8c4566
    },
  },
  apiConfig: {
    scopes: [
      'User.ReadBasic.All',
      'user.read',
      'User.ReadWrite.All',
      'Directory.ReadWrite.All',
      'User.Invite.All', 
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
