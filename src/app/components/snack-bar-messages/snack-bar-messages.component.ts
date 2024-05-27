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
import { CommonModule } from '@angular/common';

@Component({
  template: '',
  selector: 'app-snack-bar-messages',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule],
})
export class SnackBarMessagesComponent {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(
    message: string,
    messageType: snackbarMessageType,
    duration: number = 2,
    showIcon: boolean = true,
    title: string | undefined | null = undefined
  ) {
    if (showIcon == false) {
      if (title == undefined) {
        switch (messageType) {
          case snackbarMessageType.Error:
            title = 'Error :';
            break;

          case snackbarMessageType.Info:
            title = 'Info :';
            break;

          case snackbarMessageType.Success:
            title = 'Success :';
            break;

          case snackbarMessageType.Warning:
            title = 'Warning :';
            break;

          default:
            title = 'Error :';
            break;
        }
      } else if (title == null) {
        title = '';
      }
    }

    this._snackBar.openFromComponent(ErrorMessagePrivateViewComponent, {
      duration: duration * 1000,
      data: { message, title, messageType, showIcon },
    });
  }
}

export enum snackbarMessageType {
  Error = 'Error',
  Info = 'Info',
  Warning = 'Warning',
  Success = 'Success',
}

/* this is the actual viewed component */
@Component({
  selector: 'app-error-message-view',
  templateUrl: 'snack-bar-messages.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    MatIcon,
    CommonModule,
  ],
})
//DONT IMPORT THIS COMPONENT
class ErrorMessagePrivateViewComponent {
  message = '';
  title = 'Error : ';
  messageType = snackbarMessageType.Info;
  showIcon = false;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: {
      message: string;
      title: string;
      messageType: snackbarMessageType;
      showIcon: boolean;
    }
  ) {
    // Inject the data object with message and title properties
    this.message = data.message;
    this.title = data.title;
    this.messageType = data.messageType;
    this.showIcon = data.showIcon;
  }

  snackBarRef = inject(MatSnackBarRef);
}
