import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { Routes } from '@angular/router';
import { BacPatientComponent } from './pages/bacPatient/bacPatient.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddPharmacyComponent } from './pages/pharmacy/add-pharmacy-component/add-pharmacy.component';
import { Visits } from './pages/visits/visits.component';
import { UnitSelectorComponent } from './components/unitselector/unitselector.component';
import { UnitCareComponent } from './pages/unit-care/unit-care.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { WidgetsComponent } from './pages/widgets/widgets.component';
import { AddPrescriptionComponent } from './pages/prescription/add-prescription-component/add-prescription.component';
import { TasksComponent } from './pages/nurseTasks/nurseTasks.component';
import { MasonryDpiComponent } from './pages/register-details/register-details.component';
import { RegisterFormComponent } from './pages/register-form/register-form.component';
import { RegisterViewComponent } from './pages/register/register.component';
import { NurseDashboardComponent } from './pages/dashboards/nurse-dashboard/nurse-dashboard.component';
import {FormUnitCareComponent} from './components/form-unit-care/form-unit-care.component';
import { AddPersonelsComponent } from './components/add-personels/add-personels.component';
import{SupervisorDashboardComponent} from './components/supervisor-dashboard/supervisor-dashboard.component';


export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: NurseDashboardComponent },
  { path: 'unit-care', component: UnitCareComponent },
  { path: 'visits', component: Visits },
  { path: 'widgets', component: WidgetsComponent },
  { path: 'UnitSelector', component: UnitSelectorComponent },
  { path: 'bac-patient', component: BacPatientComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'search', component: SearchBarComponent },
  { path: 'pharmacy', component: AddPharmacyComponent },
  { path: 'prescribe', component: AddPrescriptionComponent },
  { path: 'register-details', component: MasonryDpiComponent },
  { path: 'register-form', component: RegisterFormComponent },
  { path: 'register', component: RegisterViewComponent },
  { path: 'unitCare-form', component: FormUnitCareComponent },
  {path: 'personels', component : AddPersonelsComponent},
  { path: 'supervisor-dashboard', component: SupervisorDashboardComponent },
];
