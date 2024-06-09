import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, switchMap, timer } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class SensorThingspeakService {
  private apiUrlMedInArmoire = 'https://api.thingspeak.com/channels/2559139/feeds.json?api_key=HEJGWX49WMGLX0YN&results=1';
  private apiUrlHealthcare = 'https://api.thingspeak.com/channels/2558122/feeds.json?api_key=VTYIUUL1I2YVSL7D&results=1';
  private dataSubjectMed = new Subject<any>();
  private dataSubjectHealth = new Subject<any>();
  constructor(private http: HttpClient) {
    // Poll ThingSpeak API every second for MedInArmoire data
    timer(0, 1000).pipe(
      switchMap(() => this.http.get<any>(this.apiUrlMedInArmoire))
    ).subscribe(data => {
      if (data && data.feeds && data.feeds.length > 0) {
        this.dataSubjectMed.next(data.feeds[0]);
      }
    });

    // Poll ThingSpeak API every second for Healthcare data
    timer(0, 1000).pipe(
      switchMap(() => this.http.get<any>(this.apiUrlHealthcare))
    ).subscribe(data => {
      if (data && data.feeds && data.feeds.length > 0) {
        this.dataSubjectHealth.next(data.feeds[0]);
      }
    });
  }

  getSensorData(): Observable<any> {
    return this.http.get<any>(this.apiUrlMedInArmoire);
  }


  getSensorDataHealthCare(): Observable<any> {
    return this.http.get<any>(this.apiUrlHealthcare);
  }
  
  getDataStreamMed(): Observable<any> {
    return this.dataSubjectMed.asObservable();
  }
  getDataStreamHealth(): Observable<any> {
    return this.dataSubjectHealth.asObservable();
  }

}