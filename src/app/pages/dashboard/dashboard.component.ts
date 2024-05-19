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

interface Claim {
  type: string;
  value: string;
}

interface UserProfile {
  isAuthenticated: boolean;
  nameClaimType: string;
  roleClaimType: string;
  claims: Claim[];
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
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly httpClient = inject(HttpClient);
  dataFromAzureProtectedApi$: Observable<string[]>;
  dataGraphApiCalls$: Observable<string[]>;
  userProfileClaims$: Observable<UserProfile>;
  userForm: FormGroup;
  inviteUserForm: FormGroup;
  forecastSubject = new BehaviorSubject<Object>(new Object());

  constructor(private fb: FormBuilder) {}

  private initForm() {
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

  newUser: CreateUserRequest = {
    DisplayName: '',
    GivenName: '',
    MailNickname: '',
    Surname: '',
    Username: '',
    Domain: '',
    Password: '',
    Roles: [],
    Permissions: [],
  };

  inviteData: InviteUserRequest = {
    emailAddress: '',
    displayName: '',
    roles: [],
    permissions: [],
  };

  roles: Role[] = [{ name: 'Doctor' }, { name: 'Admin' }];

  permissions: Permission[] = [{ name: 'Read' }, { name: 'Write' }];

  ngOnInit() {
    this.initForm();
    this.getUserProfile();
  }

  getUserProfile() {
    this.userProfileClaims$ = this.httpClient.get<UserProfile>(
      `${this.getCurrentHost()}/api/User`
    );
  }

  getDirectApiData() {
    this.dataFromAzureProtectedApi$ = this.httpClient.get<string[]>(
      `${this.getCurrentHost()}/api/DirectApi`
    );
  }

  getGraphApiDataUsingApi() {
    this.dataGraphApiCalls$ = this.httpClient.get<string[]>(
      `${this.getCurrentHost()}/api/GraphApiData`
    );
  }

  private getCurrentHost() {
    const host = window.location.host;
    const url = `${window.location.protocol}//${host}`;

    return url;
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    this.newUser = this.userForm.value;

    const url = `${this.getCurrentHost()}/api/CreateUser/CreateUser`;
    this.httpClient.post(url, this.newUser).subscribe(
      (response) => {
        console.log('User created successfully', response);
      },
      (error) => {
        console.error('Error creating user', error);
      }
    );
  }

  inviteUserByEmail(): void {
    if (this.inviteUserForm.invalid) {
      return;
    }

    this.inviteData = this.inviteUserForm.value;

    const url = `${this.getCurrentHost()}/api/CreateUser/InviteUserByEmail`;
    this.httpClient.post(url, this.inviteData).subscribe(
      (response) => {
        console.log('Invitation successful', response);
      },
      (error) => {
        console.error('Error invite user', error);
      }
    );
  }

  getWeatherForecast() {
    this.httpClient.get<any>(`${this.getCurrentHost()}/api/weatherforecast`)
      .subscribe(
        (response) => {
          console.log('Weather forecast:', response);
        },
        (error) => {
          console.error('Error fetching weather forecast:', error);
        }
      );
  }
}
