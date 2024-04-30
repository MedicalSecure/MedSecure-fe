import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPatientByNameAndSnPipe } from '../../../pipes/filter-patient-by-name-and-id/filter-patient-by-name-and-sn.pipe';

@Component({
  selector: 'app-stp1-patient-selection',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FilterPatientByNameAndSnPipe,
  ],
  templateUrl: './stp1-patient-selection.component.html',
  styleUrl: './stp1-patient-selection.component.css',
})
export class Stp1PatientSelection implements OnChanges {
  @Input() selectedPatient: patientType | undefined = undefined;
  @Output() selectedPatientChange = new EventEmitter<patientType | undefined>();
  @Output() onIsPatientSelectPageValidChange = new EventEmitter<boolean>();
  @Input() clearTextAfterEachSearch: boolean = false;
  @Input()
  dataList: patientType[] = [
    { sn: '001', name: 'John', sex: 'Male', age: 30, height: 180, registrationDate:new Date() },
    { sn: '002', name: 'Jane', sex: 'Female', age: 25, height: 165,registrationDate:new Date() },
    { sn: '003', name: 'Alice', sex: 'Female', age: 28, height: 170, registrationDate:new Date() },
    { sn: '004', name: 'Bob', sex: 'Male', age: 35, height: 175, registrationDate:new Date() },
    { sn: '005', name: 'Eve', sex: 'Female', age: 22, height: 160, registrationDate:new Date() },
    { sn: '006', name: 'Mike', sex: 'Male', age: 32, height: 185, registrationDate:new Date() },
    { sn: '007', name: 'Sarah', sex: 'Female', age: 27, height: 168, registrationDate:new Date() },
    { sn: '008', name: 'David', sex: 'Male', age: 29, height: 176, registrationDate:new Date() },
    { sn: '009', name: 'Emily', sex: 'Female', age: 31, height: 162, registrationDate:new Date() },
    { sn: '010', name: 'Alex', sex: 'Male', age: 26, height: 178, registrationDate:new Date() },
  ];
  checked: boolean = true;
  searchTerm: string = '';

  onClickPatient(patient: patientType) {
    this.selectedPatientChange.emit(patient);
    this.selectedPatient = patient;
    this.onIsPatientSelectPageValidChange.emit(patient != undefined);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.clearTextAfterEachSearch) return;
    let newChange = changes['selectedPatient'];
    if (newChange && !newChange.firstChange) {
      if (this.selectedPatient === undefined) this.searchTerm = '';
    }
  }
}
export type patientType = {
  sn: string;
  name: string;
  sex: string;
  age: number;
  height: number;
  registrationDate:Date;
};
