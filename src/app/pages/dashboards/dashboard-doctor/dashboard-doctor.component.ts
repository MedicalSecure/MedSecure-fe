import { Component } from '@angular/core';

import {VisitService} from '../../../services/visits.service'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-doctor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-doctor.component.html',
  styleUrl: './dashboard-doctor.component.css'
})
export class DashboardDoctorComponent {

  visitsCountByDay: { [key: string]: number } = {};
  totalVisitsCount: number = 0;
  constructor(private visitService: VisitService) { }

  ngOnInit(): void {
    this.GetVisitsPerDay()
    this.GetTotalVisits()
  }
    visitDates(): string[] {
      return Object.keys(this.visitsCountByDay).sort();
    }

    GetVisitsPerDay():void{
      this.visitService.getVisitsCountByDay().subscribe(data => {
        this.visitsCountByDay = data;
      });}

      GetTotalVisits():void{
        this.visitService.getTotalVisitsCount().subscribe(count => {
          this.totalVisitsCount = count;}
        );}

    

}
