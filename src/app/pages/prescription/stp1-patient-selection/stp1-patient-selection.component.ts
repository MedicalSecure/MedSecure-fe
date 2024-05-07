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

@Component({
  selector: 'app-stp1-patient-selection',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPatientByNameAndSnPipe],
  templateUrl: './stp1-patient-selection.component.html',
  styleUrl: './stp1-patient-selection.component.css',
})
export class Stp1PatientSelection implements OnChanges {
  @Input() selectedPatient: PatientDto | undefined = undefined;
  @Output() selectedPatientChange = new EventEmitter<PatientDto | undefined>();
  @Output() onIsPatientSelectPageValidChange = new EventEmitter<boolean>();
  @Input() clearTextAfterEachSearch: boolean = false;
  @Input()
  dataList: PatientDto[] = [
    {
      id: '001',
      firstName: 'John',
      lastName: 'Bord',
      gender: Gender.Male,
      dateOfBirth: new Date('07-05-2000'),
      height: 180,
      createdAt: new Date('06-06-2023'),
      createdBy: 'Hammadi',
    },
    {
      id: '002',
      firstName: 'Jane',
      lastName: 'Doe',
      gender: Gender.Female,
      dateOfBirth: new Date('03-12-1995'),
      height: 165,
      createdAt: new Date('03-02-2024'),
      createdBy: 'Alice',
    },
    {
      id: '003',
      firstName: 'Alice',
      lastName: 'Smith',
      gender: Gender.Female,
      dateOfBirth: new Date('11-20-1992'),
      height: 170,
      createdAt: new Date('05-15-2024'),
      createdBy: 'Bob',
    },
    {
      id: '004',
      firstName: 'Bob',
      lastName: 'Johnson',
      gender: Gender.Male,
      dateOfBirth: new Date('09-07-1985'),
      height: 175,
      createdAt: new Date('04-18-2024'),
      createdBy: 'David',
    },
    {
      id: '005',
      firstName: 'Eve',
      lastName: 'Brown',
      gender: Gender.Female,
      dateOfBirth: new Date('12-25-2002'),
      height: 160,
      createdAt: new Date('02-28-2024'),
      createdBy: 'Emily',
    },
    {
      id: '006',
      firstName: 'Mike',
      lastName: 'Davis',
      gender: Gender.Male,
      dateOfBirth: new Date('08-14-1989'),
      height: 185,
      createdAt: new Date('01-10-2024'),
      createdBy: 'Frank',
    },
    {
      id: '007',
      firstName: 'Sarah',
      lastName: 'Wilson',
      gender: Gender.Female,
      dateOfBirth: new Date('06-30-1997'),
      height: 168,
      createdAt: new Date('07-22-2024'),
      createdBy: 'George',
    },
    {
      id: '008',
      firstName: 'David',
      lastName: 'Taylor',
      gender: Gender.Male,
      dateOfBirth: new Date('04-09-1995'),
      height: 176,
      createdAt: new Date('08-05-2024'),
      createdBy: 'Hannah',
    },
    {
      id: '009',
      firstName: 'Emily',
      lastName: 'Anderson',
      gender: Gender.Female,
      dateOfBirth: new Date('02-18-1993'),
      height: 162,
      createdAt: new Date('09-14-2024'),
      createdBy: 'Ian',
    },
    {
      id: '010',
      firstName: 'Alex',
      lastName: 'Miller',
      gender: Gender.Male,
      dateOfBirth: new Date('10-03-1998'),
      height: 178,
      createdAt: new Date('10-30-2024'),
      createdBy: 'Jessica',
    },
  ];

  checked: boolean = true;
  searchTerm: string = '';

  onClickPatient(patient: PatientDto) {
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

  getDateString(
    dateToFormat: Date,
    dateFormat: string = 'dd-mm-yyyy - HH:MM'
  ): string {
    return getDateString(dateToFormat, dateFormat);
  }

  getAge(date:Date | null | undefined){
    if(!date) return "";
    return calculateAge(date);
  }
}
