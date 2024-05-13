import { Component, Input, OnInit } from '@angular/core';
import { ELEMENT_DATA, bacpatient } from '../bacPatient/bacPatient.component';
import { CommonModule } from '@angular/common';
import { Medication } from '../../model/BacPatient';

@Component({
  selector: 'app-timeline-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-event.component.html',
  styleUrl: './timeline-event.component.css'
})
export class GanttChartComponent implements OnInit {

  isCurrentHour(hour: string): boolean {
    const currentHour = new Date().getHours().toString();
    // Parse the input hour string to an integer
    const inputHour = hour;
    // Debug output

    // Check if the parsed input hour matches the current hour
    return inputHour === currentHour;
  }

 calculateQuantity(be: string | undefined, ae: string | undefined): number {
    // Initialize variables to store the parsed values
    let beParsed: number = 0;
    let aeParsed: number = 0;

    // Parse the strings if they are defined
    if (be !== undefined) {
        beParsed = parseInt(be);
        // Check if parsing failed (resulted in NaN)
        if (isNaN(beParsed)) {
            // Handle invalid input, such as non-numeric strings
            // For example, you could throw an error or return a default value
            throw new Error("Invalid value for 'be'");
        }
    }
    if (ae !== undefined) {
        aeParsed = parseInt(ae);
        // Check if parsing failed (resulted in NaN)
        if (isNaN(aeParsed)) {
            // Handle invalid input, such as non-numeric strings
            // For example, you could throw an error or return a default value
            throw new Error("Invalid value for 'ae'");
        }
    }

    // Return the sum of the parsed values
    return beParsed + aeParsed;
}

  @Input() targetHours: string[];
  data_list: bacpatient[] = ELEMENT_DATA;
  uniqueroom: number[] = [];
  tableElements: bacpatient[] = [];
  medicines: Medication[] = [];
  medicineByHour: Map<string, Medication[]> = new Map();
  hours: string[] = [];

  medicinesByHourMap: Map<string, Medication[]> = new Map();
  uniqueRoomsMap: Map<number, bacpatient[]> = new Map();
  getUniqueRooms(): Map<number, bacpatient[]> {
    const uniqueRoomsMap: Map<number, bacpatient[]> = new Map();
    this.data_list.forEach(item => {
      if (!uniqueRoomsMap.has(item.room.roomNumber)) {
        uniqueRoomsMap.set(item.room.roomNumber, []);
      }
      const patientsInRoom = uniqueRoomsMap.get(item.room.roomNumber);
      if (patientsInRoom) {
        patientsInRoom.push(item);
      }
    });
    this.uniqueroom = Array.from(uniqueRoomsMap.keys());
    Array.from(uniqueRoomsMap.values()).forEach(element => {
      for (let index = 0; index < element.length; index++) {
        this.tableElements.push(element[index])
        
      }
    });

    
    return uniqueRoomsMap;
  }
  getMedicineByHour(hour: string, name: string): Medication[] {
    const medicines: Medication[] = [];
    for (const patient of this.data_list) {
      if (patient.prescription.register.patient.firstName === name) {
        for (const posology of patient.prescription.posologies) {
          for (const dispense of posology.dispenses) {
            if (dispense.hour === hour) {
              medicines.push(posology.medication);
              break;
            }
          }
        }
      }
    }
    return medicines;
  }

  ngOnInit(): void {
    this.getUniqueRooms();
  }
}
