import { Routes } from '@angular/router';
import{BacPatientComponent} from './bacPatient/bacPatient.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Page1Component } from './pages/page1/page1.component';
import { TimelineComponent } from './timeline/timeline.component';
export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'page1', component: Page1Component } ,
    { path: 'bac-patient', component: BacPatientComponent} ,
    { path: 'timeLine', component: TimelineComponent} ,
    
    
];
