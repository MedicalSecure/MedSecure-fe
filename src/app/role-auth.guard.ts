import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, firstValueFrom, of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { HttpClient } from '@angular/common/http';
import { ProfileType } from './pages/profile/ProfileType';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RoleAuthGuard implements CanActivate {
    constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService, private router: Router,private http: HttpClient) { }
    profile:ProfileType|undefined;
    
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        
        return this.msalBroadcastService.inProgress$.pipe(
            take(1),
            map((status: InteractionStatus) => {
                console.log('Interaction status:', status);
                return status === InteractionStatus.None;
            }),
            switchMap((interactionNone: boolean) => {
                if (!interactionNone) {
                    return of(false);
                }
                const account = this.authService.instance.getActiveAccount();
                console.log('Active account:', account);
                
                if (account && account.idTokenClaims) {
                    return this.getProfile(environment.apiConfig.uri).pipe(
                        map(() => {
                            
                            if (!this.profile) {
                                return false;
                            }
                            return isAuthorized(this.profile,route.routeConfig?.path ?? "Error");

                        }),
                        catchError(() => {
                            console.log('Error fetching profile');
                            this.router.navigate(['/forbidden']); // Adjust this path as needed
                            return of(false);
                        })
                    );
                } else {
                    console.log('Access denied: no active account or missing claims');
                    this.router.navigate(['/forbidden']); // Adjust this path as needed
                    return of(false);
                }
            })
        );
    }
    
    getProfile(url: string): Observable<any> {
        return this.http.get(url).pipe(
            tap(profile => this.profile = profile)
        );
    }
}

export function isAuthorized(profile:ProfileType,nextPath:string):boolean{
    
    if(!profile.jobTitle)
        return false;
    let job=profile;
    if(nextPath == "doctor-dashboard")
        return getRole(job).isDoctor
    if(nextPath == "nutritionist-dashboard")
        return getRole(job).isNutritionist;
    if(nextPath == "supervisor-dashboard")
        return getRole(job).isSupervisor;
    if(nextPath == "nurse-dashboard")
    return getRole(job).isNurse;
    if(nextPath == "reception-dashboard")
        return getRole(job).isReceptionist;
    if(nextPath == "pharmacist-dashboard")
        return getRole(job).isPharmacist;

    if(nextPath == "register")
        return getRole(job).isReceptionist || getRole(job).isSupervisor;

    if(nextPath == "unit-care")
        return getRole(job).isSupervisor;
    if(nextPath == "pharmacy")
        return getRole(job).isPharmacist || getRole(job).isSupervisor;
    
    if(nextPath == "prescribe")
        return getRole(job).isDoctor || getRole(job).isSupervisor;
    if(nextPath == "bac-patient")
        return getRole(job).isNurse || getRole(job).isSupervisor;
    if(nextPath == "timeline")
        return getRole(job).isNurse || getRole(job).isSupervisor;
    if(nextPath == "visits")
        return getRole(job).isDoctor || getRole(job).isSupervisor;
 
    if(nextPath == "diet")
        return getRole(job).isNutritionist || getRole(job).isSupervisor;
    if(nextPath == "meals")
        return getRole(job).isNutritionist || getRole(job).isSupervisor;

        return getRole(job).isDoctor || getRole(job).isSupervisor;
    if(nextPath == "tasks")
        return true;

    //normally false in unknown route
    return true;

}

export function getRole(profile:ProfileType | undefined){
    return {
        isReceptionist: profile?.jobTitle === environment.roles.RECEPTIONIST_ROLE,
        isDoctor: profile?.jobTitle === environment.roles.DOCTOR_ROLE,
        isPharmacist: profile?.jobTitle === environment.roles.PHARMACIST_ROLE,
        isNutritionist: profile?.jobTitle === environment.roles.NUTRITIONIST_ROLE,
        isSupervisor: profile?.jobTitle === environment.roles.SUPERVISOR_ROLE,
        isNurse: profile?.jobTitle === environment.roles.NURSE_ROLE,
      };
}



/* OLD FILE (these are temps working with Jobtitle) below is the code for token claims */

/* 
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';

@Injectable({
    providedIn: 'root'
})
export class RoleAuthGuard implements CanActivate {
    constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.msalBroadcastService.inProgress$.pipe(
            // Only proceed when no interaction is in progress
            take(1),
            map((status: InteractionStatus) => {
                console.log('Interaction status:', status);
                return status === InteractionStatus.None;
            }),
            map(() => {
                const account = this.authService.instance.getActiveAccount();
                console.log('Active account:', account);
                
                if (account && account.idTokenClaims) {
                    const isAdminClaim = account.idTokenClaims['extension_MedsecureRole'];
                    console.log('Admin claim:', isAdminClaim);
                    
                    if (isAdminClaim === 'Admin' || isAdminClaim === 'SuperAdmin') {
                        console.log('Access granted');
                        return true;
                    } else {
                        console.log('Access denied: insufficient role');
                        this.router.navigate(['/forbidden']); // Adjust this path as needed
                        return false;
                    }
                } else {
                    console.log('Access denied: no active account or missing claims');
                    this.router.navigate(['/forbidden']); // Adjust this path as needed
                    return false;
                }
            })
        );
    }
}

*/