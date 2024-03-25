import { cardData } from '../../card-data';
import {MatMenuModule} from '@angular/material/menu';
import { NgForOf } from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-unit-care-details',
  standalone: true,
  imports: [MatIconModule,MatMenuModule,NgForOf,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,],
  templateUrl: './unit-care-details.component.html',
  styleUrl: './unit-care-details.component.css'
})
export class UnitCareDetailsComponent {

    //Data
    cards=cardData;

    selectedRoomEquipments: any[] = [];

selectRoomEquipments(room: any) {
    this.selectedRoomEquipments = room.equipments;
}

@ViewChild(MatAccordion) accordion: MatAccordion;

}
