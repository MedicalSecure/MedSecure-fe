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
import { PatientDto } from '../../../types/registerDTOs';
import { Gender } from '../../../enums/enum';
import { calculateAge, getDateString } from '../../../shared/utilityFunctions';
import { RegisterService } from '../../../services/register/register.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-stp1-patient-selection',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FilterPatientByNameAndSnPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './stp1-patient-selection.component.html',
  styleUrl: './stp1-patient-selection.component.css',
})
export class Stp1PatientSelection implements OnChanges {
  @Input() selectedPatient: PatientDto | undefined = undefined;
  @Output() selectedPatientChange = new EventEmitter<PatientDto | undefined>();
  @Output() onIsPatientSelectPageValidChange = new EventEmitter<boolean>();
  @Input() clearTextAfterEachSearch: boolean = false;
  @Input()
  PatientList: PatientDto[] = [];
  IsPatientListLoading = false;

  checked: boolean = true;
  searchTerm: string = '';
  constructor(private registerService: RegisterService) {}

  onClickPatient(patient: PatientDto) {
    this.selectedPatientChange.emit(patient);
    this.selectedPatient = patient;
    this.onIsPatientSelectPageValidChange.emit(patient != undefined);
  }

  ngOnInit() {
    this.getPatient();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.clearTextAfterEachSearch) return;
    let newChange = changes['selectedPatient'];
    if (newChange && !newChange.firstChange) {
      if (this.selectedPatient === undefined) this.searchTerm = '';
    }
  }

  getPatient() {
    this.IsPatientListLoading = true;
    this.registerService.getPatients().subscribe(
      (response) => {
        this.PatientList = response.patients.data.map((patient) => {
          return {
            ...patient,
            dateOfBirth: patient.dateOfBirth
              ? new Date(patient.dateOfBirth)
              : null,
            createdAt: new Date(patient.createdAt),
            modifiedAt: patient.modifiedAt
              ? new Date(patient.modifiedAt)
              : null,
          };
        });
        //debugger;
      },
      (error) => console.error(error),
      () => (this.IsPatientListLoading = false)
    );
  }
  getDateString(
    dateToFormat: Date,
    dateFormat: string = 'dd-mm-yyyy - HH:MM'
  ): string {
    return getDateString(dateToFormat, dateFormat);
  }

  getAge(date: Date | null | undefined) {
    if (!date) return '';
    return calculateAge(date);
  }
}
