import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../partials/footer/footer.component';
import { NavbarComponent } from '../../partials/navbar/navbar.component';
import { SettingsPanelComponent } from '../../partials/settings-panel/settings-panel.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FailedComponent } from '../failed/failed.component';
import { Component } from '@angular/core';


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
    CommonModule,
    FailedComponent,
    
  ],
})
export class HomeComponent {}