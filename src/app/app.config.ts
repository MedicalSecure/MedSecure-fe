import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideDaterangepickerLocale } from "ngx-daterangepicker-bootstrap";
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
              provideDaterangepickerLocale({separator: ' - ', applyLabel: 'Okay',}), 
              provideAnimationsAsync(), provideHttpClient()]
};
