import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export type MedicationType = {
  Name: string;
  Dosage: string;
  Forme: string;
  DCI: string;
  'Expiration Date': string;
  Unit: string;
  Price: string;
  Stock: string;
  'Alert Stock': string;
  'Average Stock': string;
  'Minimum Stock': string;
  'Safety Stock': string;
};

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

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  providers: [provideNativeDateAdapter()],
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    NgIf,
    MatSelectModule,
    MatOption,
    FormsModule,
    NavbarComponent,
    CommonModule,
    ReactiveFormsModule
]
})
export class NavbarComponent implements OnInit {
  private readonly httpClient = inject(HttpClient);
  userProfileClaims$: Observable<UserProfile>;

  constructor(private router: Router) {}

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile() {
    this.userProfileClaims$ = this.httpClient.get<UserProfile>(
      `${this.getCurrentHost()}/api/User`
    );
  }

  private getCurrentHost() {
    const host = window.location.host;
    const url = `${window.location.protocol}//${host}`;
    return url;
  }
}