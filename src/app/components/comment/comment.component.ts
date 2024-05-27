import { Component, Input } from '@angular/core';
import { bacpatient } from '../../pages/bacPatient/bacPatient.component';
import { HttpClient } from '@angular/common/http';
import { BacPatientService } from '../../services/bacPatient/bac-patient-services.service';
import { Comment } from '../../model/BacPatient';
@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() note : Comment[];
  @Input()DATA: bacpatient;
  @Input() id : string ; 
  todayDate: string = new Date().getDate().toString();
  constructor(private http: HttpClient , public bacPatientService :BacPatientService) {


  }


}
