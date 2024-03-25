import { Routes } from '@angular/router';
import { MedicationSearchComponent } from './components/medication-search/medication-search.component';
import { BacPatientComponent} from './pages/bacPatient/bacPatient.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Page1Component } from './pages/page1/page1.component';
import { PharmacyComponent } from './pages/pharmacy/pharmacy.component';
import { Visits  } from './pages/visits/visits.component';

import {UnitSelectorWidget} from './components/unitselector-widget/unitselector-widget.component'

import { UnitCareComponent } from './pages/unit-care/unit-care.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { WidgetsComponent } from './pages/widgets/widgets.component';

import {KanbanComponent} from './components/kanban/kanban.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'page1', component: Page1Component } ,
    {path:'unit-care',component:UnitCareComponent},

    {path:'visits',component:Visits},
    {path:'pharmacy',component:PharmacyComponent},
    {path:'widgets',component:WidgetsComponent},
    {path:'UnitSelector',component:UnitSelectorWidget},

    {path:'bac-patient',component:BacPatientComponent},
    {path:'timeline',component:TimelineComponent},
    {path:'kanban',component:KanbanComponent},

];

