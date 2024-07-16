import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { AzureGraphService } from '../../azure-graph.service';
import { User } from '../../pages/account/account.component';

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
export class NavbarComponent implements OnInit, OnDestroy {
  @Input()
  currentUser: User | undefined;

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
    private graphService: AzureGraphService
  ) {}

  //TO REMOVE: Testing purpose
  /*   ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      let role = DOCTOR_ROLE;
      this.ConnectSignalRByRole(role);
    }, this.connectSignalRAfter * 1000);
  } */

  async ngOnInit() {
    //removed for improving performance, already fetched by the parent : Home page
    //this.getLoginInfo();

    // connect signal r after this.connectSignalRAfter seconds
    // remove this in case getLoginInfo is called, it's already built in there
    setTimeout(() => {
      this.connectSignalR();
    }, this.connectSignalRAfter * 1000);

  }

  ngOnDestroy(): void {
    this.currentUser?.roles?.forEach((role) =>
      this.DisconnectSignalRByRole(role)
    );
  }

  connectSignalR() {
    if (!this.currentUser)
      return this.snackBarMessages.displaySnackBarMessage(
        'Notifications disabled: No connected user',
        snackbarMessageType.Warning,
        3
      );

    let roles = extractRolesFromProfile(this.currentUser);
    if (!roles || roles.length == 0)
      return this.snackBarMessages.displaySnackBarMessage(
        'Notifications disabled: No suitable role for this user',
        snackbarMessageType.Warning,
        3
      );
    roles.forEach((role, index) => {
      //connect the first one immediately
      if (index == 0) this.ConnectSignalRByRole(role);
      else
        setTimeout(() => {
          //delay others by 2000ms
          this.ConnectSignalRByRole(role);
        }, 2000);
    });
  }

  //Can be used in case of removing the INPUT currentUser
  getLoginInfo() {
    this.graphService.getCurrentUserWithRole().subscribe((account) => {
      this.currentUser = account;

      // connect signal r after this.connectSignalRAfter seconds
      setTimeout(() => {
        this.connectSignalR();
      }, this.connectSignalRAfter * 1000);
    });
  }
 displayTabs: boolean = true;
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
 

  async ConnectSignalRByRole(role: string | undefined) {
    if (!role) return;
    if (role == environment.roles.DOCTOR_ROLE)
      await this.prescriptionService.connectSignalR();
    else if (role == environment.roles.PHARMACIST_ROLE)
      await this.drugsService.connectSignalR();
  }

  async DisconnectSignalRByRole(role: string | undefined) {
    if (!role) return;
    if (role == environment.roles.DOCTOR_ROLE)
      await this.prescriptionService.disconnectSignalR();
    else if (role == environment.roles.PHARMACIST_ROLE)
      await this.drugsService.disconnectSignalR();
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

export function extractRolesFromProfile(
  profile: User | null | undefined
): string[] | null {
  if (!profile || !profile.roles) return null;
  let roles: Set<string> = new Set<string>();
  profile.roles.forEach((role) => {
    switch (role.toLowerCase()) {
      case environment.roles.DOCTOR_ROLE:
        roles.add(environment.roles.DOCTOR_ROLE);
        break;
      case environment.roles.PHARMACIST_ROLE:
        roles.add(environment.roles.PHARMACIST_ROLE);
        break;
      case environment.roles.RECEPTIONIST_ROLE:
        roles.add(environment.roles.RECEPTIONIST_ROLE);
        break;
      case environment.roles.NUTRITIONIST_ROLE:
        roles.add(environment.roles.NUTRITIONIST_ROLE);
        break;
      case environment.roles.SUPERVISOR_ROLE:
        roles.add(environment.roles.SUPERVISOR_ROLE);
        break;
      case environment.roles.NURSE_ROLE:
        roles.add(environment.roles.NURSE_ROLE);
        break;
    }
  });
  return Array.from(roles);
}
