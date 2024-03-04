import { Routes } from '@angular/router';
import { RegisterFormComponent } from './register-form/register-form.component';
import { RegisterViewComponent } from './register-view/register-view.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Page1Component } from './pages/page1/page1.component';
import { MasonryDpiComponent } from './components/masonry-dpi/masonry-dpi.component';


export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'register', component: RegisterFormComponent },
  { path: 'view', component: MasonryDpiComponent },
  { path: 'register-view', component: RegisterViewComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'page1', component: Page1Component },
];
