import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexComponent } from "./pages/index/index.component";
import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,RouterOutlet,IndexComponent,CommonModule,MatIconModule,MatTableModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'medsecure-fe';
}
