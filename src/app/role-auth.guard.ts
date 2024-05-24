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
