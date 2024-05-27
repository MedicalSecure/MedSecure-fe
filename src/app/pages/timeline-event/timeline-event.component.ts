import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ELEMENT_DATA, bacpatient } from '../bacPatient/bacPatient.component';
import { CommonModule } from '@angular/common';
import { Medication } from '../../model/BacPatient';
import { BacPatientService } from '../../services/bacPatient/bac-patient-services.service';
import { MatTableDataSource } from '@angular/material/table';
import { Dispense } from '../../components/schedule/schedule.component';

@Component({
  selector: 'app-timeline-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-event.component.html',
  styleUrl: './timeline-event.component.css'
})
export class GanttChartComponent implements AfterViewInit {
  constructor(private bacPatientService: BacPatientService) { }
  ngAfterViewInit(): void {
    this.dataList = this.bacPatientService.getData(this.dataSource);

    this.getUniqueRooms();
  }
  isCurrentHour(hour: string): boolean {
    const currentHour = new Date().getHours().toString();
   
    const inputHour = hour;
    // Debug output

    // Check if the parsed input hour matches the current hour
    return inputHour === currentHour;
  }
 calculateQuantity(dispense : Dispense[]): string {
    let beParsed: number = 0;
    let aeParsed: number = 0;
    dispense.forEach(dis=>{
      if (dis.beforeMeal?.quantity !== undefined) {
        beParsed += parseInt(dis.beforeMeal?.quantity);
        if (isNaN(beParsed)) {
            throw new Error("Invalid value for 'be'");
        }
    }
    if (dis.afterMeal?.quantity !== undefined) {
        aeParsed += parseInt(dis.afterMeal?.quantity );
        if (isNaN(aeParsed)) {
            throw new Error("Invalid value for 'ae'");
        }
    }
    })
 
    return (beParsed.toString()  + "," + aeParsed.toString())
}
dataSource = new MatTableDataSource(ELEMENT_DATA);
  @Input() targetHours: string[];
  dataList: bacpatient[] = ELEMENT_DATA ;
  uniqueroom: number[] = [];
  tableElements: bacpatient[] = [];
  medicines: Medication[] = [];
  medicineByHour: Map<string, Medication[]> = new Map();
  hours: string[] = [];

  medicinesByHourMap: Map<string, Medication[]> = new Map();
  uniqueRoomsMap: Map<number, bacpatient[]> = new Map();
  getUniqueRooms(): Map<number, bacpatient[]> {
    const uniqueRoomsMap: Map<number, bacpatient[]> = new Map();
    this.dataList.forEach(item => {
      if (!uniqueRoomsMap.has(item.prescription.unitCare.room.roomNumber)) {
        uniqueRoomsMap.set(item.prescription.unitCare.room.roomNumber, []);
      }
      const patientsInRoom = uniqueRoomsMap.get(item.prescription.unitCare.room.roomNumber);
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
    for (const patient of this.dataList) {
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
    //debugger;
    return medicines;
  }

 
}
