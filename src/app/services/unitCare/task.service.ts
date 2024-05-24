import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task, TaskData } from '../../model/unitCare/TaskData';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) {}

  getTasks(): Observable<TaskData> {

    return this.http.get<TaskData>('http://localhost:5102/tasks');
  }

  postTask(task: Task): Observable<any> {
    const formData = { "Task": task };
    console.log ('tt',formData)
    const url = 'http://localhost:5102/tasks'; // URL for POST request
    return this.http.post<any>(url, formData);
  }
}
