import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterDataService {
  //THIS service is used when routing between pages and sending data to the destination page
  //like when you select a register and go to Register-details with its data
  private dataSource = new BehaviorSubject<any>(null);
  data$ = this.dataSource.asObservable();

  setData(data: any) {
    this.dataSource.next(data);
  }
}
