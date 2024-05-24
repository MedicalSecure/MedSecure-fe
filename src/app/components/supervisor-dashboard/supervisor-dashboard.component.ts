import { Component, OnInit } from '@angular/core';
import { Patient } from '../../model/unitCare/PatientI';
import {SupervisorDashboardService} from  '../../services/unitCare/supervisor-dashboard.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivitiesComponent } from '../activities/activities.component';
import { TaskComponent } from "../task/task.component";
import { WidgetsAllDataComponent } from '../list-widget/widgets-all-data/widgets-all-data.component';

import { WidgetsListePrescriptionComponent } from '../list-widget/widgets-liste-prescription/widgets-liste-prescription.component';
import { MultiSenseWidgetComponent } from "../widgets/multisense-widget/multisense-widget.component";
import { WidgetsListeMedicationsComponent } from "../list-widget/widgets-liste-medications/widgets-liste-medications.component";
import { WidgetsListeReptureComponent } from "../list-widget/widgets-liste-repture/widgets-liste-repture.component";
import { WidgetsArmoireMedComponent } from "../list-widget/widgets-armoire-med/widgets-armoire-med.component";


@Component({
    selector: 'app-supervisor-dashboard',
    standalone: true,
    templateUrl: './supervisor-dashboard.component.html',
    styleUrl: './supervisor-dashboard.component.css',
    imports: [CommonModule, ActivitiesComponent, WidgetsListePrescriptionComponent, WidgetsAllDataComponent, TaskComponent, MultiSenseWidgetComponent, WidgetsListeMedicationsComponent, WidgetsListeReptureComponent, WidgetsArmoireMedComponent]
})
export class SupervisorDashboardComponent implements OnInit {
  patients: Patient[] = [];
  topUrgentPatients: Patient[] = [];
  todayCheckInPatientsCount: number;
  todayCheckOutPatientsCount: number;

  constructor(public  test: SupervisorDashboardService, private http: HttpClient) { }

  ngOnInit():void {
    this.test.getPatients().subscribe(data => {

      this.patients = data;
      this.todayCheckInPatientsCount = this.getTodayPatientsCount('checkInDate');
      this.todayCheckOutPatientsCount = this.getTodayPatientsCount('checkOutDate');

    });

    this.test.getTopUrgentPatients().subscribe(
      patients => {
        this.topUrgentPatients = patients;
        console.log('Top Urgent Patients in Component:', this.topUrgentPatients);
      },
      error => {
        console.error('Error fetching top urgent patients:', error);
      }
    );

  }

  private getTodayPatientsCount(dateType: 'checkInDate' | 'checkOutDate'): number {
    const today = new Date();
    return this.patients.filter(patient => {
      const date = new Date(patient[dateType]);
      return date.toDateString() === today.toDateString();
    }).length;
  }



}

