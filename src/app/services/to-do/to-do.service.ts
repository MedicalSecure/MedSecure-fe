import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToDo } from '../../model/ToDo';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  private readonly baseUrl = 'assets/data/ToDo.json';

  constructor(private http: HttpClient) { }

  getToDo(): Observable<ToDo[]> {
    return this.http.get<ToDo[]>(this.baseUrl);
  }
  updateToDo(task: ToDo): Observable<ToDo> {
    const url = `${this.baseUrl}/${task.id}`; 
    return this.http.put<ToDo>(url, task);
  }
}