import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../../partials/footer/footer.component";
import { NavbarComponent } from "../../partials/navbar/navbar.component";
import { SettingsPanelComponent } from "../../partials/settings-panel/settings-panel.component";
import { SidebarComponent } from "../../partials/sidebar/sidebar.component";

@Component({
    selector: 'app-index',
    standalone: true,
    templateUrl: './index.component.html',
    styleUrl: './index.component.css',
    imports: [
        RouterModule,
        FooterComponent,
        NavbarComponent,
        SettingsPanelComponent,
        SidebarComponent
    ]
})
export class IndexComponent {
  
  constructor(private router: Router) {}
}