import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../model/unitCare/TaskData';
import { TaskService } from '../../services/unitCare/task.service';

type Form = FormGroup<{
  content: FormControl;
  taskState: FormControl;
  taskAction: FormControl;


}>;

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [RouterModule, CommonModule,ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {

  showTextarea: boolean = false;

  constructor(private taskService: TaskService) {}
  data_list: Task[] ;
  ngOnInit(): void {
    this.taskService.getTasks().subscribe((response) => {
      this.data_list = response.tasks.data;
      console.log('test', this.data_list)
    });
  }

  isDropdownOpen: boolean = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  actions: { value: string, icon: string, label: string }[] = [
    { value: 'Done', icon: 'check-circle', label: 'Done' },
    { value: 'Proceeding', icon: 'proceeding', label: 'Proceeding' },
  ];

  onActionClick(actionType: string, item: Task) {
    switch (actionType) {
      case 'proceeding':
        // Handle close action for the item
        break;
      case 'Done':
        // Handle done action for the item
        break;
    }
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

 toggleTextarea(): void {
  this.showTextarea = !this.showTextarea;
}

}
