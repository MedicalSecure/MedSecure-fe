import { Routes } from '@angular/router';
import { RegisterFormComponent } from './register-form/register-form.component';
import { RegisterViewComponent } from './register-view/register-view.component';

export const routes: Routes = [
    { path: 'register', component:RegisterFormComponent },
    { path: 'register-view', component:RegisterViewComponent },
];
