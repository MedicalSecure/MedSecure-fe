import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { DatePicker } from '../../shared/date-picker/date-picker.component';
import { ShipsSelectComponent } from '../../shared/chips-select/chips-select.component';


@Component({
  selector: 'app-add-symptoms',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule,DatePicker,ShipsSelectComponent],
  templateUrl: './add-symptoms.component.html',
  styleUrl: './add-symptoms.component.css'
})
export class AddSymptomsComponent {

}
