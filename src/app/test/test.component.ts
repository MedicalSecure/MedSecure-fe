
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
import {MatChipsModule} from '@angular/material/chips';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressBarModule} from '@angular/material/progress-bar';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'table-pagination-example',
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  standalone: true,
  imports: [MatTableModule,MatProgressBarModule ,MatGridListModule,MatChipsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule , MatPaginatorModule , JsonPipe],
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
  columnsToDisplay = ['add', 'room', 'bed', 'patient', 'bd', 'progress','status' ];
  constructor(public dialog: MatDialog ) { }
  columnsToDisplayMedicines = ['name', 'posology', 'root']
  expandedElement: bacpatient | null; 

  
  selectedIndex: number | null = null; // Property to track selected index
  toggleExpanded(element: any) {
    this.expandedElement = this.expandedElement === element ? null : element;
}
  toggleRowExpansion(element: any, index: number): void {
    if (this.expandedElement === element) {
      this.expandedElement = null;
    } else {
      this.expandedElement = element;
    }
    this.selectedIndex = index; 
  }

 
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

 
}
interface Medicine {
  name: string;
  posology: string[];
  root: string;
  dose : number ; 
  note: string ; 
}
interface bacpatient {
  id: number;
  us: number;
  room: string;
  bed: string;
  patient: string;
  bd: string;
  medicines: Medicine[];
  toServe: number;
  served: number;
  status: string;
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

      { name: 'medicine17', posology: ["12h", "13h", "14h"], root: 'Injection' , dose:2 ,note:'' },
      { name: 'medicine18', posology: ["12h", "13h", "14h"], root: 'Oral' ,dose:2, note:''},
      { name: 'medicine20', posology: ["12h", "13h", "14h"], root: 'Injection' , dose:2 ,note:''}
    ],
    toServe: 20,
    served: 7,
    status: 'On Progress',
    note: 'Note 1',
    add: 'Add 1',
  },
  

];
