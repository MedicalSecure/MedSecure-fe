import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../../partials/footer/footer.component";
import { NavbarComponent } from "../../partials/navbar/navbar.component";
import { SettingsPanelComponent } from "../../partials/settings-panel/settings-panel.component";
import { SidebarComponent } from "../../partials/sidebar/sidebar.component";
import { provideNativeDateAdapter } from '@angular/material/core';
import { SnackBarMessagesComponent } from '../../components/snack-bar-messages/snack-bar-messages.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    providers: [provideNativeDateAdapter()],
  imports: [
    RouterModule,
    FooterComponent,
    NavbarComponent,
    SettingsPanelComponent,
    SidebarComponent,
    SnackBarMessagesComponent
  ],
})
export class HomeComponent {
  
  constructor(private router: Router) {}
}