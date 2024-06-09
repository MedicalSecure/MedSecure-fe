import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideDaterangepickerLocale } from 'ngx-daterangepicker-bootstrap';
import { GanttChartComponent } from 'smart-webcomponents-angular/ganttchart';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HttpInterceptorConfig, RetryInterceptor } from './config/httpInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    GanttChartComponent,
    provideDaterangepickerLocale({ separator: ' - ', applyLabel: 'Okay' }),
    provideAnimationsAsync(),
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RetryInterceptor,
      multi: true
    }
  ],
};


