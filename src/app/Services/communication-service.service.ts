import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private exportToXlsxSubject = new Subject<void>();  // Export datatable to excel
  exportToXlsx$ = this.exportToXlsxSubject.asObservable();

  triggerExportToXlsx() {
    this.exportToXlsxSubject.next();
  }


  private importExcelSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  importExcel$ = this.importExcelSubject.asObservable();

  constructor() { }

  storedata(data: any): void {
    this.importExcelSubject.next(data);
  }

}

