import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideDaterangepickerLocale } from "ngx-daterangepicker-bootstrap";
import { GanttChartComponent, GanttChartTaskColumn } from 'smart-webcomponents-angular/ganttchart';
import { provideAnimations } from '@angular/platform-browser/animations';

 

export const appConfig: ApplicationConfig = {


  providers: [provideRouter(routes) , GanttChartComponent ,
    provideDaterangepickerLocale({separator: ' - ', applyLabel: 'Okay',}), 
        provideAnimationsAsync(), provideAnimations()]

};

