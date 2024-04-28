import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../partials/footer/footer.component';
import { NavbarComponent } from '../../partials/navbar/navbar.component';
import { SettingsPanelComponent } from '../../partials/settings-panel/settings-panel.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../service/login.service';

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
  ],
})

export class HomeComponent implements OnInit {
  loginDisplay = false;

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {
    
  }

  ngOnInit(): void {
    this.loginDisplay = this.loginService.loginDisplay;
    console.log("Assem u are " + this.loginDisplay);
}
}
 
