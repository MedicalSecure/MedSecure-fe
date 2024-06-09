import { Component ,OnInit} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../../partials/footer/footer.component";
import { SettingsPanelComponent } from "../../partials/settings-panel/settings-panel.component";
import { provideNativeDateAdapter } from '@angular/material/core';
import { SnackBarMessagesComponent } from '../../components/snack-bar-messages/snack-bar-messages.component';
import { CommonModule } from '@angular/common';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ProfileType } from '../profile/ProfileType';
import { environment } from '../../../environments/environment';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../partials/navbar/navbar.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    providers: [provideNativeDateAdapter()],
  imports: [
    RouterModule,
    CommonModule,
    FooterComponent,
    NavbarComponent,
    SettingsPanelComponent,
    SnackBarMessagesComponent,
    MatProgressSpinner
  ],
})
export class HomeComponent implements OnInit {
  loginDisplay = false;
  profile: ProfileType | undefined;
  
  constructor(
    private router: Router,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
      )
      .subscribe((result: EventMessage) => {
        console.log(result);
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
        
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    this.getProfile(environment.apiConfig.uri);
  }

  getProfile(url: string) {
    this.http.get(url)
      .subscribe(profile => {
        this.profile = profile;
      });
  }

  getRole() {
    return {
      isReceptionist: this.profile?.jobTitle === environment.roles.RECEPTIONIST_ROLE,
      isDoctor: this.profile?.jobTitle === environment.roles.DOCTOR_ROLE,
      isPharmacist: this.profile?.jobTitle === environment.roles.PHARMACIST_ROLE,
      isNutritionist: this.profile?.jobTitle === environment.roles.NUTRITIONIST_ROLE,
      isSupervisor: this.profile?.jobTitle === environment.roles.SUPERVISOR_ROLE,
      isNurse: this.profile?.jobTitle === environment.roles.NURSE_ROLE,
    };
  }
}
