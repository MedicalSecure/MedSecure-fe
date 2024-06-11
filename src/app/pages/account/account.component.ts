import { AzureGraphService } from '../../azure-graph.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface Role {
  name: string;
}

interface Permission {
  name: string;
}

interface GraphAPIResponse {
  '@odata.context': string;
  value: User[];
}

interface User {
  businessPhones: string[];
  displayName: string;
  givenName: string | null;
  jobTitle: string | null;
  mail: string | null;
  mobilePhone: string | null;
  officeLocation: string | null;
  preferredLanguage: string | null;
  surname: string | null;
  userPrincipalName: string;
  id: string;
  roles?: string[];
  permissions?: string[];
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  userForm: FormGroup;
  inviteUserForm: FormGroup;
  forecastSubject = new BehaviorSubject<Object>(new Object());
  roles: Role[] = [
    { name: 'doctor' },
    { name: 'pharmacist' },
    { name: 'receptionist' },
    { name: 'nutritionist' },
    { name: 'supervisor' },
    { name: 'nurse' }
  ];
  permissions: Permission[] = [{ name: 'Read' }, { name: 'Write' }];
  users: any[] | undefined;
  response: GraphAPIResponse | any;

  constructor(
    private fb: FormBuilder,
    private azureGraphService: AzureGraphService,
  ) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      displayName: ['', Validators.required],
      givenName: ['', Validators.required],
      mailNickname: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      roles: [[]],
      permissions: [[]],
    });

    this.inviteUserForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      roles: [[]],
      permissions: [[]],
    });

    // Fetch all users and their roles and permissions on component initialization
    this.getAllUsers();
  }


  async getAllUsers(): Promise<User[]> {

    // const rolesExtension = await this.azureGraphService.getExtension('c59c45c8-4692-43f4-98c0-9d903b969562', 'extension_Roles');
    // console.log("Test rolesExtension");
    // console.log(rolesExtension);

    // const permissionsExtension = await this.azureGraphService.getExtension('c59c45c8-4692-43f4-98c0-9d903b969562', 'extension_Permissions');
    // console.log("Test rolesExtension");
    // console.log(permissionsExtension);

    try {
      this.response = await this.azureGraphService.getUsers().toPromise();
      const users: User[] = Array.isArray(this.response?.value) ? this.response.value : [];

      this.users = await Promise.all(users.map(async (user: User) => {
        {
          try {
            const rolesExtension = await this.azureGraphService.getExtension(user.id, 'extension_Roles');
            const permissionsExtension = await this.azureGraphService.getExtension(user.id, 'extension_Permissions');

            const roles = rolesExtension?.customValue?.additionalData?.Roles?.map((role: Role) => role.name) || [];
            const permissions = permissionsExtension?.customValue?.additionalData?.Permissions?.map((permission: Permission) => permission.name) || [];

            return {
              ...user,
              roles,
              permissions
            };
          } catch (extensionError) {
            console.error(`Error fetching extensions for user ${user.id}`, extensionError);
            // Handle extension fetching error if needed
            return { ...user, roles: [], permissions: [] }; // Return user without extensions
          }
        }
      }));

      // Filter out null values (users that do not match the specified ID)
      this.users = this.users.filter(user => user !== null);

      console.log('Users with roles and permissions:', this.users);
      return this.users;
    } catch (error) {
      console.error('Error fetching users', error);
      throw error; // Propagate the error
    }
  }



  async createUser() {
    if (this.userForm.valid) {
      const user = this.userForm.value;
      const createUserRequest = {
        accountEnabled: true,
        displayName: user.displayName,
        mailNickname: user.mailNickname,
        userPrincipalName: `${user.username}@medsecure.onmicrosoft.com`,
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: user.password
        },
        givenName: user.givenName,
        jobTitle: user.roles.join(', '),
        surname: user.surname,
        businessPhones: user.businessPhones,
        mobilePhone: user.mobilePhone,
        department: 'Health Care',
        officeLocation: 'Tunis'
      };

      try {
        const response = await this.azureGraphService.createUser(createUserRequest);
        console.log('User created successfully', response);

        // Adding custom attributes after user creation
        const userId = response.id;
        const rolesExtension = {
          extensionName: 'extension_Roles',
          additionalData: { Roles: user.roles }
        };
        const permissionsExtension = {
          extensionName: 'extension_Permissions',
          additionalData: { Permissions: user.permissions }
        };

        try {
          await this.azureGraphService.addCustomExtension(userId, rolesExtension, 'extension_Roles');
          console.log('Roles extension added successfully');
        } catch (error) {
          console.error('Error adding roles extension:', error);
        }

        try {
          await this.azureGraphService.addCustomExtension(userId, permissionsExtension, 'extension_Permissions');
          console.log('Permissions extension added successfully');
        } catch (error) {
          console.error('Error adding permissions extension:', error);
        }
      } catch (error) {
        console.error('Error creating user', error);
      }
    }
  }

  async inviteUserByEmail() {
    if (this.inviteUserForm.valid) {
      const inviteUser = this.inviteUserForm.value;
      const inviteUserRequest = {
        invitedUserEmailAddress: inviteUser.emailAddress,
        inviteRedirectUrl: 'https://localhost:4200/',
        invitedUserDisplayName: inviteUser.displayName,
        sendInvitationMessage: true,
        invitedUserMessageInfo: {
          customizedMessageBody: 'Welcome to Medsecure organization! Please join us using the following link.'
        },
        // Invite As Member
        invitedUserType: 'Member'
      };

      try {
        const response = await this.azureGraphService.inviteUserAsMember(inviteUserRequest);
        console.log('User invited successfully', response);

        // Adding custom attributes after user creation
        const userId = response.invitedUser.id;
        const rolesExtension = {
          extensionName: 'extension_Roles',
          additionalData: { Roles: inviteUser.roles }
        };
        const permissionsExtension = {
          extensionName: 'extension_Permissions',
          additionalData: { Permissions: inviteUser.permissions }
        };

        await this.azureGraphService.addCustomExtension(userId, rolesExtension, 'extension_Roles');
        await this.azureGraphService.addCustomExtension(userId, permissionsExtension, 'extension_Permissions');

        console.log('Custom extensions added successfully');
      } catch (error) {
        console.error('Error inviting user or adding custom extensions', error);
      }
    }
  }
}