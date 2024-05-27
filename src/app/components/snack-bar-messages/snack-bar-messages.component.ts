import { Component, Inject, Input, inject } from '@angular/core';
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
import { SnackBarMessagesService } from '../../services/util/snack-bar-messages.service';

@Component({
  template: '',
  selector: 'app-snack-bar-messages',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule],
})
export class SnackBarMessagesComponent {
  @Input()
  defaultDisplayTimeInSeconds: number = 4;

  @Input()
  defaultMessageType: snackbarMessageType = snackbarMessageType.Error;

  @Input()
  defaultShowIcon: boolean = true;



  constructor(
    private _snackBar: MatSnackBar,
    private snackBarMessagesService: SnackBarMessagesService
  ) {}

  ngOnInit() {
    this.snackBarMessagesService.snackBarMessages$.subscribe(
      (props: SnackBarMessageProps) => {
        this.openSnackBar(props);
      },
      (err) => {
        console.error(
          'Error occurred while displaying snack bar message:',
          err
        );
      }
    );
  }

  
  // Function overload signatures
  public openSnackBar(props: SnackBarMessageProps): void;
  public openSnackBar(
    message: string,
    messageType?: snackbarMessageType,
    duration?: number,
    showIcon?: boolean,
    title?: string | null
  ): void;

  // can be called using @ViewChild(SnackBarMessagesComponent)
  public  openSnackBar(
    propsOrMessage: SnackBarMessageProps | string,
    messageType: snackbarMessageType = this.defaultMessageType,
    duration: number = 4,
    showIcon: boolean = true,
    title: string | null = null
  ) {
    let props: SnackBarMessageProps;

    if (typeof propsOrMessage === 'string') {
      //using second overload => propsOrMessage is the message string
      props = {
        messageContent: propsOrMessage,
        messageType: messageType,
        durationInSeconds: duration,
        showIcon: showIcon,
        title: title ?? undefined
      };
    } else {
      //using First overload => => propsOrMessage is the type SnackBarMessageProps
      props = propsOrMessage;
    }

    let validProps = this._getValidProps(props);
    this._snackBar.openFromComponent(ErrorMessagePrivateViewComponent, {
      duration: validProps.durationInSeconds * 1000, // seconds => milliseconds
      data: {
        message: validProps.messageContent,
        title: validProps.title,
        messageType: validProps.messageType,
        showIcon: validProps.showIcon,
      },
    });
  }

  private _getValidProps(
    props: SnackBarMessageProps
  ): requiredSnackBarMessageProps {
    let title = props.title;

    if (props.showIcon == false) {
      if (title == undefined) {
        switch (props.messageType) {
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

    return {
      messageContent: props.messageContent,
      durationInSeconds:
        props.durationInSeconds ?? this.defaultDisplayTimeInSeconds,
      showIcon: props.showIcon ?? this.defaultShowIcon,
      messageType: props.messageType ?? this.defaultMessageType,
      title: title ?? '',
    };
  }
}

export enum snackbarMessageType {
  Error = 'Error',
  Info = 'Info',
  Warning = 'Warning',
  Success = 'Success',
}

/**
 * An interface representing the properties for a snack bar message.
 */
export type SnackBarMessageProps = {
  /**
   * The main content or message to be displayed in the snack bar.
   */
  messageContent: string;

  /**
   * The type of the snack bar message.
   * Must be a value from the SnackbarMessageType enum.
   * If not provided, its set to `Error` by default.
   */
  messageType?: snackbarMessageType;

  /**
   * A boolean indicating whether to show an icon in the snack bar or not.
   * If not provided, its set to `True` by default.
   */
  showIcon?: boolean;

  /**
   * An optional title for the snack bar message.
   *
   * Scenarios:
   *   - If `showIcon` is true, the title will be replaced with an icon and no title will appear.
   *   - If `title` is undefined, it will be automatically set based on the `messageType`.
   *   - To remove both the title and icon, set `title` to an empty string or `null`, and set `showIcon` to false.
   */
  title?: string;

  /**
   * The duration (in seconds) for which the snack bar message should be displayed.
   *
   * If not provided, the default duration is 4 seconds.
   */
  durationInSeconds?: number;
};

type requiredSnackBarMessageProps = {
  messageContent: string;
  messageType: snackbarMessageType;
  showIcon: boolean;
  title: string;
  durationInSeconds: number;
};

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
