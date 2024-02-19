
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ScheduleComponent } from "../components/schedule/schedule.component";
import { MatTooltipModule } from '@angular/material/tooltip';
/**
 * @title Table with pagination
 */
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
  imports: [MatTableModule, MatTooltipModule, MatProgressBarModule, MatGridListModule, MatChipsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatPaginatorModule, JsonPipe, ScheduleComponent]
})
export class TestComponent implements AfterViewInit {
  filterByStatus() {
    const statusOrder: Record<string, number> = { 'Completed': 0, 'On Progress': 1, 'Pending...': 2 };
    this.dataSource.data = ELEMENT_DATA.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<bacpatient>(ELEMENT_DATA.sort((a, b) => a.room - b.room));
  todayDate: string = new Date().toLocaleDateString();
  columnsToDisplay = ['add', 'room', 'bed', 'patient', 'age', 'progress', 'status'];
  constructor(public dialog: MatDialog) { }
  columnsToDisplayMedicines = ['name', 'posology', 'root']
  expandedElement: bacpatient | null;
  selectedIndex: number | null = null;
  toggleExpanded(element: any) {this.expandedElement = this.expandedElement === element ? null : element;
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
  posology: Posology[][];
  root: string;
  dose: number;
  note: string;
}
export interface Posology {
  [x: string]: any;
  hour: string,
  value: string,
  quantity: number

}
interface bacpatient {
  id: number;
  room: number;
  bed: number;
  patient: string;
  age: number;
  medicines: Medicine[];
  toServe: number;
  served: number;
  status: string;
  note: string;
  add: string;
}
const ELEMENT_DATA = [
  {
    id: 1,
    room: 101,
    bed: 1,
    patient: 'Patient1',
    age: 40,
    medicines: [
      {
        name: 'medicine1', posology: [
          [
            { hour: '01', value: '1', quantity: 3 },
            { hour: '08', value: '8', quantity: 3 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '22', value: '22', quantity: 2 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Injection', dose: 2, note: ''
      },
      {
        name: 'medicine2', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 3 },
            { hour: '17', value: '17', quantity: 1 },
            { hour: '22', value: '22', quantity: 2 },
          ]
        ], root: 'Oral', dose: 2, note: ''
      },
      {
        name: 'medicine3', posology: [
          [
            { hour: '12', value: '12', quantity: 2 },
            { hour: '22', value: '22', quantity: 3 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Injection', dose: 2, note: ''
      }
    ],
    toServe: 20,
    served: 7,
    status: 'Pending...',
    note: 'Note 1',
    add: 'Add 1'
  },
  {
    id: 2,
    room: 102,
    bed: 2,
    patient: 'Patient2',
    age: 30,
    medicines: [
      {
        name: 'medicine4', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '17', value: '17', quantity: 3 },
            { hour: '22', value: '22', quantity: 1 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      },
      {
        name: 'medicine5', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Injection', dose: 1, note: ''
      },
      {
        name: 'medicine6', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '22', value: '22', quantity: 1 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      }
    ],
    toServe: 15,
    served: 5,
    status: 'Pending...',
    note: 'Note 2',
    add: 'Add 2'
  },
  {
    id: 3,
    room: 101,
    bed: 3,
    patient: 'Patient3',
    age: 45,
    medicines: [
      {
        name: 'medicine7', posology: [
          [
            { hour: '08', value: '8', quantity: 2 },
            { hour: '12', value: '12', quantity: 2 },
            { hour: '17', value: '17', quantity: 2 },
            { hour: '22', value: '22', quantity: 2 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      },
      {
        name: 'medicine8', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 2 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Injection', dose: 1, note: ''
      },
      {
        name: 'medicine9', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 2 },
            { hour: '22', value: '22', quantity: 1 },
            { hour: '00', value: '00', quantity: 2 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      }
    ],
    toServe: 18,
    served: 6,
    status: 'Pending...',
    note: 'Note 3',
    add: 'Add 3'
  },
  {
    id: 4,
    room: 102,
    bed: 4,
    patient: 'Patient4',
    age: 50,
    medicines: [
      {
        name: 'medicine10', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '17', value: '17', quantity: 1 },
            { hour: '22', value: '22', quantity: 1 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      },
      {
        name: 'medicine11', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Injection', dose: 1, note: ''
      },
      {
        name: 'medicine12', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '22', value: '22', quantity: 1 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      }
    ],
    toServe: 12,
    served: 4,
    status: 'Pending...',
    note: 'Note 4',
    add: 'Add 4'
  },
  {
    id: 5,
    room: 101,
    bed: 5,
    patient: 'Patient5',
    age: 35,
    medicines: [
      {
        name: 'medicine13', posology: [
          [
            { hour: '08', value: '8', quantity: 2 },
            { hour: '12', value: '12', quantity: 2 },
            { hour: '17', value: '17', quantity: 2 },
            { hour: '22', value: '22', quantity: 2 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      },
      {
        name: 'medicine14', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 2 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Injection', dose: 1, note: ''
      },
      {
        name: 'medicine15', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 2 },
            { hour: '22', value: '22', quantity: 1 },
            { hour: '00', value: '00', quantity: 2 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      }
    ],
    toServe: 17,
    served: 6,
    status: 'Pending...',
    note: 'Note 5',
    add: 'Add 5'
  },
  {
    id: 6,
    room: 102,
    bed: 6,
    patient: 'Patient6',
    age: 45,
    medicines: [
      {
        name: 'medicine16', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '17', value: '17', quantity: 1 },
            { hour: '22', value: '22', quantity: 1 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      },
      {
        name: 'medicine17', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Injection', dose: 1, note: ''
      },
      {
        name: 'medicine18', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '22', value: '22', quantity: 1 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      }
    ],
    toServe: 10,
    served: 3,
    status: 'Pending...',
    note: 'Note 6',
    add: 'Add 6'
  },
  {
    id: 7,
    room: 101,
    bed: 7,
    patient: 'Patient7',
    age: 50,
    medicines: [
      {
        name: 'medicine19', posology: [
          [
            { hour: '08', value: '8', quantity: 2 },
            { hour: '12', value: '12', quantity: 2 },
            { hour: '17', value: '17', quantity: 2 },
            { hour: '22', value: '22', quantity: 2 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      },
      {
        name: 'medicine20', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 2 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Injection', dose: 1, note: ''
      },
      {
        name: 'medicine21', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 2 },
            { hour: '22', value: '22', quantity: 1 },
            { hour: '00', value: '00', quantity: 2 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      }
    ],
    toServe: 16,
    served: 5,
    status: 'Pending...',
    note: 'Note 7',
    add: 'Add 7'
  },
  {
    id: 8,
    room: 102,
    bed: 8,
    patient: 'Patient8',
    age: 55,
    medicines: [
      {
        name: 'medicine22', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '17', value: '17', quantity: 1 },
            { hour: '22', value: '22', quantity: 1 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      },
      {
        name: 'medicine23', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Injection', dose: 1, note: ''
      },
      {
        name: 'medicine24', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '22', value: '22', quantity: 1 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      }
    ],
    toServe: 13,
    served: 4,
    status: 'Pending...',
    note: 'Note 8',
    add: 'Add 8'
  },
  {
    id: 9,
    room: 101,
    bed: 9,
    patient: 'Patient9',
    age: 60,
    medicines: [
      {
        name: 'medicine25', posology: [
          [
            { hour: '08', value: '8', quantity: 2 },
            { hour: '12', value: '12', quantity: 2 },
            { hour: '17', value: '17', quantity: 2 },
            { hour: '22', value: '22', quantity: 2 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      },
      {
        name: 'medicine26', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 2 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Injection', dose: 1, note: ''
      },
      {
        name: 'medicine27', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 2 },
            { hour: '22', value: '22', quantity: 1 },
            { hour: '00', value: '00', quantity: 2 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      }
    ],
    toServe: 14,
    served: 4,
    status: 'Pending...',
    note: 'Note 9',
    add: 'Add 9'
  },
  {
    id: 10,
    room: 102,
    bed: 10,
    patient: 'Patient10',
    age: 65,
    medicines: [
      {
        name: 'medicine28', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '17', value: '17', quantity: 1 },
            { hour: '22', value: '22', quantity: 1 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      },
      {
        name: 'medicine29', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Injection', dose: 1, note: ''
      },
      {
        name: 'medicine30', posology: [
          [
            { hour: '08', value: '8', quantity: 1 },
            { hour: '12', value: '12', quantity: 1 },
            { hour: '22', value: '22', quantity: 1 },
            { hour: '00', value: '00', quantity: 1 },
          ]
        ], root: 'Oral', dose: 1, note: ''
      }
    ],
    toServe: 11,
    served: 3,
    status: 'Pending...',
    note: 'Note 10',
    add: 'Add 10'
  },
];