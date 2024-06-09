import { HttpClient } from '@angular/common/http';
import { Injectable ,} from '@angular/core';
import { Observable } from 'rxjs';
import { LeaveReport } from '../../model/LeaveReport';

@Injectable({
  providedIn: 'root'
})
export class LeaveReportService {
  private readonly baseUrl = 'assets/data/LeaveReport.json';

  constructor(private http: HttpClient) { }

  getLeaveReport(): Observable<LeaveReport[]> {
    return this.http.get<LeaveReport[]>(this.baseUrl);
  }

}