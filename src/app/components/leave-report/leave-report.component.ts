import { Component, OnInit } from '@angular/core';
import { LeaveReportService } from '../../services/leave-report/leave-report.service';
import { LeaveReport } from '../../model/LeaveReport';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-leave-report',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule],
  templateUrl: './leave-report.component.html',
  styleUrl: './leave-report.component.css'
})
export class LeaveReportComponent  implements OnInit{
  leaveReport: LeaveReport[];
  selectedReport: LeaveReport | null = null;
  showCreateForm:boolean=false
  page: number = 1;
  constructor(private leaveReportService: LeaveReportService) {}

  ngOnInit(): void {
    this.GetLeaveReport();
  }

  GetLeaveReport(): void {
    this.leaveReportService.getLeaveReport().subscribe((data: LeaveReport[]) => {
      this.leaveReport = data;
    });
  }

  closeModels():void{
    this.selectedReport = null;
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  toggleDropdown(report: LeaveReport): void {
    if (this.selectedReport === report) {
      this.selectedReport = null;
    } else {
      this.selectedReport = report;
    }
  }

}