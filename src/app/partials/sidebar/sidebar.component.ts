import { Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  providers: [provideNativeDateAdapter()],
    imports: [
        RouterModule,
    ],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  constructor(private router: Router) {}
}
