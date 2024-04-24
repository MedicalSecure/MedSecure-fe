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

  isCurrentHour(hour: number): boolean {
    const currentHour = new Date().getHours();
    // Parse the input hour string to an integer
    const inputHour = hour;
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
  
  @Input() targetHours : number[];
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
      if (!uniqueRoomsMap.has(item.room.number)) {
          uniqueRoomsMap.set(item.room.number, []);
      }
      const patientsInRoom = uniqueRoomsMap.get(item.room.number);
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
getMedicineByHour(hour: number , name : string): Medicine[] {
  const medicines = [];
  for (const patient of this.data_list) {
    if(patient.patient.name === name){
      for (const medicine of patient.medicines) {
        for (const posology of medicine.posology) {
          for (let index = 0; index < posology.hours.length; index++) {
            if (posology.hours[index] === hour) {
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
