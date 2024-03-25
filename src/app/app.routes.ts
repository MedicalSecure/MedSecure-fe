import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { Routes } from '@angular/router';
import { BacPatientComponent} from './pages/bacPatient/bacPatient.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Page1Component } from './pages/page1/page1.component';
import { PharmacyComponent } from './pages/pharmacy/pharmacy.component';
import { Visits } from './pages/visits/visits.component';
import { ScatterChartsComponent } from './components/charts/scatter-charts/scatter-charts.component';
import { WidgetsPageComponent } from './pages/widgets-page/widgets-page.component';
import { SelectComponent } from './components/select/select.component';
import { ChipsInputComponent } from './components/chips-input/chips-input.component';
import { DetectionTempComponent } from './components/detection-temp/detection-temp.component';
import { UnitCareComponent } from './pages/unit-care/unit-care.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { AddPrescriptionComponent } from './pages/add-prescription/add-prescription-component/add-prescription.component';

import {KanbanComponent} from './components/kanban/kanban.component';
export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'page1', component: Page1Component } ,
    {path:'unit-care',component:UnitCareComponent},
    {path:'bac-patient',component:BacPatientComponent},
    {path:'timeline',component:TimelineComponent},
    {path:'kanban',component:KanbanComponent},
    {path:'search',component:SearchBarComponent},
    {path:'pharmacy',component:PharmacyComponent},
    { path: 'prescribe', component: AddPrescriptionComponent },
];
