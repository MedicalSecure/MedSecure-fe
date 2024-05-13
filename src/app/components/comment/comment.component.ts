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
  constructor(private http: HttpClient , private bacPatientService :BacPatientService) {


  }
  onCommentsend(commentInput: HTMLInputElement) {
    const newCommentContent = commentInput.value.trim();
    if (newCommentContent !== '') {
      const newComment: Comment = {
        id: '', // Generate a unique ID here if needed
        posologyId: '', // Set the posology ID if applicable
        label: '', // Set the label if applicable
        content: newCommentContent
      };
      this.note.push(newComment);
      commentInput.value = '';
      this.bacPatientService.updateComment(this.id, newComment);
    }
  }
 

}
