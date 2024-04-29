import { Component, Input } from '@angular/core';
import { bacpatient } from '../../pages/bacPatient/bacPatient.component';
import { HttpClient } from '@angular/common/http';
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
  constructor(private http: HttpClient) {


  }
  onCommentsend( commentInput: HTMLInputElement) {
    const newComment = commentInput.value;
     if (newComment.trim() !== '') {
      this.note.push(newComment);
      this.note = this.note;
      commentInput.value = '';
    }
  this.updateComment(this.id , newComment )

  
   
  }
  updateComment( id : string ,note:string){
    const body = { Id: id, Note: note };
    return this.http.put('https://localhost:6065/v1/bacPatient/note', body).subscribe(response => {
      console.log('Response:', response); // Log the response
    },
    error => {
      console.error('Error:', error); // Log any error
    }
  );

   }

}
