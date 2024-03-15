import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Page1Component } from './pages/page1/page1.component';
import { ScatterChartsComponent } from './components/charts/scatter-charts/scatter-charts.component';
import {WidgetsPageComponent} from './pages/widgets-page/widgets-page.component'
import {SelectComponent} from './components/select/select.component'
import {ChipsInputComponent} from './components/chips-input/chips-input.component'
import {DetectionTempComponent} from './components/detection-temp/detection-temp.component'
export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'page1', component: Page1Component } ,
    { path: 'widget', component:WidgetsPageComponent },
    { path: 'scattercharts', component: ScatterChartsComponent },
    { path: 'select', component:SelectComponent },
    { path: 'chipsinput', component:ChipsInputComponent },
    { path: 'detectiontemp', component:DetectionTempComponent },
];


