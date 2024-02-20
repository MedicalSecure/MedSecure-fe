import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Page1Component } from './pages/page1/page1.component';
import { AddPrescriptionComponent } from './pages/add-prescription/add-prescription.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'page1', component: Page1Component },
  //{ path: 'add-prescription', component: AddPrescriptionComponent },
  { path: 'prescribe', component: AddPrescriptionComponent },
];
