import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Page1Component } from './pages/page1/page1.component';
import { ChartsComponent  } from './pages/charts/charts.component';
import { GrapheComponent  } from './components/charts/graphe/graphe.component';
import { RadialbarChartsComponent } from './components/charts/radialbar-charts/radialbar-charts.component';
import { ChartsPageComponent } from './pages/charts-page/charts-page.component';
import { ColumnChartsComponent} from './components/charts/column-charts/column-charts.component';
import {WidgetsPageComponent} from './pages/widgets-page/widgets-page.component'
export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'page1', component: Page1Component } ,
    { path: 'Widget', component:WidgetsPageComponent },
    // { path: 'charts', component: ChartsComponent },
    // { path: 'WidgetPage', component:ChartsPageComponent },
    // { path: 'graphe', component: GrapheComponent },
    // { path: 'graphe2', component: RadialbarChartsComponent },
    // { path: 'ColumnChartsComponent', component: ColumnChartsComponent},
];


