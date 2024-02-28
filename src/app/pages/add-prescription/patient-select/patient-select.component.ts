import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPatientByNameAndSnPipe } from '../../../pipes/filter-patient-by-name-and-sn.pipe';

@Component({
  selector: 'app-patient-select',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPatientByNameAndSnPipe],
  templateUrl: './patient-select.component.html',
  styleUrl: './patient-select.component.css',
})
export class PatientSelectComponent {
  @Input() selectedPatient: patientType | undefined = undefined;
  @Output() selectedPatientChange = new EventEmitter<patientType | undefined>();
  @Input()
  dataList: patientType[] = [
    { sn: '001', name: 'John', sex: 'Male', age: 30, height: 180 },
    { sn: '002', name: 'Jane', sex: 'Female', age: 25, height: 165 },
    { sn: '003', name: 'Alice', sex: 'Female', age: 28, height: 170 },
    { sn: '004', name: 'Bob', sex: 'Male', age: 35, height: 175 },
    { sn: '005', name: 'Eve', sex: 'Female', age: 22, height: 160 },
    { sn: '006', name: 'Mike', sex: 'Male', age: 32, height: 185 },
    { sn: '007', name: 'Sarah', sex: 'Female', age: 27, height: 168 },
    { sn: '008', name: 'David', sex: 'Male', age: 29, height: 176 },
    { sn: '009', name: 'Emily', sex: 'Female', age: 31, height: 162 },
    { sn: '010', name: 'Alex', sex: 'Male', age: 26, height: 178 },
  ];

  searchTerm: string = '';

  onClickPatient(patient: patientType) {
    this.selectedPatientChange.emit(patient);
    this.selectedPatient = patient;
  }
}
export type patientType = {
  sn: string;
  name: string;
  sex: string;
  age: number;
  height: number;
};
