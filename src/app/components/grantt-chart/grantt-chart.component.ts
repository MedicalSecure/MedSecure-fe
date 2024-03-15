import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ELEMENT_DATA, Medicine, Posology, bacpatient } from '../../pages/bacPatient/bacPatient.component';

@Component({
  selector: 'app-grantt-chart',
  standalone: true,
  imports: [],
  templateUrl: './grantt-chart.component.html',
  styleUrl: './grantt-chart.component.css'
})
export class GranttChartComponent implements OnInit{
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
