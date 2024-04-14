import { Component, Input, OnInit } from '@angular/core';
import { ELEMENT_DATA, Medicine, bacpatient } from '../bacPatient/bacPatient.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-event.component.html',
  styleUrl: './timeline-event.component.css'
})
export class GanttChartComponent implements OnInit{

  isCurrentHour(hour: string): boolean {
    const currentHour = new Date().getHours();
    // Parse the input hour string to an integer
    const inputHour = parseInt(hour, 10);
    // Debug output
    console.log("Hour:", hour);
    console.log("Input Hour:", inputHour);
    console.log("Current Hour:", currentHour);
    // Check if the parsed input hour matches the current hour
    return inputHour === currentHour;
  }

calculateQuantity( be:number , ae:number):number {
  return be+ae ;
}
  
  @Input() targetHours : string[];
  data_list: bacpatient[] = ELEMENT_DATA;
  uniqueroom :number[] = [];
  tableElements : bacpatient[] = [];
  medicines : Medicine[] = [] ;
  medicineByHour: Map<string, Medicine[]> = new Map();
 hours:string[]=[];

  medicinesByHourMap: Map<string, Medicine[]> = new Map();
uniqueRoomsMap: Map<number, bacpatient[]> = new Map();
getUniqueRooms(): Map<number, bacpatient[]> {
  const uniqueRoomsMap: Map<number, bacpatient[]> = new Map();
  this.data_list.forEach(item => {
      if (!uniqueRoomsMap.has(item.room)) {
          uniqueRoomsMap.set(item.room, []);
      }
      const patientsInRoom = uniqueRoomsMap.get(item.room);
      if (patientsInRoom) {
          patientsInRoom.push(item);
      }
  });
  this.uniqueroom =Array.from(uniqueRoomsMap.keys());
  Array.from(uniqueRoomsMap.values()).forEach(element => {
   for (let index = 0; index < element.length; index++) {
   this.tableElements.push(element[index]) 
   }
  });
  return uniqueRoomsMap;
}
getMedicineByHour(hour: string , name : string): Medicine[] {
  const medicines = [];
  for (const patient of this.data_list) {
    if(patient.patient === name){
      for (const medicine of patient.medicines) {
        for (const posology of medicine.posology) {
          for (const timeSlot of posology) {
            if (timeSlot.hour === hour) {
              medicines.push(medicine);
            }
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
