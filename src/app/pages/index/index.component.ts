import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { NgIf } from '@angular/common';


@Component({
    selector: 'app-index',
    standalone: true,
    templateUrl: './index.component.html',
    styleUrl: './index.component.css',
    providers: [provideNativeDateAdapter()],
    imports: [RouterModule, MatFormFieldModule, MatInputModule, MatDatepickerModule,NgIf],
})
export class IndexComponent {

}


  
  


