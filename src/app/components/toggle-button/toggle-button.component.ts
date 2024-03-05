import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toggle-button',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.css',
})
export class ToggleButtonComponent {
  @Input() on: boolean = false;
  @Input() showLabels = true;
  @Input() onText = 'Yes';
  @Input() containerClass: { [klass: string]: string } = {};
  @Input() dotStyle: { [klass: string]: string } = {};
  @Input() offText = 'No';
  @Output() changed = new EventEmitter<boolean>();
  @Input() BackgroundColorON: string = '#1275e8';
  @Input() BackgroundColorOFF: string = '#FFFFFF';
  @Input() TextColorOn: String = 'white';
  @Input() TextColorOff: String = '#333';
  @Input() DotColorOn: String = 'white';
  @Input() DotColorOff: String = '#757575';

  id = '';
  constructor() {
    this.id = this._generateRandomId(10);
  }

  onToggleSwitch($event: Event): void {
    const isChecked = (<HTMLInputElement>$event.target).checked;
    this.on = isChecked;
    this.changed.emit(isChecked);
  }

  private _generateRandomId(length: number): string {
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, (byte) =>
      byte.toString(16).padStart(2, '0')
    ).join('');
  }
}
