import { Component } from '@angular/core';
import { ActivityDto, ActivityView } from '../../../types';
import { PrescriptionApiService } from '../../../services/prescription/prescription-api.service';
import { ActivitiesComponent } from '../../../components/activities/activities.component';
import { UnitCareService } from '../../../services/unitCare/unit-care.service';

@Component({
  selector: 'app-doctors-dashboard',
  standalone: true,
  imports: [ActivitiesComponent],
  templateUrl: './doctors-dashboard.component.html',
  styleUrl: './doctors-dashboard.component.css',
})
export class DoctorsDashboardComponent {
  isActivities = true;

  constructor(public prescriptionService: PrescriptionApiService) {}
}
