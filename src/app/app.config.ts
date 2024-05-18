import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, CSP_NONCE } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideDaterangepickerLocale } from 'ngx-daterangepicker-bootstrap';
import { GanttChartComponent } from 'smart-webcomponents-angular/ganttchart';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule , withInterceptors} from '@angular/common/http';
import { secureApiInterceptor } from './secure-api.interceptor';


const nonce = (
  document.querySelector('meta[name="CSP_NONCE"]') as HTMLMetaElement
)?.content;

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptors([secureApiInterceptor])),
    {
      provide: CSP_NONCE,
      useValue: nonce,
    },
    GanttChartComponent,
    provideDaterangepickerLocale({ separator: ' - ', applyLabel: 'Okay' }),
    provideAnimationsAsync(),
    provideAnimations(),
    HttpClientModule,
    provideHttpClient(),
  ],
};
