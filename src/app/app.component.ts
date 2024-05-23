
import { HomeComponent } from "./pages/home/home.component";
import '@angular/localize/init'
import { AIPromptModule } from '@progress/kendo-angular-conversational-ui';
import { NgApexchartsModule } from "ng-apexcharts";
import { Component, OnInit, Inject, OnDestroy , NO_ERRORS_SCHEMA  } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink} from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MsalService, MsalModule, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, PopupRequest, RedirectRequest, EventMessage, EventType } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
      RouterOutlet, 
      HomeComponent, 
      AIPromptModule, 
      NgApexchartsModule,
      CommonModule, 
      MsalModule, 
      RouterLink, 
      MatToolbarModule, 
      MatButtonModule, 
      MatMenuModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'medsecure-fe';
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(private router: Router,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService, private http:HttpClient
  ) {
  }

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe();
    this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal

    this.setLoginDisplay();

    this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = "/";
        } else {
          this.setLoginDisplay();
        }
      });
    
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      })

      this.msalBroadcastService.msalSubject$.subscribe((event: EventMessage) => {
        if (event.eventType === EventType.LOGIN_SUCCESS) {
          this.router.navigate(['/dashboard']);
        }
      });
  }
  //This setup ensures that after a successful login, users will be redirected to the /dashboard route.
  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  checkAndSetActiveAccount(){
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  loginRedirect() {
    if (this.msalGuardConfig.authRequest){
      this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  loginPopup() {
    if (this.msalGuardConfig.authRequest){
      this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
      } else {
        this.authService.loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
      });
    }
  }

  logout(popup?: boolean) {
    if (popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: "/"
      });
    } else {
      this.authService.logoutRedirect();
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }





  onApiCall(): void {
    console.log('Initiating API call');
    
    this.authService
      .acquireTokenSilent({
        scopes: ['https://medsecure.onmicrosoft.com/medsecure/api/tasks.read', 'https://medsecure.onmicrosoft.com/medsecure/api/tasks.write'],
      })
      .subscribe(
        (result: AuthenticationResult) => {
          console.log('Token acquired:', result);

          const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + result.accessToken,
          });

          this.http
            .get(API_ENDPOINT, {
              responseType: 'text',
              headers: headers,
            })
            .subscribe(
              (response) => {
                console.log('API response:', response);
              },
              (error) => {
                console.error('HTTP GET request error:', error);
              }
            );
        },
        (error) => {
          console.error('Token acquisition error:', error);
        }
      );
  }
}

const API_ENDPOINT = 'http://localhost:8080/api/WeatherForecast/usa';