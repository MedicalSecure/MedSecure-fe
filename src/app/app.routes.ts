import { Routes } from '@angular/router';
import { MedicationSearchComponent } from './components/medication-search/medication-search.component';
import { BacPatientComponent} from './pages/bacPatient/bacPatient.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Page1Component } from './pages/page1/page1.component';
import { PharmacyComponent } from './pages/pharmacy/pharmacy.component';
import { Visits  } from './pages/visits/visits.component';
import { ScatterChartsComponent } from './components/charts/scatter-charts/scatter-charts.component';
import {WidgetsPageComponent} from './pages/widgets-page/widgets-page.component'
import {SelectComponent} from './components/select/select.component'
import {ChipsInputComponent} from './components/chips-input/chips-input.component'
import {DetectionTempComponent} from './components/detection-temp/detection-temp.component'
import { UnitCareComponent } from './pages/unit-care/unit-care.component';

import { TimelineComponent } from './pages/timeline/timeline.component';
export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'page1', component: Page1Component } ,
    {path:'unit-care',component:UnitCareComponent},
];

