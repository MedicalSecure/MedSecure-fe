import { Component, OnInit, inject } from '@angular/core';
import { Task } from '../../model/unitCare/TaskData';
import { TaskService } from '../../services/unitCare/task.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';


type Form = FormGroup<{
  content: FormControl;
  taskState: FormControl;
  taskAction: FormControl;


}>;

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit {

  tasks: Task[] = [];
  showTextarea: boolean = false;
  newTaskContent: string = '';


  constructor(private taskService: TaskService,private router: Router) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((response) => {
      this.tasks = response.tasks.data;
    });
  }

  toggleTextarea(): void {
    this.showTextarea = !this.showTextarea;
  }

  // form
  fb = inject(NonNullableFormBuilder);
  taskForm: Form = this.fb.group({
    content: '',
    taskAction: 1,
    taskState:1,

  });

  Task: Task | any;

  addTask(): void {
    console.log('test', this.taskForm.value);

    if (this.taskForm.valid) {

      this.Task = this.taskForm.value;

     this.taskService.postTask(this.Task)
       .subscribe(response => {
         console.log('Backend response:', response);
         this.showTextarea = !this.showTextarea;

       }, error => {
         console.error('Error submitting data:', error);
       });
   } else {
     console.error('Form is invalid!');

   }
 }
}
