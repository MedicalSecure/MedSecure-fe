import { Component } from '@angular/core';
import { ELEMENT_DATA, bacpatient } from '../bacPatient/bacPatient.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  
  data_list: bacpatient[] = ELEMENT_DATA;
  isDropdownOpen: boolean = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  actions: { value: string, icon: string, label: string }[] = [
    { value: 'Done', icon: 'check-circle', label: 'Done' },
    { value: 'Blocked', icon: 'ban', label: 'Blocked' },
    { value: 'Close', icon: 'close', label: 'Close' },
  ];

  onActionClick(actionType: string, item: bacpatient) {
    switch (actionType) {
      case 'Blocked':
        // Handle blocked action for the item
        break;
      case 'Close':
        // Handle close action for the item
        break;
      case 'Done':
        // Handle done action for the item
        break;
    }
  }
}
