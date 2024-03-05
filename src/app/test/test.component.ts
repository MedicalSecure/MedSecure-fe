
import { AfterViewInit, Component, ViewChild, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ScheduleComponent } from "../components/schedule/schedule.component";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MessageComponent } from "../message/message.component";
import { MatTabsModule } from '@angular/material/tabs';
import { DialogOverviewExampleDialogComponent } from '../dialog-overview-example-dialog/dialog-overview-example-dialog.component';
import { CommentComponent } from "../comment/comment.component";

@Component({
  selector: 'table-pagination-example',
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  standalone: true,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  imports: [MatTableModule, MatDatepickerModule, MatIconModule, MatTabsModule, MatSortModule, MatSort, MatTooltipModule, MatProgressBarModule, MatGridListModule, MatChipsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, JsonPipe, ScheduleComponent, MessageComponent, CommentComponent]
})
export class TestComponent implements AfterViewInit {

  today: Date = new Date();
  checkednumber: Number = 0;
  checkedItems: any[] = [];
  selectedDate: Date = new Date();
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  todayDate: string = new Date().toLocaleDateString();
  dateToShow: string;
  columnsToDisplay = ['add', 'room', 'bed', 'patient', 'age', 'progress', 'status'];
  columnsToDisplayMedicines = ['name', 'posology', 'root']
  expandedElement: bacpatient | null;
  selectedIndex: number | null = null;
  servingDay: Date[];
  tomorrow = new Date();
  yesterday = new Date();
  uniqueRooms: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('picker') picker: MatDatepicker<Date>;
  changeDate(selectedDate: string) {
    this.todayDate = selectedDate;
    this.today.setDate(new Date(selectedDate).getDate());
    this.dataSource.data = ELEMENT_DATA.filter(item => new Date(item.servingDate).getDate() === (this.today.getDate()));

  }
  constructor(public dialog: MatDialog) {
    const filteredData = ELEMENT_DATA.filter(item => new Date(item.servingDate).toLocaleDateString() === this.todayDate);
    this.dataSource.data = filteredData;
    this.uniqueRooms = this.getRoom(ELEMENT_DATA);

  }
  onLeftButtonClick() {
    this.dataSource.data = ELEMENT_DATA.filter(item => new Date(item.servingDate).getDate() === (this.today.getDate() - 1));
    this.today.setDate(this.today.getDate() - 1);
    this.todayDate = this.today.toLocaleDateString();

  }
  onRightButtonClick() {
    this.dataSource.data = ELEMENT_DATA.filter(item => new Date(item.servingDate).getDate() === (this.today.getDate() + 1));
    this.today.setDate(this.today.getDate() + 1)
    this.todayDate = this.today.toLocaleDateString();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  toggleExpanded(element: any) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  toggleRowExpansion(element: any, index: number): void {
    if (this.expandedElement === element) {
      this.expandedElement = null;
    } else {
      this.expandedElement = element;
    }
    this.selectedIndex = index;
  }
  getRoom(data: any[]): number[] {
    const rooms: number[] = [];
    data.forEach(item => {
      if (!rooms.includes(item.room)) {
        rooms.push(item.room);
      }
    });
    return rooms;
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.yesterday.setDate(this.yesterday.getDate() - 1);


  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  Filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
      const patientToUpdate = this.dataSource.data.find(patient => patient.id == element.id);
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
}
export interface Medicine {
  name: string;
  posology: Posology[][];
  root: string;
  dose: number;
  note: string[];
}
export interface Posology {
  [x: string]: any;
  hour: string,
  value: string,
  quantity: number

}
export interface bacpatient {
  id: number;
  room: number;
  bed: number;
  patient: string;
  bd: Date;
  medicines: Medicine[];
  toServe: number;
  served: number;
  status: string;
  add: string;
  servingDate: Date;
}
export const ELEMENT_DATA : bacpatient[] = [
  {
    id: 1,
    room: 101,
    bed: 1,
    patient: 'rahma',
    bd: new Date('5/13/2000'),
    medicines: [
      {
        name: 'Acetylsalicylic', posology: [
          [
          
            { hour: '02', value: '8', quantity: 3 },
            { hour: '03', value: '2', quantity: 1 },
            { hour: '22', value: '22', quantity: 2 },
            { hour: '04', value: '04', quantity: 1 },

          ]
        ], root: 'Injection', dose: 2, note: ["Lorem Ipsum is simply dummy text of the printing and typesetting industry", "Lorem Ipsum is simply dummy text of the printing and typesetting industry"]

      },
      {
        name: 'Hydrochlorothiazide', posology: [
          [
            { hour: '01', value: '8', quantity: 1 },
            { hour: '17', value: '17', quantity: 1 },
            { hour: '22', value: '22', quantity: 2 },
          ]
        ], root: 'Oral', dose: 2, note: ["Lorem Ipsum is simply dummy text of the printing and typesetting industry"]
      },
    
    ],
    toServe: 20,
    served: 7,
    status: 'Pending...',
    add: 'Add 1',
    servingDate: new Date()
  },
  {
    id: 2,
    room: 102,
    bed: 2,
    patient: 'mehrez',
    bd: new Date('5/13/2000'),
    medicines: [
      {
        name: 'Esomeprazole', posology: [
          [
            { hour: '01', value: '8', quantity: 1 },
            { hour: '02', value: '02', quantity: 1 },
            { hour: '17', value: '17', quantity: 3 },
            { hour: '22', value: '22', quantity: 1 },

          ]
        ], root: 'Oral', dose: 1, note:['']
      },
      {
        name: 'Levothyroxine', posology: [
          [
            { hour: '01', value: '8', quantity: 1 },
            { hour: '03', value: '03', quantity: 1 },
            { hour: '04', value: '04', quantity: 1 },

          ]
        ], root: 'Injection', dose: 1, note: ["Lorem Ipsum is simply dummy text of the printing and typesetting industry", "Lorem Ipsum is simply dummy text of the printing and typesetting industry", "Lorem Ipsum is simply dummy text of the printing and typesetting industry"]
      },
      {
        name: 'Pantoprazole', posology: [
          [
            { hour: '22', value: '22', quantity: 1 },
            { hour: '04', value: '04', quantity: 1 },

          ]
        ], root: 'Oral', dose: 1, note:['']
      }
    ],
    toServe: 15,
    served: 5,
    status: 'Completed',
    add: 'Add 2',
    servingDate: new Date()
  },
  {
    id: 3,
    room: 101,
    bed: 3,
    patient: 'nejma',
    bd: new Date('5/13/2000'),
    medicines: [
      {
        name: 'Ceftriaxone', posology: [
          [
            { hour: '02', value: '02', quantity: 2 },
            { hour: '17', value: '17', quantity: 2 },
            { hour: '22', value: '22', quantity: 2 },
       
          ]
        ], root: 'Oral', dose: 1, note: ["Lorem Ipsum is simply dummy text of the printing and typesetting industry", "Lorem Ipsum is simply dummy text of the printing and typesetting industry"]
      },
      {
        name: 'Azithromycin', posology: [
          [
            { hour: '01', value: '8', quantity: 1 },
            { hour: '03', value: '03', quantity: 2 },
            { hour: '04', value: '04', quantity: 1 },
          
          ]

        ], root: 'Injection', dose: 1, note:['']
      },
      {
        name: 'Lisdexamfetamine', posology: [
          [
            { hour: '01', value: '8', quantity: 1 },
            { hour: '02', value: '02', quantity: 2 },
            { hour: '22', value: '22', quantity: 1 },
     
          ]
        ], root: 'Oral', dose: 1, note:['']
      }
    ],
    toServe: 18,
    served: 6,
    status: 'On Progress',
    
    add: 'Add 3',
    servingDate: new Date()
  }, 
];