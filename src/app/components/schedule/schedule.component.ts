import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Posology } from '../../pages/bacPatient/bacPatient.component';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule , MatGridListModule ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
})
export class ScheduleComponent implements OnInit {

   todayDate: string = new Date().toLocaleDateString();
  @Input() selectedHours: any[] = [];
  @Input() hoursListEmitter: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Input() keyDownEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() posologieValue: any;
  @Output() checkEmmiter: EventEmitter<Number> = new EventEmitter<Number>();
  @Output() checkStatusEmmiter: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  checkednumber:number =0;
  fullyChecked:boolean = false ;
  showChoices: boolean = true;
  @Input() hoursList : Posology[];
  selectedItems: any[] = []; // Initialize an array to store selected items




  ngOnInit(): void {
    this.setDesiredHours();
  }

  toggleChoices(): void {
    this.showChoices = !this.showChoices;
  }

  onKeyDown(event: any, hourIndex: number, itemIndex: number): void {
    const eventData = { event, hourIndex, itemIndex };
    this.keyDownEvent.emit(eventData);
  }

  handleClickEvent(
    currentitem: Posology,
    hourIndex: number,
    itemIndex: number
  ): void {
    var quantity = (currentitem.quantityAE = currentitem.quantityBE).toString()
    if (!quantity) {
      quantity = this.posologieValue ? this.posologieValue : '?';
    } else {
      if (quantity === '?') {
        quantity = '1';
      } else {
        const parsedQuantity = parseFloat(quantity);
if (!isNaN(parsedQuantity)) {
  const incrementedQuantity = parsedQuantity + 1;
quantity = (incrementedQuantity % 1 === 0) ? String(incrementedQuantity) : incrementedQuantity.toFixed(2);
} else {
  quantity = '1';
}
      }
    }
    this.hoursListEmitter.emit(this.hoursList);
  }

  formatNumber(num: string): string {
    if (num) {
      if (num === '?') return '?';
      if (+num % 1 !== 0) return num.replace('.', ',');
      return num;
    }
    return '';
  }
  setDesiredHours(): void {
    const desiredHours = [8, 12, 17, 22, 0 ,1];
 this.selectedHours.push(this.hoursList[0].hours)
   
    
    
  }
  toggleCheckbox(currentitem: any) {
    const index = this.selectedItems.indexOf(currentitem);
    if (index === -1) {
        this.selectedItems.push(currentitem); // Add item to the selected items array if not already selected
        this.checkednumber++;
    } else {
        this.selectedItems.splice(index, 1); // Remove item from the selected items array if already selected
        this.checkednumber--;
    }
    this.checkEmmiter.emit(this.checkednumber);
}

isSelected(currentitem: any): boolean {
    return this.selectedItems.includes(currentitem); // Check if the item is in the selected items array
}
}

