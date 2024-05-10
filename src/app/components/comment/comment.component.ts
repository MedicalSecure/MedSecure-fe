import { Component, Input } from '@angular/core';
import { bacpatient } from '../../pages/bacPatient/bacPatient.component';
import { HttpClient } from '@angular/common/http';
import { BacPatientService } from '../../services/bacPatient/bac-patient-services.service';
@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() note : string[];
  @Input()DATA: bacpatient;
  @Input() id : string ; 
  todayDate: string = new Date().getDate().toString();
  constructor(private http: HttpClient , private bacPatientService :BacPatientService) {


  }
  onCommentsend( commentInput: HTMLInputElement) {
    const newComment = commentInput.value;
     if (newComment.trim() !== '') {
      this.note.push(newComment);
      this.note = this.note;
      commentInput.value = '';
    }
   this.bacPatientService.updateComment(this.id , newComment )


  }
 

}
