import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-register-view',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './register-view.component.html',
  styleUrl: './register-view.component.css'
})
export class RegisterViewComponent {
  viewAsTable = false;

toggleViewMode() {
  this.viewAsTable = !this.viewAsTable;
}

}
