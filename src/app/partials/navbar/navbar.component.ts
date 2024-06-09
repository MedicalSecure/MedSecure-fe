import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PrescriptionApiService } from '../../services/prescription/prescription-api.service';
import { DrugService } from '../../services/medication/medication.service';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ProfileType } from '../../pages/profile/ProfileType';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  providers: [provideNativeDateAdapter()],
  imports: [
    RouterModule,
    CommonModule,
    MatDatepickerModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOption,
    FormsModule,
    NavbarComponent,
  ],
})
export class NavbarComponent implements OnInit {

  profile: ProfileType | undefined;

  //TO REMOVE AFTER AZURE
  roles = [
    { value: DOCTOR_ROLE, label: 'Doctor' },
    { value: PHARMACIST_ROLE, label: 'Pharmacist' },
    { value: RECEPTIONIST_ROLE, label: 'Receptionist' },
  ];
  selectedRole = DOCTOR_ROLE;

  // connect signal r after loading the app by X seconds in seconds
  connectSignalRAfter = 5;

  constructor(
    private router: Router,
    private prescriptionService: PrescriptionApiService,
    private drugsService: DrugService,
    private http: HttpClient,
    private authService: MsalService
  ) {}

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      let role = DOCTOR_ROLE;
      this.ConnectSignalRByRole(role);
    }, this.connectSignalRAfter * 1000);
  }

  ngOnInit() {
    this.getProfile(environment.apiConfig.uri);
  }

  getProfile(url: string) {
    this.http.get(url).subscribe((profile) => {
      this.profile = profile;
    });
  }

  loginDisplay = false;
  logout(popup?: boolean) {
    if (popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } else {
      this.authService.logoutRedirect();
      this.authService.logout();
    }
  }
  displayTabs: boolean = true;

  async ConnectSignalRByRole(role: string | undefined) {
    if (!role) return;
    if (role == DOCTOR_ROLE) await this.prescriptionService.connectSignalR();
    else if (role == PHARMACIST_ROLE) await this.drugsService.connectSignalR();
  }
  async DisconnectSignalRByRole(role: string | undefined) {
    if (!role) return;
    if (role == DOCTOR_ROLE) await this.prescriptionService.disconnectSignalR();
    else if (role == PHARMACIST_ROLE) await this.drugsService.disconnectSignalR();
  }
  //TO REMOVE
  async onRoleChange(event: Event) {
    //disconnect the old role
    await this.DisconnectSignalRByRole(this.selectedRole)
    const selectElement = event.target as HTMLSelectElement;
    this.selectedRole = selectElement.value;
    console.log(`Selected role: ${this.selectedRole}`);
    setTimeout(() => {
      this.ConnectSignalRByRole(this.selectedRole);   
    }, 2000);
    
  }
}

export const DOCTOR_ROLE = 'doctor';
export const PHARMACIST_ROLE = 'pharmacist';
export const RECEPTIONIST_ROLE = 'receptionist';
