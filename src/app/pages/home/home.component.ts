import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../partials/footer/footer.component';
import { NavbarComponent } from '../../partials/navbar/navbar.component';
import { SettingsPanelComponent } from '../../partials/settings-panel/settings-panel.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [provideNativeDateAdapter()],
  imports: [
    RouterModule,
    FooterComponent,
    NavbarComponent,
    SettingsPanelComponent,
    CommonModule,
  ],
})
export class HomeComponent implements OnInit {
  loginDisplay = false;

  constructor(
    private router: Router,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
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
  }
}
