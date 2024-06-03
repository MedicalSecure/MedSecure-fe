import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  SnackBarMessageProps,
  snackbarMessageType,
} from '../../components/snack-bar-messages/snack-bar-messages.component';

@Injectable({
  providedIn: 'root',
})
export class SnackBarMessagesService {
  /**
   * A private Subject that emits SnackBarMessageProps objects.
   * @private
   */
  private snackBarMessagesSubject = new Subject<SnackBarMessageProps>();

  /**
   * An observable that can be subscribed to, to receive SnackBarMessageProps objects.
   * This observable is created from the snackBarMessagesSubject using the asObservable() method.
   */
  snackBarMessages$ = this.snackBarMessagesSubject.asObservable();

  // Function overload signatures
  public displaySnackBarMessage(props: SnackBarMessageProps): void;
  public displaySnackBarMessage(
    message: string,
    messageType?: snackbarMessageType,
    duration?: number,
    showIcon?: boolean,
    title?: string | null
  ): void;

  /**
   * Emits a new SnackBarMessageProps object to the snackBarMessagesSubject.
   * This method should be called when you want to display a new snack bar message.
   *
   * @param props - An object containing the properties for the snack bar message.
   */
  // can be called using @ViewChild(SnackBarMessagesComponent)
  public displaySnackBarMessage(
    propsOrMessage: SnackBarMessageProps | string,
    messageType?: snackbarMessageType,
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
        title: title ?? undefined,
      };
    } else {
      //using First overload => => propsOrMessage is the type SnackBarMessageProps
      props = propsOrMessage;
    }
    this.snackBarMessagesSubject.next(props);
  }
}
