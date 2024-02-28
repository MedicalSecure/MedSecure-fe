import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IndexComponent } from "./pages/index/index.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, IndexComponent]
})
export class AppComponent {
  title = 'medsecure-fe';
}
