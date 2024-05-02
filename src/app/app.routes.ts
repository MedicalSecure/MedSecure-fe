import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { Routes } from '@angular/router';
import { BacPatientComponent } from './pages/bacPatient/bacPatient.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PharmacyComponent } from './pages/pharmacy/pharmacy.component';
import { VisitsComponent } from './pages/visits/visits.component';
import { UnitSelectorComponent } from './components/unitselector/unitselector.component';
import { UnitCareComponent } from './pages/unit-care/unit-care.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { WidgetsComponent } from './pages/widgets/widgets.component';
import { ShipsSelectComponent } from './components/chips-select/chips-select.component';
import { AddPrescriptionComponent } from './pages/add-prescription/add-prescription-component/add-prescription.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { MasonryDpiComponent } from './pages/register-details/register-details.component';
import { RegisterFormComponent } from './pages/register-form/register-form.component';
import { RegisterViewComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FailedComponent } from './pages/failed/failed.component';
import { WasteComponent } from './pages/waste/waste.component';
import { RoleAuthGuard } from './core/role-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent ,canActivate: [RoleAuthGuard] },
  { path: 'unit-care', component: UnitCareComponent}, // canActivate: [RoleAuthGuard] },
  { path: 'visits', component: VisitsComponent }, // canActivate: [RoleAuthGuard] },
  { path: 'widgets', component: WidgetsComponent }, // canActivate: [RoleAuthGuard] },
  { path: 'UnitSelector', component: UnitSelectorComponent }, // canActivate: [RoleAuthGuard] },
  { path: 'bac-patient', component: BacPatientComponent}, // canActivate: [RoleAuthGuard] },
  { path: 'timeline', component: TimelineComponent}, // canActivate: [RoleAuthGuard] },
  { path: 'tasks', component: TasksComponent }, // canActivate: [RoleAuthGuard] },
  { path: 'search', component: SearchBarComponent }, // canActivate: [RoleAuthGuard] },
  { path: 'pharmacy', component: PharmacyComponent }, // canActivate: [RoleAuthGuard] },
  { path: 'prescribe', component: AddPrescriptionComponent}, // canActivate: [RoleAuthGuard] },
  { path: 'register-details', component: MasonryDpiComponent }, // canActivate: [RoleAuthGuard] },
  { path: 'register-form', component: RegisterFormComponent }, // canActivate: [RoleAuthGuard] },
  { path: 'register', component: RegisterViewComponent }, // canActivate: [RoleAuthGuard] },
  { path: 'profile', component: ProfileComponent}, // canActivate: [RoleAuthGuard] },
  { path: 'waste', component: WasteComponent}, // canActivate: [RoleAuthGuard] },
  { path: 'login-failed', component: FailedComponent },
];
