import { Component } from '@angular/core';
import { ELEMENT_DATA, bacpatient } from '../../pages/bacPatient/bacPatient.component';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.css'
})
export class KanbanComponent {
  
  data_list: bacpatient[] = ELEMENT_DATA;
  checkednumber: Number = 0;
  checkedItems: any[] = [];
  onCheckEmitted(checkedNumber: Number, element: bacpatient) {
   if (!this.checkedItems[element.id]) {
     this.checkedItems[element.id] = [];
   }
   this.checkedItems[element.id].push(checkedNumber);
   this.checkednumber = Object.values(this.checkedItems).flat().length;
   let allCheckBoxNumber: number = 0;
   element.medicines.forEach(medicine => {
     allCheckBoxNumber += medicine.posology[0].length;
   });
   console.log(this.checkednumber);
   if (this.checkedItems[element.id].length !== 0) {
     const patientToUpdate = this. data_list.find(patient => patient.id == element.id);
     if (patientToUpdate) {
       patientToUpdate.status = 'On Progress';
       if (this.checkedItems[element.id].length === allCheckBoxNumber) {
         patientToUpdate.status = 'Completed';
         this.checkedItems[element.id] = [];
         this.checkednumber = Object.values(this.checkedItems).flat().length;
       }
     }
   }
 }
  calculateAge(birthdate: Date): number {
   const today = new Date();
   const birth = new Date(birthdate);
   let age = today.getFullYear() - birth.getFullYear();
   const monthDiff = today.getMonth() - birth.getMonth();
 
   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
     age--;
   }
 
   return age;
 }
}
