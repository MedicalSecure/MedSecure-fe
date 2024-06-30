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
import { SnackBarMessagesService } from '../../services/util/snack-bar-messages.service';
import { snackbarMessageType } from '../../components/snack-bar-messages/snack-bar-messages.component';
import {RoleAuthGuard} from '../../../app/role-auth.guard'
import { log } from 'console';

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
/*   roles = [
    { value: DOCTOR_ROLE, label: 'Doctor' },
    { value: PHARMACIST_ROLE, label: 'Pharmacist' },
    { value: RECEPTIONIST_ROLE, label: 'Receptionist' },
  ];
  selectedRole = DOCTOR_ROLE; */

  // connect signal r after loading the app by X seconds in seconds
  connectSignalRAfter = 3;


  constructor(
    private router: Router,
    private prescriptionService: PrescriptionApiService,
    private drugsService: DrugService,
    private http: HttpClient,
    private authService: MsalService,
    private snackBarMessages: SnackBarMessagesService,
    public  roleAuth : RoleAuthGuard

  ) {}
  role : string ;
  //TO REMOVE: Testing purpose
/*   ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      let role = DOCTOR_ROLE;
      this.ConnectSignalRByRole(role);
    }, this.connectSignalRAfter * 1000);
  } */

  ngOnInit() {
    this.getProfile(environment.apiConfig.uri);
    this.role = this.roleAuth.profile?.jobTitle as string;
    console.log(this.role);
    

  }

  getProfile(url: string) {
    this.http.get(url).subscribe((profile) => {
      this.profile = profile;
      setTimeout(() => {
        let role = extractRoleFromProfile(profile);
        if(!role)
          return this.snackBarMessages.displaySnackBarMessage("Notifications disabled: No suitable role for this user",snackbarMessageType.Warning,3)
        this.ConnectSignalRByRole(role);
      }, this.connectSignalRAfter * 1000);
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
    if (role == environment.roles.DOCTOR_ROLE) await this.prescriptionService.connectSignalR();
    else if (role == environment.roles.PHARMACIST_ROLE) await this.drugsService.connectSignalR();
  }
  async DisconnectSignalRByRole(role: string | undefined) {
    if (!role) return;
    if (role == environment.roles.DOCTOR_ROLE) await this.prescriptionService.disconnectSignalR();
    else if (role == environment.roles.PHARMACIST_ROLE) await this.drugsService.disconnectSignalR();
  }


  //TO REMOVE - testing purposes
/*   async onRoleChange(event: Event) {
    //disconnect the old role
    await this.DisconnectSignalRByRole(this.selectedRole)
    const selectElement = event.target as HTMLSelectElement;
    this.selectedRole = selectElement.value;
    console.log(`Selected role: ${this.selectedRole}`);
    setTimeout(() => {
      this.ConnectSignalRByRole(this.selectedRole);   
    }, 2000);
    
  } */
}

export function extractRoleFromProfile(profile: ProfileType | null | undefined): string | null {
  if (!profile || !profile.jobTitle) return null;
  let role = profile.jobTitle;
  switch (role.toLowerCase()) {
    case environment.roles.DOCTOR_ROLE:
      return environment.roles.DOCTOR_ROLE;
    case environment.roles.PHARMACIST_ROLE:
      return environment.roles.PHARMACIST_ROLE;
    case environment.roles.RECEPTIONIST_ROLE:
      return environment.roles.RECEPTIONIST_ROLE;
    case environment.roles.NUTRITIONIST_ROLE:
      return environment.roles.NUTRITIONIST_ROLE;
    case environment.roles.SUPERVISOR_ROLE:
      return environment.roles.SUPERVISOR_ROLE;
    case environment.roles.NURSE_ROLE:
      return environment.roles.NURSE_ROLE;
    default:
      return null;
  }
}