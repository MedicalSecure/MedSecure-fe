import { Component } from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-side-rooms',
  standalone: true,
  imports: [MatListModule, MatIconModule, MatDividerModule,MatSelectModule,
    MatIcon,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
   ],
  templateUrl: './side-rooms.component.html',
  styleUrl: './side-rooms.component.css'
})
export class SideRoomsComponent {
  selected = '';
  title: string = '';
  description: string = '';
  FormData!: FormGroup;
  imageControl = new FormControl();

  i: any;

  constructor(private builder: FormBuilder,)
   {}

  ngOnInit() {
    this.FormData = this.builder.group({
      rooms: this.builder.array([this.builder.control(null)]),
    });
  }

  addItem() {
    (this.FormData.get('rooms') as FormArray).push(this.builder.control(null));
  }
  deleteItem(index: any) {
    (this.FormData.get('rooms') as FormArray).removeAt(index);
  }

  getRooms(): AbstractControl[] {
    return (<FormArray>this.FormData.get('rooms')).controls;
  }
  personnel = [
    { name: 'Daniel Martinez',  },
    { name: 'Olivia Garcia', },
    { name: 'William Rodriguez' }
  ];
  filteredPersonnel: any[] | undefined;
  searchQuery!: string;

  filterPersonnel() {
    if (!this.searchQuery) {
      this.filteredPersonnel = this.personnel;
    } else {
      this.filteredPersonnel = this.personnel.filter(person =>
        person.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
}

