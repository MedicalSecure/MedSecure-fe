import { Component, ViewChild } from '@angular/core';
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
@Component({
  selector: 'bac-patient.component',
  styleUrls: ['bac-patient.component.css'],
  templateUrl: 'bac-patient.component.html',
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

export class BacPatientComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<bacpatient>(ELEMENT_DATA);
   group_size : number[];
  ngAfterViewInit() {
       this.dataSource.paginator = this.paginator;
       if (this.paginator) {
        this.paginator.page.subscribe((event: PageEvent) => {
          this.customPaginate(event);
        });
        this.customPaginate({
          pageIndex: 0,
          pageSize: this.paginator.pageSize,
          length: ELEMENT_DATA.length
        });
      }
  }
  customPaginate(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    const sortedData = ELEMENT_DATA.sort((a, b) => {
      const dateA = new Date(a.bd);
      const dateB = new Date(b.bd);
      return dateA.getTime() - dateB.getTime();
    });
    const groupedData: { [key: string]: bacpatient[] } = {};
    sortedData.forEach(item => {
      if (!groupedData[item.bd]) {
        groupedData[item.bd] = [];
      }
      groupedData[item.bd].push(item);
    });
    const currentPageData: bacpatient[] = [];
    let data : bacpatient[] = [];
    for (const bd in groupedData) {
      if (groupedData.hasOwnProperty(bd)) {
        const group = groupedData[bd];
        const groupStartIndex = Math.max(0, startIndex - groupedData[bd].length);
        const groupEndIndex = Math.min(group.length, endIndex - groupedData[bd].length);
        currentPageData.push(...group.slice(groupStartIndex, groupEndIndex));
          }
    }
    for (let index = 0; index < data.length; index++) {
      this.dataSource = new MatTableDataSource<bacpatient>(groupedData[index]);
      console.log(groupedData[index].length );
      this.paginator.pageSize = groupedData[index].length ; 
    }
  }
  length =this.dataSource.data.length;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5,10,20];

  hidePageSize = false;
  showPageSizeOptions = false;
  showFirstLastButtons = false;
  disabled = false;

  pageEvent: PageEvent;
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
  constructor(public dialog: MatDialog ) { }

 
  [x: string]: any;
  todayDate: string = new Date().toLocaleDateString();
  columnsToDisplay = ['us', 'room', 'bed', 'patient', 'bd', 'toServe', 'served', 'status', 'note', 'add',];

  columnsToDisplayMedicines = ['name', 'posology', 'root']
  expandedElement: bacpatient | null;
  openDialog(): void {
    this.dialog.open(DialogueComponent, {
      width: '500px',
    });
  }
  onRightClick(): void{
    this.paginator.nextPage();
    

  } 
  onLeftClick(): void{
    this.paginator.previousPage();
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
    room: '123',
    bed: '15',
    patient: '4545',
    bd: '01/01/2000',
    medicines: [
      { name: 'medicine1', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine2', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine3', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine4', posology: ["12h", "13h", "14h"], root: 'Oral' }
    ],
    toServe: '15',
    served: '6',
    status: false,
    note: '',
    add: '',
  },
  {
    id: 2,
    us: 3,
    room: '124',
    bed: '16',
    patient: '4546',
    bd: '01/01/2000',
    medicines: [
      { name: 'medicine5', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine6', posology: ["12h", "13h", "14h"], root: 'Oral' },
    ],
    toServe: '16',
    served: '7',
    status: true,
    note: 'Note 1',
    add: "",
  },
  {
    id: 3,
    us: 4,
    room: '125',
    bed: '17',
    patient: '4547',
    bd: '01/01/2000',
    medicines: [
      { name: 'medicine9', posology: ["12h", "13h", "14h"], root: 'Oral' },

    ],
    toServe: '17',
    served: '8',

    status: false,
    note: 'Note 2',
    add: "",
  },
  {
    id: 4,
    us: 5,
    room: '126',
    bed: '18',
    patient: '4548',
    bd: '02/01/2000',
    medicines: [
      { name: 'medicine13', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine14', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine15', posology: ["12h", "13h", "14h"], root: 'Oral' },

    ],
    toServe: '18',
    served: '9',

    status: true,
    note: 'Note 3',
    add: ""
  },
  {
    id: 5,
    us: 6,
    room: '127',
    bed: '19',
    patient: '4549',
    bd: '01/01/2000',
    medicines: [
      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine19', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],
    toServe: '19',
    served: '10',
    status: false,
    note: 'Note 4'
    ,
    add: ""
  },
  {
    id: 6,
    us: 7,
    room: '128',
    bed: '20',
    patient: '4550',
    bd: '02/01/2000',
    medicines: [
      { name: 'medicine21', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine24', posology: ["12h", "13h", "14h"], root: 'Oral' }
    ],
    toServe: '20',
    served: '11',
    status: true,
    note: 'Note 5'
    ,
    add: ""
  },
  {
    id: 7,
    us: 8,
    room: '129',
    bed: '21',
    patient: '4551',
    bd: '02/01/2000',
    medicines: [
      { name: 'medicine25', posology: ["12h", "13h", "14h"], root: 'Injection' },

    ],
    toServe: '21',
    served: '12',
    status: false,
    note: 'Note 6',
    add: ""
  },
  {
    id: 8,
    us: 9,
    room: '130',
    bed: '22',
    patient: '4552',
    bd: '02/01/2000',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine19', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],
    toServe: '22',
    served: '13',
    status: true,
    note: 'Note 7',
    add: ""
  },
  {
    id: 9,
    us: 10,
    room: '131',
    bed: '23',
    patient: '4553',
    bd: '02/01/2000',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],
    toServe: '23',
    served: '14',
    status: false,
    note: 'Note 8',
    add: ""
  },
  {
    id: 10,
    us: 11,
    room: '132',
    bed: '24',
    patient: '4554',
    bd: '02/01/2000',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],
    toServe: '24',
    served: '15',
    status: true,
    note: 'Note 9',
    add: ""
  },
  {
    id: 1,
    us: 2,
    room: '123',
    bed: '15',
    patient: '4545',
    bd: '02/01/2000',
    medicines: [
      { name: 'medicine1', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine2', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine3', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine4', posology: ["12h", "13h", "14h"], root: 'Oral' }
    ],
    toServe: '15',
    served: '6',
    status: false,
    note: '',
    add: '',
  },
  {
    id: 2,
    us: 3,
    room: '124',
    bed: '16',
    patient: '4546',
    bd: '03/01/2000',
    medicines: [
      { name: 'medicine5', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine6', posology: ["12h", "13h", "14h"], root: 'Oral' },
    ],
    toServe: '16',
    served: '7',
    status: true,
    note: 'Note 1',
    add: "",
  },
  {
    id: 3,
    us: 4,
    room: '125',
    bed: '17',
    patient: '4547',
    bd: '05/01/2000',
    medicines: [
      { name: 'medicine9', posology: ["12h", "13h", "14h"], root: 'Oral' },

    ],
    toServe: '17',
    served: '8',

    status: false,
    note: 'Note 2',
    add: "",
  },
  {
    id: 4,
    us: 5,
    room: '126',
    bed: '18',
    patient: '4548',
    bd: '03/01/2000',
    medicines: [
      { name: 'medicine13', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine14', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine15', posology: ["12h", "13h", "14h"], root: 'Oral' },

    ],
    toServe: '18',
    served: '9',

    status: true,
    note: 'Note 3',
    add: ""
  },
  {
    id: 5,
    us: 6,
    room: '127',
    bed: '19',
    patient: '4549',
    bd: '03/01/2000',
    medicines: [
      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine19', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],
    toServe: '19',
    served: '10',
    status: false,
    note: 'Note 4'
    ,
    add: ""
  },
  {
    id: 6,
    us: 7,
    room: '128',
    bed: '20',
    patient: '4550',
    bd: '04/01/2000',
    medicines: [
      { name: 'medicine21', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine24', posology: ["12h", "13h", "14h"], root: 'Oral' }
    ],
    toServe: '20',
    served: '11',
    status: true,
    note: 'Note 5'
    ,
    add: ""
  },
  {
    id: 7,
    us: 8,
    room: '129',
    bed: '21',
    patient: '4551',
    bd: '01/01/2000',
    medicines: [
      { name: 'medicine25', posology: ["12h", "13h", "14h"], root: 'Injection' },

    ],
    toServe: '21',
    served: '12',
    status: false,
    note: 'Note 6',
    add: ""
  },
  {
    id: 8,
    us: 9,
    room: '130',
    bed: '22',
    patient: '4552',
    bd: '05/01/2000',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine19', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],
    toServe: '22',
    served: '13',
    status: true,
    note: 'Note 7',
    add: ""
  },
  {
    id: 9,
    us: 10,
    room: '131',
    bed: '23',
    patient: '4553',
    bd: '01/01/2000',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' },
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],
    toServe: '23',
    served: '14',
    status: false,
    note: 'Note 8',
    add: ""
  },
  {
    id: 10,
    us: 11,
    room: '132',
    bed: '24',
    patient: '4554',
    bd: '05/01/2000',
    medicines: [

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' }
    ],
    toServe: '24',
    served: '15',
    status: true,
    note: 'Note 9',
    add: ""
  },
];


