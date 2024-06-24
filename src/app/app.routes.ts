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
import { MasonryDpiComponent } from './pages/registration/register-details/register-details.component';
import { RegisterFormComponent } from './pages/registration/register-form/register-form.component';
import { RegisterViewComponent } from './pages/registration/register-list/register-list.component';
// import { DashboardReceptionComponent } from './pages/dashboard-reception/dashboard-reception/dashboard-reception.component';
import { DashboardDoctorComponent } from './pages/dashboards/dashboard-doctor/dashboard-doctor.component';
import { LeaveReportComponent } from './components/leave-report/leave-report.component';
import { NurseTasksComponent } from './pages/nurseTasks/nurseTasks.component';
import { MealsListComponent } from './pages/diet/steps/meals-list/meals-list.component';
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
  { path: 'unit-care', component: UnitCareComponent , canActivate: [RoleAuthGuard] },
  { path: 'visits', component: VisitsComponent , canActivate: [RoleAuthGuard] },
  { path: 'widgets', component: WidgetsComponent , canActivate: [RoleAuthGuard] },
  { path: 'UnitSelector', component: UnitSelectorComponent , canActivate: [RoleAuthGuard] },
  { path: 'bac-patient', component: BacPatientComponent , canActivate: [RoleAuthGuard] },
  { path: 'timeline', component: TimelineComponent , canActivate: [RoleAuthGuard] },
  { path: 'search', component: SearchBarComponent , canActivate: [RoleAuthGuard] },
  { path: 'pharmacy', component: AddPharmacyComponent , canActivate: [RoleAuthGuard] },
  { path: 'pharmacyValidation', component: PrescriptionViewForPrescriptionToValidateComponent , canActivate: [RoleAuthGuard] },
  { path: 'prescribe', component: AddPrescriptionComponent , canActivate: [RoleAuthGuard] },
  { path: 'prescribePDF', component: PdfPrescriptionToPrintComponent , canActivate: [RoleAuthGuard] },
  { path: 'register-details', component: MasonryDpiComponent , canActivate: [RoleAuthGuard] },
  { path: 'register-form', component: RegisterFormComponent , canActivate: [RoleAuthGuard] },
  { path: 'register', component: RegisterViewComponent , canActivate: [RoleAuthGuard] },
  { path: 'LeaveReportComponent', component: LeaveReportComponent , canActivate: [RoleAuthGuard] },
  { path: 'unitCare-form', component: FormUnitCareComponent , canActivate: [RoleAuthGuard] },
  {path: 'personels', component : AddPersonelsComponent, canActivate: [RoleAuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [RoleAuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [RoleAuthGuard] },
  { path: 'login-failed', component: FailedComponent },
  { path: 'diet', component: DietComponent },
  { path: 'waste', component: WasteComponent , canActivate: [RoleAuthGuard] },
  { path: 'nurseTasks', component: NurseTasksComponent , canActivate: [RoleAuthGuard] },

  //dashboards
  { path: 'dashboard', component: DashboardComponent , canActivate: [RoleAuthGuard] },
  { path: 'doctor-dashboard', component: DashboardDoctorComponent , canActivate: [RoleAuthGuard] },
  { path: 'supervisor-dashboard', component: SupervisorDashboardComponent , canActivate: [RoleAuthGuard] },
  { path: 'nurse-dashboard', component: NurseDashboardComponent , canActivate: [RoleAuthGuard] },
// { path: 'reception-dashboard', component: DashboardReceptionComponent },
  ];
  
 
