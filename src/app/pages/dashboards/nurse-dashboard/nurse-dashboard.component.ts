import { Component, OnInit } from '@angular/core';
import { ActivitiesComponent } from '../../../components/activities/activities.component';
import { BacPatientService } from '../../../services/bacPatient/bac-patient-services.service';
import { ELEMENT_DATA, bacpatient } from '../../bacPatient/bacPatient.component';
import { MatTableDataSource } from '@angular/material/table';
import { MultiSenseWidgetComponent } from '../../../components/widgets/multisense-widget/multisense-widget.component';


@Component({
  selector: 'app-nurse-dashboard',
  standalone: true,
  imports: [ActivitiesComponent ,  MultiSenseWidgetComponent],
  templateUrl: './nurse-dashboard.component.html',
  styleUrl: './nurse-dashboard.component.css'
})
export class NurseDashboardComponent implements OnInit {
patientNumber: number = 100;
checkedIn: number = 80;
checkedOut: number = 20;
pending: number = 0;
onProgress: number = 0;
completed: number = 0;
data : bacpatient[] = [] ;


dataSource = new MatTableDataSource(ELEMENT_DATA);
constructor(public bacPatientService : BacPatientService){}
  ngOnInit(): void {
  this.data = this.bacPatientService.getData(this.dataSource , true );
  this.calculateStatus();
  }
calculateStatus(){
 this.data.forEach(bacPatient=>{
    if(bacPatient.status===0){
      this.pending++;
    }else if(bacPatient.status===1){
      this.onProgress++;
    }if(bacPatient.status===2){
      this.completed++;
    }
  
  }

  )
}

}
