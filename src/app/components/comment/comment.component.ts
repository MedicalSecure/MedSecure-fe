import { Component, Input } from '@angular/core';
import { bacpatient } from '../../pages/bacPatient/bacPatient.component';
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
  todayDate: string = new Date().getDate().toString();

  onCommentsend(commentInput: HTMLInputElement) {
    const newComment = commentInput.value;

    
    if (newComment.trim() !== '') {
      this.note.push(newComment);
      this.note = this.note;
      commentInput.value = '';
    }
  
   
  }

}
