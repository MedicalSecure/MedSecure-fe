import { Routes } from '@angular/router';

import {BacPatientComponent} from './bac-patient.component/bac-patient.component';
import{TestComponent} from './test/test.component'

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Page1Component } from './pages/page1/page1.component';
import { TableSortingExample } from './table-sorting-example/table-sorting-example.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'page1', component: Page1Component } ,
    { path: 'bac-patient', component: TestComponent} ,
    { path: 'exemple', component: TableSortingExample} ,
    
];
