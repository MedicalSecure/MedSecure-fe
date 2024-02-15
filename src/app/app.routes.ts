import { Routes } from '@angular/router';
import {BacPatientComponent} from './bac-patient.component/bac-patient.component';
import{TestComponent} from './test/test.component'

export const routes: Routes = [
    { path: 'bac-patient', component: BacPatientComponent} ,
    { path: 'test', component: TestComponent} ,
];