import { Routes } from '@angular/router';
import { MedicationSearchComponent } from './components/medication-search/medication-search.component';
import { BacPatientComponent} from './pages/bacPatient/bacPatient.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Page1Component } from './pages/page1/page1.component';
import { PharmacyComponent } from './pages/pharmacy/pharmacy.component';
import { Visits  } from './pages/visits/visits.component';
import { ChartsScatterMedComponent } from './components/charts/charts-scatter-med/charts-scatter-med.component';
import {WidgetsPageComponent} from './pages/widgets-page/widgets-page.component'
import {UnitSelectEnviroMonitorComponent} from './components/UnitSelect-EnviroMonitor/UnitSelect-EnviroMonitor.component'
import {ChipUnitSelectorEnviroMonitor} from './components/ChipUnitSelector-EnviroMonitor/ChipUnitSelector-EnviroMonitor.component'
import {MultiSenseEnviroScanComponent} from './components/MultiSense-EnviroScan/MultiSense-EnviroScan.component'
import { UnitCareComponent } from './pages/unit-care/unit-care.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { WidgetMedecineComponent } from './pages/widget-medecine/widget-medecine.component';


export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'page1', component: Page1Component } ,
    {path:'unit-care',component:UnitCareComponent},
    {path:'visits',component:Visits},
    {path:'bac-patient',component:BacPatientComponent},
    {path:'pharmacy',component:PharmacyComponent},
    {path:'widgetmedecine',component:WidgetMedecineComponent},
    {path:'selectbo',component:UnitSelectEnviroMonitorComponent},
    {path:'selectmat',component:ChipUnitSelectorEnviroMonitor},
    {path:'WidgetsPageComponent',component:WidgetsPageComponent},

];

