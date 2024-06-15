export type ProfileType = {
  givenName?: string;
  surname?: string;
  displayName?: string;
  userPrincipalName?: string;
  id?: string;
  jobTitle?: string | null;
  mail?: string | null;
  businessPhones?: string[];
  mobilePhone?: string | null;
  officeLocation?: string | null;
  preferredLanguage?: string | null;
};
