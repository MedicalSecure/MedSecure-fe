import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexComponent } from "./pages/index/index.component";
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { CalendarShedulerComponent  } from './components/calendar-scheduler/calendar-scheduler.component';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    schemas: [NO_ERRORS_SCHEMA],
    imports: [RouterOutlet, IndexComponent,CalendarShedulerComponent]
})
export class AppComponent {

  constructor() { }
  title = 'medsecure-fe';


}
