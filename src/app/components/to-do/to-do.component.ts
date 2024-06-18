import { Component, OnInit } from '@angular/core';
import { ToDoService } from '../../services/to-do/to-do.service';
import { ToDo } from '../../model/ToDo';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-to-do',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule],
  templateUrl: './to-do.component.html',
  styleUrl: './to-do.component.css'
})
export class ToDoComponent implements OnInit{
  constructor(private toDoService :ToDoService){}
  Todoliste: ToDo[];
  page: number = 1;
  previousStatus: string;
  ngOnInit(): void {
    this.GetToDoListe();
  }

  GetToDoListe(): void {
    this.toDoService.getToDo().subscribe((data: ToDo[]) => {
      this.Todoliste = data;
    });
  }
 
  onTaskStatusChange(task: ToDo): void {
    if (task.status === 'Done') {
      task.status = this.previousStatus;
    } else {
      this.previousStatus = task.status;
      task.status = 'Done';
    }
    this.toDoService.updateToDo(task).subscribe(() => {
      this.GetToDoListe();
    });
  }
}
