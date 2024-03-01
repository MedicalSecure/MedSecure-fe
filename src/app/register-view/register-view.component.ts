import { Component } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';


export interface PeriodicElement {
  name: string;
  ID: number;
  age: number;
  status : boolean;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  {ID: 1, name: 'Haide', age: 37 , status : true},
  {ID: 2, name: 'helen', age:60 , status :true},
  {ID: 3, name: 'liam', age: 7 , status :true},
  {ID: 4, name: 'Bery', age:56 , status :false},
  {ID: 5, name: 'Big', age: 55 , status :true},
  {ID: 6, name: 'Carol', age: 66 , status :true},
  {ID: 7, name: 'Nissrine', age: 29 , status :true},
  {ID: 8, name: 'oliver', age: 19 , status :false},
  {ID: 9, name: 'Florence', age: 44 , status :true},
  {ID: 10, name: 'Neon', age: 20 , status :true},
];


@Component({
  standalone : true,
  selector: 'app-register-view',
  templateUrl: './register-view.component.html',
  styleUrls: ['./register-view.component.css'],
  imports: [RouterModule,MatFormFieldModule, MatInputModule, MatTableModule],
  providers: [],
})
export class RegisterViewComponent {
  getStatusLabel(element: PeriodicElement): string {
    return element.status === false ? '<label class="badge badge-danger">Out</label>' : '<label class="badge badge-success">Resident</label>';
  }

  displayedColumns: string[] = ['ID', 'name', 'age','status'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    
  constructor(private router: Router) {}

  ngOnInit() {}

  navigateToAddPatient() {
    this.router.navigate(['/register']);
  }
  
}
