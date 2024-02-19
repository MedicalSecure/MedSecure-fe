import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit {
   todayDate: string = new Date().toLocaleDateString();
  @Input() selectedHours: any[] = [];
  @Input() daysOfWeek: string[] = [this.todayDate];
  @Input() hoursListEmitter: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Input() keyDownEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() posologieValue: any;
  showChoices: boolean = true;

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
  hoursList: any[] = [
    [
      { hour: '08', value: '8', quantity: '1' },
      { hour: '12', value: '12', quantity: '1' },
      { hour: '17', value: '17', quantity: '-' },
      { hour: '18', value: '18', quantity: '1' },
      { hour: '19', value: '19', quantity: '-' },
      { hour: '20', value: '20', quantity: '1' },
      { hour: '21', value: '21', quantity: '-' },
      { hour: '22', value: '22', quantity: '1' },
  
      { hour: '00', value: '00', quantity: '1' },
    ],
  ];

  setDesiredHours(): void {
    const desiredHours = [8, 12, 17, 22, 0];
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
}
}
