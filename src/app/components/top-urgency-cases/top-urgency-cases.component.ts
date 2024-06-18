import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient/patient.service';
import { Patients } from '../../model/patients';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-urgency-cases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-urgency-cases.component.html',
  styleUrl: './top-urgency-cases.component.css'
})
export class TopUrgencyCasesComponent implements OnInit {
  topUrgencyPatients: Patients[] = [];
  constructor(private patientService: PatientService) { }
  ngOnInit(): void {
    this.GetTopUrgencyPatient()
  }

   GetTopUrgencyPatient(): void {
    this.patientService.getTopUrgencyPatients().subscribe(
      (patients: Patients[]) => {
        this.topUrgencyPatients = patients;
      },
      error => {
        console.error('Error fetching top urgency patients:', error);
      }
    );
  }

}