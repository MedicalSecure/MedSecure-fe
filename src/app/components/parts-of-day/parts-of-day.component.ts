import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-parts-of-day',
  standalone: true,
  imports: [CommonModule, MatDividerModule],
  templateUrl: './parts-of-day.component.html',
  styleUrl: './parts-of-day.component.css'
})
export class PartsOfDayComponent implements OnInit{

 
  @Input() selectedHours: any[] = [];

  hoursList: any[] = [
    [
      { hour: '06'},
      { hour: '07'},
      { hour: '08'},
      { hour: '09'},
      { hour: '10' },
      { hour: '11' },
      { hour: '12' },
      { hour: '13' },
      { hour: '14' },
      { hour: '15' },
      { hour: '16' },
      { hour: '17' },
      { hour: '18' },
      { hour: '19' },
      { hour: '20' },
      { hour: '21' },
      { hour: '22' },
      { hour: '23' },
      { hour: '00' },
      { hour: '01'},
      { hour: '02'},
      { hour: '03'},
      { hour: '04'},
      { hour: '05'},
    ],
  ];

  ngOnInit(): void {
    this.setDesiredHours();
  }
  

  setDesiredHours(): void {
    const desiredHours = [1,2,3,4,5,6,7,8,9,10,11, 12,13,14,15,16, 17,18,19,20,21, 22,23, 0];

    for (const hourArray of this.hoursList) {
      const filteredHours = hourArray.filter((hourObj : any) =>
        desiredHours.includes(parseInt(hourObj.hour))
      );
      this.selectedHours.push(filteredHours);
    }
  }

  toggleCheckbox(currentitem: any) {
    currentitem.isSelected = !currentitem.isSelected;
}

  getBackgroundColor(hour: number): string {
    if (hour >= 0 && hour < 3) {
      // Late Night
      return "bg-dark";
  } else if (hour >= 3 && hour < 6) {
      // Pre-Dawn/Dawn
      return "bg-info";
  } else if (hour >= 6 && hour < 9) {
      // Early Morning
      return "bg-info";
  } else if (hour >= 9 && hour < 12) {
      // Mid-Morning
      return "bg-success";
  } else if (hour == 12) {
      // Noon/Midday
      return "bg-warning";
  } else if (hour > 12 && hour < 15) {
      // Afternoon
      return "bg-primary";
  } else if (hour >= 15 && hour < 18) {
      // Mid-Afternoon
      return "bg-danger";
  } else if ((hour >= 18 && hour < 21) || (hour >= 0 && hour < this.getSunsetHour())) {
      // Evening
      return "bg-warning";
  } else if (hour >= this.getSunsetHour() && hour < this.getDarknessHour()) {
      // Dusk
      return "bg-danger";
  } else {
      // Night
      return "bg-dark";
  }
}


getToolTipText(hour: number): string {
  if (hour >= 0 && hour < 3) {
    // 
    return "Late Night";
} else if (hour >= 3 && hour < 6) {
    // 
    return "Pre-Dawn/Dawn";
} else if (hour >= 6 && hour < 9) {
    // 
    return "Early Morning";
} else if (hour >= 9 && hour < 12) {
    // 
    return "Mid-Morning";
} else if (hour == 12) {
    // 
    return "Noon/Midday";
} else if (hour > 12 && hour < 15) {
    // 
    return "Afternoon";
} else if (hour >= 15 && hour < 18) {
    // 
    return "Mid-Afternoon";
} else if ((hour >= 18 && hour < 21) || (hour >= 0 && hour < this.getSunsetHour())) {
    // 
    return "Evening";
} else if (hour >= this.getSunsetHour() && hour < this.getDarknessHour()) {
    // 
    return "Dusk";
} else {
    // 
    return "Night";
}
}


// Placeholder functions, replace these with your actual logic to determine sunset and darkness hours
getSunsetHour() {
  return 18; // 6:00 PM
}

getDarknessHour() {
  return 21; // 9:00 PM
}
}
