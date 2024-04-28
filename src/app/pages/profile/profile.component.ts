import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileType } from './ProfileType';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {MatTableModule} from '@angular/material/table';
import { protectedResources } from '../../auth-config';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: [],
    standalone: true,
    imports:[MatTableModule]
})
export class ProfileComponent implements OnInit {
  displayedColumns: string[] = ['claim', 'value'];
  dataSource: Claim[] = [];
  private readonly _destroying$ = new Subject<void>();

  profile: ProfileType | undefined;

  constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService,private http: HttpClient) { }

  ngOnInit() {
    this.getProfile(protectedResources.apiConfig.uri);

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) =>  status === InteractionStatus.None || status === InteractionStatus.HandleRedirect),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
        this.getClaims(this.authService.instance.getActiveAccount()?.idTokenClaims)
        console.log("role", this.authService.instance.getActiveAccount()?.idToken);
        console.log("claim", this.authService.instance.getActiveAccount()?.idTokenClaims);
      })
  }

  getProfile(url: string) {
    this.http.get(url)
      .subscribe(profile => {
        this.profile = profile;
      });
  }

  checkAndSetActiveAccount() {

    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    
    }
  }

  getClaims(claims: any) {

    let list: Claim[]  =  new Array<Claim>();
    Object.keys(claims).forEach(function(k, v){
      
      let c = new Claim()
      c.id = v;
      c.claim = k;
      c.value =  claims ? claims[k]: null;
      list.push(c);
    });
    this.dataSource = list;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}

export class Claim {
  id: number;
  claim: string;
  value: string;
}

