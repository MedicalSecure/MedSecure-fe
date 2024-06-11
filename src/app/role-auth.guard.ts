import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, firstValueFrom, of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { HttpClient } from '@angular/common/http';
import { ProfileType } from './pages/profile/ProfileType';
import { environment } from '../environments/environment';
import { User } from './pages/account/account.component';
import { AzureGraphService } from './azure-graph.service';
import { SnackBarMessagesService } from './services/util/snack-bar-messages.service';
import { snackbarMessageType } from './components/snack-bar-messages/snack-bar-messages.component';

@Injectable({
    providedIn: 'root'
})
export class RoleAuthGuard implements CanActivate {
    constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService, private router: Router,private http: HttpClient,private graphService: AzureGraphService,private snackBarMessages : SnackBarMessagesService) { }
    profile:User|undefined;
    
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
                    return this.graphService.getCurrentUserWithRole().pipe(
                        map((user) => {
                            if (!user) {
                                return false;
                                
                            }
                            this.profile =user;
                            var hasAccess= isAuthorized(user,route.routeConfig?.path ?? "Error");

                            if(!hasAccess)
                                this.snackBarMessages.displaySnackBarMessage("Unauthorized to access that page",snackbarMessageType.Warning,1)
                            return hasAccess;

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
}

export function isAuthorized(profile: User, nextPath: string): boolean {
    if (nextPath === "login-failed") {
        return true; // Allow access to login-failed route
    }

    // If user has no roles, deny access
    if (!profile.roles) {
        return false;
    }

    const roles = getRoles(profile);

    switch (nextPath) {
        case "unit-care":
            return roles.isSupervisor;
        case "visits":
            return roles.isDoctor || roles.isSupervisor;
        case "widgets":
            return true;
        case "UnitSelector":
            return true;
        case "timeline":
            return true;
        case "tasks":
            return true;
        case "search":
            return true;
        case "register-details":
            return roles.isReceptionist || roles.isSupervisor;
        case "register-form":
            return roles.isReceptionist || roles.isSupervisor;
        case "LeaveReportComponent":
            return true
        case "unitCare-form":
            return roles.isSupervisor;
        case "personels":
            return roles.isSupervisor;
        case "profile":
            return true;
        case "account":
            return true;
        case "pharmacyValidation":
            return roles.isPharmacist || roles.isSupervisor;
        case "pharmacy":
            return roles.isPharmacist || roles.isSupervisor;
        case "prescribe":
            return roles.isDoctor || roles.isSupervisor;
        case "prescribePDF":
            return roles.isDoctor || roles.isSupervisor; 
        case "register":
            return roles.isReceptionist || roles.isSupervisor;
        case "doctor-dashboard":
            return roles.isDoctor;
        case "supervisor-dashboard":
            return roles.isSupervisor;
        case "nurse-dashboard":
            return roles.isNurse;
        case "bac-patient":
            return roles.isNurse || roles.isDoctor || roles.isSupervisor;
        case "diet":
            return true; // Allow access to diet for all authenticated users
        case "waste":
            return roles.isSupervisor; // Maybe only supervisors can access waste management?
        case "dashboard":
            return true;
        case "":
            return true; // Allow access to dashboard for all authenticated users
        default:
            return false; // Deny access to unknown routes
    }
}


export function getRoles(profile: User | undefined) {
    const roles = profile?.roles || [];
    const envRoles = [
      environment.roles.RECEPTIONIST_ROLE,
      environment.roles.DOCTOR_ROLE,
      environment.roles.PHARMACIST_ROLE,
      environment.roles.NUTRITIONIST_ROLE,
      environment.roles.SUPERVISOR_ROLE,
      environment.roles.NURSE_ROLE,
    ];
  
    return {
      isReceptionist: roles.includes(environment.roles.RECEPTIONIST_ROLE),
      isDoctor: roles.includes(environment.roles.DOCTOR_ROLE),
      isPharmacist: roles.includes(environment.roles.PHARMACIST_ROLE),
      isNutritionist: roles.includes(environment.roles.NUTRITIONIST_ROLE),
      isSupervisor: roles.includes(environment.roles.SUPERVISOR_ROLE),
      isNurse: roles.includes(environment.roles.NURSE_ROLE),
      hasAnyRole: roles.some(role => envRoles.includes(role)),
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