import { Component } from '@angular/core';
import { ActivitiesComponent } from '../../../components/activities/activities.component';
import { BacPatientService } from '../../../services/bacPatient/bac-patient-services.service';

@Component({
  selector: 'app-nurse-dashboard',
  standalone: true,
  imports: [ActivitiesComponent],
  templateUrl: './nurse-dashboard.component.html',
  styleUrl: './nurse-dashboard.component.css'
})
export class NurseDashboardComponent {
constructor(public bacPatientService : BacPatientService){}
}
