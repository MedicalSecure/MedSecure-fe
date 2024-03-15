import { Routes } from '@angular/router';
import { MedicationSearchComponent } from './components/medication-search/medication-search.component';
import{BacPatientComponent} from './pages/bacPatient/bacPatient.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Page1Component } from './pages/page1/page1.component';
import { PharmacyComponent } from './pages/pharmacy/pharmacy.component';
import { Visits  } from './pages/visits/visits.component';


import { TimelineComponent } from './pages/timeline/timeline.component';
export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'page1', component: Page1Component } ,
    { path: 'visits', component: Visits  },
    { path: 'bac-patient', component: BacPatientComponent} ,
    { path: 'timeLine', component: TimelineComponent} ,   
    {path: 'search', component: MedicationSearchComponent},
    {path: 'pharmacy', component: PharmacyComponent},

    

];
