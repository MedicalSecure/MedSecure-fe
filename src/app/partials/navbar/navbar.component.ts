import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PrescriptionApiService } from '../../services/prescription/prescription-api.service';
import { DrugService } from '../../services/medication/medication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  providers: [],
  imports: [RouterModule, CommonModule],
})
export class NavbarComponent {
  //TO REMOVE AFTER AZURE
  roles = [
    { value: DOCTOR_ROLE, label: 'Doctor' },
    { value: PHARMACIST_ROLE, label: 'Pharmacist' },
    { value: RECEPTIONIST_ROLE, label: 'Receptionist' },
  ];
  selectedRole = DOCTOR_ROLE;

  // connect signal r after loading the app by X seconds in seconds
  connectSignalRAfter = 5;

  constructor(
    private router: Router,
    private prescriptionService: PrescriptionApiService,
    private drugsService: DrugService
  ) {}

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      let role = DOCTOR_ROLE;
      this.ConnectSignalRByRole(role);
    }, this.connectSignalRAfter * 1000);
  }

  async ConnectSignalRByRole(role: string | undefined) {
    if (!role) return;
    if (role == DOCTOR_ROLE) await this.prescriptionService.connectSignalR();
    else if (role == PHARMACIST_ROLE) await this.drugsService.connectSignalR();
  }
  async DisconnectSignalRByRole(role: string | undefined) {
    if (!role) return;
    if (role == DOCTOR_ROLE) await this.prescriptionService.disconnectSignalR();
    else if (role == PHARMACIST_ROLE) await this.drugsService.disconnectSignalR();
  }
  //TO REMOVE
  async onRoleChange(event: Event) {
    //disconnect the old role
    await this.DisconnectSignalRByRole(this.selectedRole)
    const selectElement = event.target as HTMLSelectElement;
    this.selectedRole = selectElement.value;
    console.log(`Selected role: ${this.selectedRole}`);
    setTimeout(() => {
      this.ConnectSignalRByRole(this.selectedRole);   
    }, 2000);
    
  }
}

export const DOCTOR_ROLE = 'doctor';
export const PHARMACIST_ROLE = 'pharmacist';
export const RECEPTIONIST_ROLE = 'receptionist';
