import { Routes } from '@angular/router';
import { MedicationSearchComponent } from './medication-search/medication-search.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Page1Component } from './pages/page1/page1.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'page1', component: Page1Component } ,
    {path: 'search', component: MedicationSearchComponent}

];
