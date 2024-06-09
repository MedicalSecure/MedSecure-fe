import { Component } from '@angular/core';
import { WidgetsAllDataComponent } from '../../../components/list-widget/widgets-all-data/widgets-all-data.component';
import { WidgetsListeMedicationsComponent } from '../../../components/list-widget/widgets-liste-medications/widgets-liste-medications.component';
import { WidgetsArmoireMedComponent } from '../../../components/list-widget/widgets-armoire-med/widgets-armoire-med.component';
import { WidgetsListeReptureComponent } from '../../../components/list-widget/widgets-liste-repture/widgets-liste-repture.component';
import { WidgetsListePrescriptionComponent } from '../../../components/list-widget/widgets-liste-prescription/widgets-liste-prescription.component';
import { MultiSenseWidgetComponent } from '../../../components/widgets/multisense-widget/multisense-widget.component';
import { TaskComponent } from '../../../components/task/task.component';
import { ActivitiesComponent } from '../../../components/activities/activities.component';
import { DrugService } from '../../../services/medication/medication.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pharmacist-dashboard',
  standalone: true,
  imports: 
  [ WidgetsAllDataComponent, 
    WidgetsListeMedicationsComponent, 
    WidgetsArmoireMedComponent, 
    WidgetsListeReptureComponent,
    WidgetsListePrescriptionComponent,
    MultiSenseWidgetComponent,
    TaskComponent,
    ActivitiesComponent
  ],
  templateUrl: './pharmacist-dashboard.component.html',
  styleUrl: './pharmacist-dashboard.component.css'
})
export class PharmacistDashboardComponent {
  totalPrescriptions: number = 30;
  pendingPrescriptions: number = 5;
  validPrescription: number = 15;
  invalidPrescription: number = 10
  reservedStock: number = 40;
  availableStock: number = 70;


  constructor(public  test: DrugService, private http: HttpClient) { }

  ngOnInit():void {
    this.test.getActivities()
    }
}

