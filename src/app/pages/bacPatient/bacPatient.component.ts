import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ViewChild, Input, OnInit, Type } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { CommentComponent } from "../../components/comment/comment.component";
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Dispense, ScheduleComponent } from "../../components/schedule/schedule.component";
import { bacpatient } from '../../model/BacPatient';
import { BacPatientService } from '../../services/bacPatient/bac-patient-services.service';


@Component({
  selector: 'table-pagination-example',
  templateUrl: './bacPatient.component.html',
  styleUrl: './bacPatient.component.css',
  standalone: true,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  imports: [RouterModule, DatePipe, MatTableModule, MatDatepickerModule, MatIconModule, MatTabsModule, MatSortModule, MatSort, MatTooltipModule, MatProgressBarModule, MatGridListModule, MatChipsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, JsonPipe, CommentComponent, ScheduleComponent]
})
export class BacPatientComponent implements AfterViewInit {
  dispenseQuantity: number = 0;
  today: Date = new Date();
  checkednumber: Number = 0;
  checkedItems: any[] = [];
  servedCount = 0;
  selectedDate: Date = new Date();
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  todayDate: string = new Date().toLocaleDateString();
  dateToShow: string;
  columnsToDisplay = ['add', 'room', 'bed', 'patient', 'age', 'progress', 'status'];
  columnsToDisplayMedicines = ['name', 'posology', 'root', 'note']
  expandedElement: bacpatient | null;
  selectedIndex: number | null = null;
  servingDay: Date[];
  tomorrow = new Date();
  yesterday = new Date();
  uniqueRooms: any;
  boxcheked: Dispense[] = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('picker') picker: MatDatepicker<Date>;
  changeDate(selectedDate: string) {
    this.todayDate = selectedDate;
    this.today.setDate(new Date(selectedDate).getDate());
    this.dataSource.data = ELEMENT_DATA.filter(item => new Date(item.prescription.createdAt).getDate() === (this.today.getDate()));

  }
  constructor(public dialog: MatDialog, private http: HttpClient, private bacPatientService: BacPatientService) {
    const filteredData = ELEMENT_DATA.filter(item => new Date(item.prescription.createdAt).toLocaleDateString() === this.todayDate);
    this.dataSource.data = filteredData;
    this.uniqueRooms = this.getRoom(ELEMENT_DATA);

  }
  ngOnInit() {


    this.bacPatientService.getData(this.dataSource);

  }
  onLeftButtonClick() {
    this.dataSource.data = ELEMENT_DATA.filter(item => new Date(item.prescription.createdAt).getDate() === (this.today.getDate() - 1));
    this.today.setDate(this.today.getDate() - 1);
    this.todayDate = this.today.toLocaleDateString();

  }
  onRightButtonClick() {
    this.dataSource.data = ELEMENT_DATA.filter(item => new Date(item.prescription.createdAt).getDate() === (this.today.getDate() + 1));
    this.today.setDate(this.today.getDate() + 1)
    this.todayDate = this.today.toLocaleDateString();
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
  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  handleCheckBoxClick(eventData: Dispense[]) {
    let allBeforeMealChecked = true;
    let allAfterMealChecked = true;
    let oneCheckBoxIsClicked = false;
  
    this.dataSource.data.forEach(bacPatient => {
      // Reset servedCount for each bacPatient
      this.servedCount = 0;
  
      bacPatient.prescription.posologies.forEach(posology => {
        posology.dispenses.forEach(dispense => {
          if (dispense.beforeMeal && dispense.beforeMeal.isValid) {
            this.servedCount += parseInt(dispense.beforeMeal.quantity, 10) || 0;
          } else {
            allBeforeMealChecked = false;
            oneCheckBoxIsClicked = true;
          }
  
          if (dispense.afterMeal && dispense.afterMeal.isValid) {
            this.servedCount += parseInt(dispense.afterMeal.quantity, 10) || 0;
          } else {
            allAfterMealChecked = false;
            oneCheckBoxIsClicked = true;
          }
        });
      });
  
      if (allBeforeMealChecked && allAfterMealChecked) {
        bacPatient.status = 2;
      } else if (oneCheckBoxIsClicked) {
        bacPatient.status = 1;
      } else {
        bacPatient.status = 0;
      }
  
      bacPatient.served = this.servedCount;
      this.bacPatientService.updateBacPatient(bacPatient);
  
      // Reset flags for the next bacPatient
      allBeforeMealChecked = true;
      allAfterMealChecked = true;
    });
  }
  

  getRouteImage(route: number): string {
    switch (route) {
      case 0:
        return 'assets/routes/eye.svg';
      case 1:
        return 'assets/routes/ear.svg';
      case 2:
        return 'assets/routes/lungs.svg';
      case 3:
        return 'assets/routes/bandage.svg';
      case 4:
        return 'assets/routes/syrup.svg';
      case 5:
        return 'assets/routes/cream.svg';
      case 6:
        return 'assets/routes/Sublingual.svg';
      case 7:
        return 'assets/routes/Intramuscular.svg';
      case 8:
        return 'assets/routes/Intracardiac.svg';
      case 9:
        return 'assets/routes/spray.svg';
      case 10:
        return 'assets/routes/vaccine.svg';
      case 11:
        return 'assets/routes/pills.svg';
      default:
        return '';
    }
  }
}
export let ELEMENT_DATA: bacpatient[] = [
  /* {
     id: 1,
     room: 101,
     bed: 1,
     patient: 'rahma',
     bd: new Date('5/13/2000'),
     medicines: [
       {
         name: 'Acetylsalicylic', posology: [
           [
             { hour: '02', value: '8', quantityBE: 1 , quantityAE :2},
             { hour: '07', value: '2', quantityBE: 1 , quantityAE :2},
             { hour: '08', value: '22', quantityBE: 1 , quantityAE :2 },
             { hour: '14', value: '04', quantityBE: 1 , quantityAE :2 },
             { hour: '19', value: '22', quantityBE: 1 , quantityAE :2 },
             { hour: '23', value: '04', quantityBE: 1 , quantityAE :2 },
           ]], 
         root: 'Injection', dose: 2, 
         note: ["Lorem Ipsum is simply dummy text of the printing and typesetting industry", "Lorem Ipsum is simply dummy text of the printing and typesetting industry"],
         description : 'some description',
       },
       {
         name: 'Hydrochlorothiazide', posology: [
           [
             { hour: '01', value: '8', quantityBE: 1 , quantityAE :2 },
             { hour: '19', value: '17', quantityBE: 1 , quantityAE :2 },
             { hour: '21', value: '22', quantityBE: 1 , quantityAE :2 },
             { hour: '23', value: '8', quantityBE: 1 , quantityAE :2 },
             { hour: '07', value: '17', quantityBE: 1 , quantityAE :2 },
             { hour: '13', value: '22', quantityBE: 1 , quantityAE :2 },
           ]
         ], 
         root: 'Nebulizers', 
         dose: 2, 
         note: ["Lorem Ipsum is simply dummy text of the printing and typesetting industry"]
         ,description : 'some description'
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
             { hour: '04', value: '8', quantityBE: 1 , quantityAE :2 },
             { hour: '10', value: '02', quantityBE: 1 , quantityAE :2 },
 
           ]
         ], root: 'Intracardiac', dose: 1, 
         note:['']
         ,description : 'some description'
       },
       {
         name: 'Levothyroxine', posology: [
           [
             { hour: '05', value: '8', quantityBE: 1 , quantityAE :2 },
             { hour: '03', value: '03', quantityBE: 1 , quantityAE :2 },
             { hour: '15', value: '04', quantityBE: 1 , quantityAE :2 },
 
           ]
         ], root: 'Intramuscular', dose: 1, 
         note: ["Lorem Ipsum is simply dummy text of the printing and typesetting industry", "Lorem Ipsum is simply dummy text of the printing and typesetting industry", "Lorem Ipsum is simply dummy text of the printing and typesetting industry"]
         ,description : 'some description'
       },
       {
         name: 'Pantoprazole', posology: [
           [
             { hour: '10', value: '22', quantityBE: 1 , quantityAE :2 },
             { hour: '23', value: '04', quantityBE: 1 , quantityAE :2 },
             { hour: '15', value: '22', quantityBE: 1 , quantityAE :2 },
             { hour: '16', value: '04', quantityBE: 1 , quantityAE :2 },
             { hour: '11', value: '22', quantityBE: 1 , quantityAE :2 },
             { hour: '07', value: '04', quantityBE: 1 , quantityAE :2 },
 
           ]
         ], 
         root: 'Sublingual', dose: 1, 
         note:['']
         ,description : 'some description'
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
             { hour: '02', value: '02', quantityBE: 1 , quantityAE :2 },
             { hour: '17', value: '17', quantityBE: 1 , quantityAE :2 },
             { hour: '22', value: '22', quantityBE: 1 , quantityAE :2 },
             { hour: '05', value: '02', quantityBE: 1 , quantityAE :2 },
             { hour: '03', value: '17', quantityBE: 1 , quantityAE :2 },
             { hour: '19', value: '22', quantityBE: 1 , quantityAE :2 },
        
           ]
         ], root: 'Transdermal', dose: 1, note: ["Lorem Ipsum is simply dummy text of the printing and typesetting industry", "Lorem Ipsum is simply dummy text of the printing and typesetting industry"]
         ,description : 'some description'
       },
       {
         name: 'Azithromycin', posology: [
           [
             { hour: '01', value: '8', quantityBE: 1 , quantityAE :2 },
             { hour: '23', value: '03', quantityBE: 1 , quantityAE :2 },
             { hour: '13', value: '04', quantityBE: 1 , quantityAE :2 },
           
           ]
 
         ], root: 'Syrup', dose: 1, note:['']
         ,description : 'some description'
       },
       {
         name: 'Lisdexamfetamine', posology: [
           [
             { hour: '09', value: '8', quantityBE: 1 , quantityAE :2 },
             { hour: '11', value: '02', quantityBE: 1 , quantityAE :2 },
             { hour: '16', value: '22', quantityBE: 1 , quantityAE :2 },
             { hour: '20', value: '8', quantityBE: 1 , quantityAE :2 },
             { hour: '06', value: '02', quantityBE: 1 , quantityAE :2 },
             { hour: '21', value: '22', quantityBE: 1 , quantityAE :2 },
      
           ]
         ], root: 'Bandage', dose: 1, note:['']
         ,description : 'some description'
       }
     ],
     toServe: 18,
     served: 6,
     status: 'On Progress',
     
     add: 'Add 3',
     servingDate: new Date()
   }, 
   {
     id: 3,
     room: 102,
     bed: 3,
     patient: 'vasco',
     bd: new Date('5/13/2000'),
     medicines: [
       {
         name: 'Ceftriaxone', posology: [
           [
             { hour: '09', value: '02', quantityBE: 1 , quantityAE :2 },
             { hour: '18', value: '17', quantityBE: 1 , quantityAE :2 },
             { hour: '23', value: '22', quantityBE: 1 , quantityAE :2 },
             { hour: '05', value: '02', quantityBE: 1 , quantityAE :2 },
             { hour: '12', value: '17', quantityBE: 1 , quantityAE :2 },
             { hour: '08', value: '22', quantityBE: 1 , quantityAE :2 },
        
           ]
         ], root: 'Transdermal', dose: 1, note: ["Lorem Ipsum is simply dummy text of the printing and typesetting industry", "Lorem Ipsum is simply dummy text of the printing and typesetting industry"]
         ,description : 'some description'
       },
       {
         name: 'Azithromycin', posology: [
           [
             { hour: '01', value: '8', quantityBE: 1 , quantityAE :2 },
             { hour: '12', value: '03', quantityBE: 1 , quantityAE :2 },
             { hour: '17', value: '04', quantityBE: 1 , quantityAE :2 },
           
           ]
 
         ], root: 'Syrup', dose: 1, note:['']
         ,description : 'some description'
       },
       {
         name: 'Lisdexamfetamine', posology: [
           [
             { hour: '09', value: '8', quantityBE: 1 , quantityAE :2 },
             { hour: '18', value: '02', quantityBE: 1 , quantityAE :2 },
           
      
           ]
         ], root: 'Bandage', dose: 1, note:['']
         ,description : 'some description'
       }
     ],
     toServe: 18,
     served: 6,
     status: 'On Progress',
     
     add: 'Add 3',
     servingDate: new Date()
   },
   {
     id: 4,
     room: 103,
     bed: 1,
     patient: 'Sara',
     bd: new Date('3/24/1985'),
     medicines: [
       {
         name: 'Metformin',
         posology: [
           [
             { hour: '08', value: '10', quantityBE: 1, quantityAE: 2 },
             { hour: '14', value: '15', quantityBE: 1, quantityAE: 2 },
             { hour: '20', value: '20', quantityBE: 1, quantityAE: 2 }
           ]
         ],
         root: 'Oral',
         dose: 1,
         note: ["Lorem Ipsum is simply dummy text of the printing and typesetting industry"]
         ,description : 'some description'
       },
       {
         name: 'Atorvastatin',
         posology: [
           [
             { hour: '10', value: '20', quantityBE: 1, quantityAE: 2 },
             { hour: '18', value: '30', quantityBE: 1, quantityAE: 2 }
           ]
         ],
         root: 'Oral',
         dose: 1,
         note: ['']
         ,description : 'some description'
       }
     ],
     toServe: 10,
     served: 3,
     status: 'Pending...',
     add: 'Add 4',
     servingDate: new Date()
   },
   {
     id: 5,
     room: 104,
     bed: 2,
     patient: 'John',
     bd: new Date('7/12/1978'),
     medicines: [
       {
         name: 'Amlodipine',
         posology: [
           [
             { hour: '04', value: '10', quantityBE: 1, quantityAE: 2 },
             { hour: '15', value: '20', quantityBE: 1, quantityAE: 2 },
             { hour: '21', value: '30', quantityBE: 1, quantityAE: 2 }
           ]
         ],
         root: 'Oral',
         dose: 1,
         note: ["Lorem Ipsum is simply dummy text of the printing and typesetting industry"]
         ,description : 'some description'
       },
       {
         name: 'Losartan',
         posology: [
           [
             { hour: '08', value: '20', quantityBE: 1, quantityAE: 2 },
             { hour: '16', value: '30', quantityBE: 1, quantityAE: 2 }
           ]
         ],
         root: 'Oral',
         dose: 1,
         note: ['']
         ,description : 'some description'
       }
     ],
     toServe: 12,
     served: 6,
     status: 'On Progress',
     add: 'Add 5',
     servingDate: new Date()
   },
   {
     id: 6,
     room: 105,
     bed: 3,
     patient: 'Emily',
     bd: new Date('10/05/1993'),
     medicines: [
       {
         name: 'Paracetamol',
         posology: [
           [
             { hour: '07', value: '10', quantityBE: 1, quantityAE: 2 },
             { hour: '03', value: '20', quantityBE: 1, quantityAE: 2 },
             { hour: '19', value: '30', quantityBE: 1, quantityAE: 2 }
           ]
         ],
         root: 'Oral',
         dose: 1,
         note: ["Lorem Ipsum is simply dummy text of the printing and typesetting industry"]
         ,description : 'some description'
       },
       {
         name: 'Ibuprofen',
         posology: [
           [
             { hour: '02', value: '20', quantityBE: 1, quantityAE: 2 },
             { hour: '14', value: '30', quantityBE: 1, quantityAE: 2 }
           ]
         ],
         root: 'Oral',
         dose: 1,
         note: ['']
         ,description : 'some description'
       }
     ],
     toServe: 8,
     served: 2,
     status: 'Pending...',
     add: 'Add 6',
     servingDate: new Date()
   }*/
];
export { bacpatient };

