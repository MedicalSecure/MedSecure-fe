import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Page1Component } from './pages/page1/page1.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PharmacyComponent } from './pages/pharmacy/pharmacy.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'page1', component: Page1Component } ,
    { path: 'search', component: SearchBarComponent},
    { path: 'pharmacy', component: PharmacyComponent }
];
