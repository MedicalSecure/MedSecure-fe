import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { Routes } from '@angular/router';
import { BacPatientComponent } from './pages/bacPatient/bacPatient.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddPharmacyComponent } from './pages/pharmacy/add-pharmacy-component/add-pharmacy.component';
import { VisitsComponent } from './pages/visits/visits.component';
import { UnitSelectorComponent } from './components/unitselector/unitselector.component';
import { UnitCareComponent } from './pages/unit-care/unit-care.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { WidgetsComponent } from './pages/widgets/widgets.component';
import { AddPrescriptionComponent } from './pages/prescription/add-prescription-component/add-prescription.component';
import { TasksComponent } from './pages/nurseTasks/nurseTasks.component';
import { MasonryDpiComponent } from './pages/registration/register-details/register-details.component';
import { RegisterFormComponent } from './pages/registration/register-form/register-form.component';
import { RegisterViewComponent } from './pages/registration/register-list/register-list.component';
// import { DashboardReceptionComponent } from './pages/dashboard-reception/dashboard-reception/dashboard-reception.component';
import { DashboardDoctorComponent } from './pages/dashboards/dashboard-doctor/dashboard-doctor.component';
import { LeaveReportComponent } from './components/leave-report/leave-report.component';
import { NurseDashboardComponent } from './pages/dashboards/nurse-dashboard/nurse-dashboard.component';
import {FormUnitCareComponent} from './components/form-unit-care/form-unit-care.component';
import { AddPersonelsComponent } from './components/add-personels/add-personels.component';
import{SupervisorDashboardComponent} from './components/supervisor-dashboard/supervisor-dashboard.component';
import { PrescriptionViewForPrescriptionToValidateComponent } from './pages/pharmacy/prescription-view-for-prescription-to-validate/prescription-view-for-prescription-to-validate.component';
import { PdfPrescriptionToPrintComponent } from './components/pdf-prescription-to-print/pdf-prescription-to-print.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FailedComponent } from './pages/failed/failed.component';
import { MsalGuard } from '@azure/msal-angular';
import { DietComponent } from './pages/diet/diet.component';
import { WasteComponent } from './pages/waste/waste.component';
import { RoleAuthGuard } from './role-auth.guard';
import { AccountComponent } from './pages/account/account.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'unit-care', component: UnitCareComponent , canActivate: [MsalGuard] },
  { path: 'visits', component: VisitsComponent , canActivate: [MsalGuard] },
  { path: 'widgets', component: WidgetsComponent , canActivate: [MsalGuard] },
  { path: 'UnitSelector', component: UnitSelectorComponent , canActivate: [MsalGuard] },
  { path: 'bac-patient', component: BacPatientComponent , canActivate: [MsalGuard] },
  { path: 'timeline', component: TimelineComponent , canActivate: [MsalGuard] },
  { path: 'tasks', component: TasksComponent , canActivate: [MsalGuard] },
  { path: 'search', component: SearchBarComponent , canActivate: [MsalGuard] },
  { path: 'pharmacy', component: AddPharmacyComponent , canActivate: [MsalGuard] },
  { path: 'pharmacyValidation', component: PrescriptionViewForPrescriptionToValidateComponent , canActivate: [MsalGuard] },
  { path: 'prescribe', component: AddPrescriptionComponent , canActivate: [MsalGuard] },
  { path: 'prescribePDF', component: PdfPrescriptionToPrintComponent , canActivate: [MsalGuard] },
  { path: 'register-details', component: MasonryDpiComponent , canActivate: [MsalGuard] },
  { path: 'register-form', component: RegisterFormComponent , canActivate: [MsalGuard] },
  { path: 'register', component: RegisterViewComponent , canActivate: [MsalGuard] },
  { path: 'LeaveReportComponent', component: LeaveReportComponent , canActivate: [MsalGuard] },
  { path: 'unitCare-form', component: FormUnitCareComponent , canActivate: [MsalGuard] },
  {path: 'personels', component : AddPersonelsComponent, canActivate: [MsalGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [MsalGuard] },
  { path: 'account', component: AccountComponent, canActivate: [MsalGuard] },
  { path: 'login-failed', component: FailedComponent },
  { path: 'diet', component: DietComponent },
  { path: 'waste', component: WasteComponent , canActivate: [RoleAuthGuard] },
  //dashboards
  { path: 'DashboardDoctor', component: DashboardDoctorComponent , canActivate: [MsalGuard] },
  { path: 'dashboard', component: DashboardComponent , canActivate: [MsalGuard] },
  { path: 'supervisor-dashboard', component: SupervisorDashboardComponent , canActivate: [MsalGuard] },
  { path: 'nurse-dashboard', component: NurseDashboardComponent , canActivate: [MsalGuard] },
// { path: 'reception-dashboard', component: DashboardReceptionComponent },
  ];
  