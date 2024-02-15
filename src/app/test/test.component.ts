
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox'
import {MatDialog} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {PageEvent, MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import {JsonPipe} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogueComponent } from '../dialogue/dialogue.component';
/**
 * @title Table with pagination
 */
@Component({
  selector: 'table-pagination-example',
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule , MatPaginatorModule , JsonPipe],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TestComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<bacpatient>(ELEMENT_DATA);
  todayDate: string = new Date().toLocaleDateString();
  columnsToDisplay = ['add','us', 'room', 'bed', 'patient', 'bd', 'toServe', 'served', 'status', 'note',];
  constructor(public dialog: MatDialog ) { }
  columnsToDisplayMedicines = ['name', 'posology', 'root']
  expandedElement: bacpatient | null; // Property to track expanded element
  selectedIndex: number | null = null; // Property to track selected index

  // Method to toggle row expansion
  toggleRowExpansion(element: any, index: number): void {
    if (this.expandedElement === element) {
      this.expandedElement = null;
    } else {
      this.expandedElement = element;
    }
    this.selectedIndex = index; // Set the selected index
  }
  openDialog(): void {
    this.dialog.open(DialogueComponent, {
      width: '500px',
    });
  }
 
  @ViewChild(MatPaginator) paginator: MatPaginator;

 
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.filterDataByPage();
  }

  filterDataByPage() {
    const filteredData = ELEMENT_DATA.filter(item => item.bd === this.todayDate);
    this.dataSource.data = filteredData;
    console.log(this.todayDate);
    
  }
}
interface Medicine {
  name: string;
  posology: string[];
  root: string;
}
interface bacpatient {
  id: number;
  us: number;
  room: string;
  bed: string;
  patient: string;
  bd: string;
  medicines: Medicine[];
  toServe: string;
  served: string;
  status: boolean;
  note: string;
  add: string;
}
const ELEMENT_DATA: bacpatient[] = [
  {
    id: 1,
    us: 2,
    room: 'Room1',
    bed: 'Bed1',
    patient: 'Patient1',
    bd: '2/15/2024',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],
    toServe: 'To serve 1',
    served: 'Served 1',
    status: false,
    note: 'Note 1',
    add: 'Add 1',
  },
  {
    id: 2,
    us: 3,
    room: 'Room2',
    bed: 'Bed2',
    patient: 'Patient2',
    bd: '2/15/2024',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],    toServe: 'To serve 2',
    served: 'Served 2',
    status: false,
    note: 'Note 2',
    add: 'Add 2',
  },
  {
    id: 3,
    us: 4,
    room: 'Room3',
    bed: 'Bed3',
    patient: 'Patient3',
    bd: '2/15/2024',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],  toServe: 'To serve 3',
    served: 'Served 3',
    status: false,
    note: 'Note 3',
    add: 'Add 3',
  },
  {
    id: 4,
    us: 5,
    room: 'Room4',
    bed: 'Bed4',
    patient: 'Patient4',
    bd: '2/15/2024',
    medicines: [{ name: 'medicine4', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 4',
    served: 'Served 4',
    status: false,
    note: 'Note 4',
    add: 'Add 4',
  },
  {
    id: 5,
    us: 6,
    room: 'Room5',
    bed: 'Bed5',
    patient: 'Patient5',
    bd: '2/15/2024',
    medicines: [{ name: 'medicine5', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 5',
    served: 'Served 5',
    status: false,
    note: 'Note 5',
    add: 'Add 5',
  },
  {
    id: 6,
    us: 7,
    room: 'Room6',
    bed: 'Bed6',
    patient: 'Patient6',
    bd: '2/15/2024',
    medicines: [{ name: 'medicine6', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 6',
    served: 'Served 6',
    status: false,
    note: 'Note 6',
    add: 'Add 6',
  },
  {
    id: 7,
    us: 8,
    room: 'Room7',
    bed: 'Bed7',
    patient: 'Patient7',
    bd: '2/15/2024',
    medicines: [
      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],    toServe: 'To serve 7',
    served: 'Served 7',
    status: false,
    note: 'Note 7',
    add: 'Add 7',
  },
  {
    id: 8,
    us: 9,
    room: 'Room8',
    bed: 'Bed8',
    patient: 'Patient8',
    bd: '2/15/2024',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],    toServe: 'To serve 8',
    served: 'Served 8',
    status: false,
    note: 'Note 8',
    add: 'Add 8',
  },
  {
    id: 9,
    us: 10,
    room: 'Room9',
    bed: 'Bed9',
    patient: 'Patient9',
    bd: '2/15/2024',
    medicines: [{ name: 'medicine9', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 9',
    served: 'Served 9',
    status: false,
    note: 'Note 9',
    add: 'Add 9',
  },
  {
    id: 10,
    us: 11,
    room: 'Room10',
    bed: 'Bed10',
    patient: 'Patient10',
    bd: '2/15/2024',
    medicines: [{ name: 'medicine10', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 10',
    served: 'Served 10',
    status: false,
    note: 'Note 10',
    add: 'Add 10',
  },
  {
    id: 11,
    us: 12,
    room: 'Room11',
    bed: 'Bed11',
    patient: 'Patient11',
    bd: '2/16/2024',
    medicines: [{ name: 'medicine11', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 11',
    served: 'Served 11',
    status: false,
    note: 'Note 11',
    add: 'Add 11',
  },
  {
    id: 12,
    us: 13,
    room: 'Room12',
    bed: 'Bed12',
    patient: 'Patient12',
    bd: '2/16/2024',
    medicines: [{ name: 'medicine12', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 12',
    served: 'Served 12',
    status: false,
    note: 'Note 12',
    add: 'Add 12',
  },
  {
    id: 13,
    us: 14,
    room: 'Room13',
    bed: 'Bed13',
    patient: 'Patient13',
    bd: '2/16/2024',
    medicines: [{ name: 'medicine13', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 13',
    served: 'Served 13',
    status: false,
    note: 'Note 13',
    add: 'Add 13',
  },
  {
    id: 14,
    us: 15,
    room: 'Room14',
    bed: 'Bed14',
    patient: 'Patient14',
    bd: '2/16/2024',
    medicines: [{ name: 'medicine14', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 14',
    served: 'Served 14',
    status: false,
    note: 'Note 14',
    add: 'Add 14',
  },
  {
    id: 15,
    us: 16,
    room: 'Room15',
    bed: 'Bed15',
    patient: 'Patient15',
    bd: '2/16/2024',
    medicines: [{ name: 'medicine15', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 15',
    served: 'Served 15',
    status: false,
    note: 'Note 15',
    add: 'Add 15',
  },
  {
    id: 16,
    us: 17,
    room: 'Room16',
    bed: 'Bed16',
    patient: 'Patient16',
    bd: '2/16/2024',
    medicines: [{ name: 'medicine16', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 16',
    served: 'Served 16',
    status: false,
    note: 'Note 16',
    add: 'Add 16',
  },
  {
    id: 17,
    us: 18,
    room: 'Room17',
    bed: 'Bed17',
    patient: 'Patient17',
    bd: '2/16/2024',
    medicines: [{ name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 17',
    served: 'Served 17',
    status: false,
    note: 'Note 17',
    add: 'Add 17',
  },
  {
    id: 18,
    us: 19,
    room: 'Room18',
    bed: 'Bed18',
    patient: 'Patient18',
    bd: '2/16/2024',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],    toServe: 'To serve 18',
    served: 'Served 18',
    status: false,
    note: 'Note 18',
    add: 'Add 18',
  },
  {
    id: 19,
    us: 20,
    room: 'Room19',
    bed: 'Bed19',
    patient: 'Patient19',
    bd: '2/16/2024',
    medicines: [{ name: 'medicine19', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 19',
    served: 'Served 19',
    status: false,
    note: 'Note 19',
    add: 'Add 19',
  },
  {
    id: 20,
    us: 21,
    room: 'Room20',
    bed: 'Bed20',
    patient: 'Patient20',
    bd: '2/16/2024',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],    toServe: 'To serve 20',
    served: 'Served 20',
    status: false,
    note: 'Note 20',
    add: 'Add 20',
  },
  {
    id: 21,
    us: 22,
    room: 'Room21',
    bed: 'Bed21',
    patient: 'Patient21',
    bd: '2/17/2024',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],    toServe: 'To serve 21',
    served: 'Served 21',
    status: false,
    note: 'Note 21',
    add: 'Add 21',
  },
  {
    id: 22,
    us: 23,
    room: 'Room22',
    bed: 'Bed22',
    patient: 'Patient22',
    bd: '2/17/2024',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],    toServe: 'To serve 22',
    served: 'Served 22',
    status: false,
    note: 'Note 22',
    add: 'Add 22',
  },
  {
    id: 23,
    us: 24,
    room: 'Room23',
    bed: 'Bed23',
    patient: 'Patient23',
    bd: '2/17/2024',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],
        toServe: 'To serve 23',
    served: 'Served 23',
    status: false,
    note: 'Note 23',
    add: 'Add 23',
  },
  {
    id: 24,
    us: 25,
    room: 'Room24',
    bed: 'Bed24',
    patient: 'Patient24',
    bd: '2/17/2024',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],    toServe: 'To serve 24',
    served: 'Served 24',
    status: false,
    note: 'Note 24',
    add: 'Add 24',
  },
  {
    id: 25,
    us: 26,
    room: 'Room25',
    bed: 'Bed25',
    patient: 'Patient25',
    bd: '2/17/2024',
    medicines: [{ name: 'medicine25', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 25',
    served: 'Served 25',
    status: false,
    note: 'Note 25',
    add: 'Add 25',
  },
  {
    id: 26,
    us: 27,
    room: 'Room26',
    bed: 'Bed26',
    patient: 'Patient26',
    bd: '2/17/2024',
    medicines: [{ name: 'medicine26', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 26',
    served: 'Served 26',
    status: false,
    note: 'Note 26',
    add: 'Add 26',
  },
  {
    id: 27,
    us: 28,
    room: 'Room27',
    bed: 'Bed27',
    patient: 'Patient27',
    bd: '2/17/2024',
    medicines: [{ name: 'medicine27', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 27',
    served: 'Served 27',
    status: false,
    note: 'Note 27',
    add: 'Add 27',
  },
  {
    id: 28,
    us: 29,
    room: 'Room28',
    bed: 'Bed28',
    patient: 'Patient28',
    bd: '2/17/2024',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],    toServe: 'To serve 28',
    served: 'Served 28',
    status: false,
    note: 'Note 28',
    add: 'Add 28',
  },
  {
    id: 29,
    us: 30,
    room: 'Room29',
    bed: 'Bed29',
    patient: 'Patient29',
    bd: '2/17/2024',
    medicines: [{ name: 'medicine29', posology: ["12h", "13h", "14h"], root: 'Oral' }],
    toServe: 'To serve 29',
    served: 'Served 29',
    status: false,
    note: 'Note 29',
    add: 'Add 29',
  },
  {
    id: 30,
    us: 31,
    room: 'Room30',
    bed: 'Bed30',
    patient: 'Patient30',
    bd: '2/17/2024',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],    toServe: 'To serve 30',
    served: 'Served 30',
    status: false,
    note: 'Note 30',
    add: 'Add 30',
  },
];
