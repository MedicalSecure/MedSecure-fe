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
import { AddPrescriptionComponent } from './pages/prescription/add-prescription-component/add-prescription.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { MasonryDpiComponent } from './pages/register-details/register-details.component';
import { RegisterFormComponent } from './pages/register-form/register-form.component';
import { RegisterViewComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FailedComponent } from './pages/failed/failed.component';
import { MsalGuard } from '@azure/msal-angular';
import { DietComponent } from './pages/diet/diet.component';
import { WasteComponent } from './pages/waste/waste.component';
import { RoleAuthGuard } from './role-auth.guard';
import { AccountComponent } from './pages/account/account.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent , canActivate: [MsalGuard] },
  { path: 'unit-care', component: UnitCareComponent, canActivate: [MsalGuard] },
  { path: 'visits', component: VisitsComponent , canActivate: [MsalGuard] },
  { path: 'widgets', component: WidgetsComponent , canActivate: [MsalGuard] },
  { path: 'UnitSelector', component: UnitSelectorComponent , canActivate: [MsalGuard] },
  { path: 'bac-patient', component: BacPatientComponent , canActivate: [MsalGuard] },
  { path: 'timeline', component: TimelineComponent, canActivate: [MsalGuard] },
  { path: 'tasks', component: TasksComponent , canActivate: [MsalGuard] },
  { path: 'search', component: SearchBarComponent , canActivate: [MsalGuard] },
  { path: 'pharmacy', component: PharmacyComponent , canActivate: [MsalGuard] },
  { path: 'prescribe', component: AddPrescriptionComponent, canActivate: [MsalGuard] },
  { path: 'register-details', component: MasonryDpiComponent , canActivate: [MsalGuard] },
  { path: 'register-form', component: RegisterFormComponent , canActivate: [MsalGuard] },
  { path: 'register', component: RegisterViewComponent , canActivate: [MsalGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [MsalGuard] },
  { path: 'account', component: AccountComponent, canActivate: [MsalGuard] },
  { path: 'login-failed', component: FailedComponent },
  { path: 'diet', component: DietComponent },
  { path: 'waste', component: WasteComponent , canActivate: [RoleAuthGuard] },
];
