import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexComponent } from "./pages/index/index.component";
import '@angular/localize/init'
import { AIPromptModule } from '@progress/kendo-angular-conversational-ui';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, IndexComponent , AIPromptModule]
})
export class AppComponent {
  title = 'medsecure-fe';
}
