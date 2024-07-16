import { AfterViewInit, Component } from '@angular/core';
import { ELEMENT_DATA, bacpatient } from '../bacPatient/bacPatient.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { BacPatientService } from '../../services/bacPatient/bac-patient-services.service';
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nurseTasks.component.html',
  styleUrl: './nurseTasks.component.css'
})
export class NurseTasksComponent implements AfterViewInit {

  constructor(private bacPatientService: BacPatientService) { }
  ngAfterViewInit(): void {
    this.data_list = this.bacPatientService.getData(this.dataSource);
  }
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  data_list: bacpatient[] = ELEMENT_DATA;
  isDropdownOpen: boolean = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen
    ;
  }

  actions: { value: string, icon: string, label: string }[] = [
    { value: 'Done', icon: 'check-circle', label: 'Done' },
    { value: 'Blocked', icon: 'ban', label: 'Blocked' },
    { value: 'Close', icon: 'close', label: 'Close' },
  ];

  onActionClick(actionType: string, item: bacpatient) {
    switch (actionType) {
      case 'Blocked':
        break;
      case 'Close':
        break;
      case 'Done':
        break;
    }
  }
}
