import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Posology } from '../../bacPatient/bacPatient.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialog } from '@angular/material/dialog';
import { DialogOverviewExampleDialogComponent } from '../../dialog/dialog-overview-example-dialog.component';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule , MatGridListModule ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
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
  @Input() hoursList : Posology[][]




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
  

  handleClickEvent(currentitem: { hour: string; value: string; quantity: string }, hourIndex: number, itemIndex: number): void {
    if (!currentitem.quantity) {
      currentitem.quantity = this.posologieValue ? this.posologieValue : '?';
    } else {
      if (currentitem.quantity === '?') {
        currentitem.quantity = '1';
      } else {
        const parsedQuantity = parseFloat(currentitem.quantity);
if (!isNaN(parsedQuantity)) {
  const incrementedQuantity = parsedQuantity + 1;
  currentitem.quantity = (incrementedQuantity % 1 === 0) ? String(incrementedQuantity) : incrementedQuantity.toFixed(2);
} else {
  currentitem.quantity = '1';
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
    for (const hourArray of this.hoursList) {
      const filteredHours = hourArray.filter((hourObj : any) =>
        desiredHours.includes(parseInt(hourObj.value, 10))
      );
      this.selectedHours.push(filteredHours);
    }
    this.selectedHours = this.selectedHours.filter((hourObj, index, self) =>
      index === self.findIndex((h) => h.value === hourObj.value)
    );
  }
  toggleCheckbox(currentitem: any) {
    currentitem.isSelected = !currentitem.isSelected;
    if(currentitem.isSelected){
      this.checkednumber++;
      this.checkEmmiter.emit(this.checkednumber);
    }
}
}

