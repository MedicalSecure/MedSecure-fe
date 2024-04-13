import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { Routes } from '@angular/router';
import { BacPatientComponent } from './pages/bacPatient/bacPatient.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PharmacyComponent } from './pages/pharmacy/pharmacy.component';
import { Visits } from './pages/visits/visits.component';
import { UnitSelectorComponent } from './components/unitselector/unitselector.component';
import { UnitCareComponent } from './pages/unit-care/unit-care.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { WidgetsComponent } from './pages/widgets/widgets.component';
import { ShipsSelectComponent } from './components/chips-select/chips-select.component';
import { AddPrescriptionComponent } from './pages/add-prescription/add-prescription-component/add-prescription.component';
import { KanbanComponent } from './components/kanban/kanban.component';
import { MasonryDpiComponent } from './pages/register-details/register-details.component';
import { RegisterFormComponent } from './pages/register-form/register-form.component';
import { RegisterViewComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'unit-care', component: UnitCareComponent },
  { path: 'visits', component: Visits },
  { path: 'widgets', component: WidgetsComponent },
  { path: 'UnitSelector', component: UnitSelectorComponent },
  { path: 'bac-patient', component: BacPatientComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'kanban', component: KanbanComponent },
  { path: 'search', component: SearchBarComponent },
  { path: 'pharmacy', component: PharmacyComponent },
  { path: 'prescribe', component: AddPrescriptionComponent },
  { path: 'register-details', component: MasonryDpiComponent },
  { path: 'register-form', component: RegisterFormComponent },
  { path: 'register', component: RegisterViewComponent },
];
