import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task, TaskData } from '../../model/unitCare/TaskData';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  link = "https://localhost:6064/unitcare-service/tasks";

  constructor(private http: HttpClient) {}

  getTasks(): Observable<TaskData> {

    return this.http.get<TaskData>(this.link);
  }

  postTask(task: Task): Observable<any> {
    const formData = { "Task": task };
    return this.http.post<any>(this.link, formData);
  }


  updateTask(task: Task): Observable<any> {
    return this.http.put<any>(`${this.link}/${task.id}`, task);
  }
}
