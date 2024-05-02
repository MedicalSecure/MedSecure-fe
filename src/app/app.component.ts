import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import '@angular/localize/init'
import { AIPromptModule } from '@progress/kendo-angular-conversational-ui';

import { NgApexchartsModule } from "ng-apexcharts";
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, HomeComponent, AIPromptModule, NgApexchartsModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppComponent {

  constructor() { }
  title = 'medsecure-fe';
}