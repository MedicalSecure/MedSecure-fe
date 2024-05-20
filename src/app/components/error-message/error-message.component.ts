import { Component, Inject, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';


/* 2 components in this file : a parent and a child */

/* this is the parent who will be imported inside the other components, and it will manage displaying and hiding logic */
/* it has no HTML or CSS */
@Component({
  selector: 'app-error-message',
  template: '',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule],
})
export class ErrorMessageComponent {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(
    message: string,
    duration: number = 2,
    title: string = 'Error : '
  ) {
    this._snackBar.openFromComponent(ErrorMessagePrivateViewComponent, {
      duration: duration * 1000,
      data: { message, title },
    });
  }
}



/* this is the actual viewed component */
@Component({
  selector: 'app-error-message-view',
  templateUrl: 'error-message.component.html',
  styleUrl: 'error-message.component.css',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    MatIcon,
  ],
})
//DONT IMPORT THIS COMPONENT
class ErrorMessagePrivateViewComponent {
  message = '';
  title = 'Error : ';

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string; title: string }
  ) {
    // Inject the data object with message and title properties
    this.message = data.message;
    this.title = data.title;
  }

  snackBarRef = inject(MatSnackBarRef);
}
