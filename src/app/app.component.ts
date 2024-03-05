import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexComponent } from "./pages/index/index.component";
import { NgApexchartsModule } from "ng-apexcharts";
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, IndexComponent,NgApexchartsModule]
})
export class AppComponent {
  title = 'medsecure-fe';
}
