/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


// if (environment.production) {
//   enableProdMode();
// }

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// platformBrowserDynamic().bootstrapModule(AppComponent)
// .catch(err => console.error(err));
