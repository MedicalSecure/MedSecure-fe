import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexComponent } from "./pages/index/index.component";
import { SearchBarComponent } from "./components/search-bar/search-bar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, IndexComponent, SearchBarComponent]
})
export class AppComponent {
  title = 'medsecure-fe';
}
