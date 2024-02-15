import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private submittedDataSubject = new BehaviorSubject<any>(null);
  submittedData$ = this.submittedDataSubject.asObservable();

  constructor() {}

  updateSubmittedData(data: any) {
    this.submittedDataSubject.next(data);
  }
}
