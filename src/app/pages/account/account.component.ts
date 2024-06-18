import { AzureGraphService } from '../azure-graph.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { loginRequest } from '../../auth-config';

interface Claim {
  type: string;
  value: string;
}

interface UserProfile {
  UserId: string;
  Name: string;
  isAuthenticated: boolean;
  NameClaimType: string;
  RoleClaimType: string;
  Claims: Claim[];
}

interface Role {
  name: string;
}

interface Permission {
  name: string;
}

interface CreateUserRequest {
  DisplayName: string;
  GivenName: string;
  MailNickname: string;
  Surname: string;
  Username: string;
  Domain: string;
  Password: string;
  Roles: Role[];
  Permissions: Permission[];
}

interface InviteUserRequest {
  emailAddress: string;
  displayName: string;
  roles: Role[];
  permissions: Permission[];
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  dataFromAzureProtectedApi$: Observable<string[]>;
  dataGraphApiCalls$: Observable<string[]>;
  userProfileClaims$: Observable<UserProfile>;
  userProfile$: Observable<Claim>;
  userForm: FormGroup;
  inviteUserForm: FormGroup;
  forecastSubject = new BehaviorSubject<Object>(new Object());
  roles: Role[] = [{ name: 'Doctor' }, { name: 'Admin' }];
  permissions: Permission[] = [{ name: 'Read' }, { name: 'Write' }];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private azureGraphService: AzureGraphService,
    private msalService: MsalService
  ) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      displayName: ['', Validators.required],
      givenName: ['', Validators.required],
      mailNickname: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      domain: ['', Validators.required],
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
  }

  onSubmit() {
    if (this.userForm.valid) {
      const user = this.userForm.value;
      const createUserRequest = {
        DisplayName: user.displayName,
        GivenName: user.givenName,
        MailNickname: user.mailNickname,
        Surname: user.surname,
        Username: user.username,
        Domain: user.domain,
        Password: user.password,
        Roles: user.roles,
        Permissions: user.permissions,
      };

      this.azureGraphService.createUser(createUserRequest).subscribe(
        response => {
          console.log('User created:', response);
        },
        error => {
          console.error('Error creating user:', error);
        }
      );
    }
  }

  inviteUserByEmail() {
    if (this.inviteUserForm.valid) {
      const inviteUser = this.inviteUserForm.value;
      const inviteUserRequest = {
        emailAddress: inviteUser.emailAddress,
        displayName: inviteUser.displayName,
        roles: inviteUser.roles,
        permissions: inviteUser.permissions,
      };

      this.azureGraphService.inviteUserByEmail(inviteUserRequest).subscribe(
        response => {
          console.log('User invited:', response);
        },
        error => {
          console.error('Error inviting user:', error);
        }
      );
    }
  }

  getDirectApiData() {
  }

  getGraphApiDataUsingApi() {
  }
}