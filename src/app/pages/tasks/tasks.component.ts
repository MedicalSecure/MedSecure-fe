import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
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
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {

  showTextarea: boolean = false;
  data_list: Task[];

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((response) => {
      this.data_list = response.tasks.data;
      console.log('test', this.data_list);
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

  onActionChange(event: any, item: Task) {
    const selectedAction = event.target.value;
    console.log('Action selected:', selectedAction, 'for task:', item);

    if (selectedAction === 'Proceeding') {
      item.taskState = 2;
    } else if (selectedAction === 'Done') {
      item.taskState = 3;
    }

    this.updateTask(item);
    console.log('item updated',item)
  }

  updateTask(updatedTask: Task): void {
    this.taskService.updateTask(updatedTask).subscribe(response => {
      console.log('Task updated successfully:', response);
      this.data_list = this.data_list.map(task => task.id === updatedTask.id ? updatedTask : task);
    }, error => {
      console.error('Error updating task:', error);
    });
  }

  // form
  fb = inject(NonNullableFormBuilder);
  taskForm: Form = this.fb.group({
    content: '',
    taskAction: 1,
    taskState: 1,
  });

  Task: Task | any;

  addTask(): void {
    console.log('test', this.taskForm.value);

    if (this.taskForm.valid) {
      this.Task = this.taskForm.value;

      this.taskService.postTask(this.Task).subscribe(response => {
        this.showTextarea = !this.showTextarea;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['tasks']);
        });
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
