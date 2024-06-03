import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, retry, catchError, timer } from 'rxjs';
import { SnackBarMessagesService } from '../services/util/snack-bar-messages.service';
import {
  SnackBarMessageProps,
  snackbarMessageType,
} from '../components/snack-bar-messages/snack-bar-messages.component';
import { extractErrorMessage } from '../shared/utilityFunctions';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  private defaultMaxRetries = 3; // Adjust the number of retries as per your requirement
  private defaultRetryDelay = 3000; // Delay between retries in milliseconds
  private displayErrorMessages: boolean = false;

  constructor(private snackBarMessagesService: SnackBarMessagesService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const maxRetries = request.headers.get('maxRetries') 
      ? parseInt(request.headers.get('maxRetries') ?? this.defaultMaxRetries.toString() , 10) 
      : this.defaultMaxRetries;
    const retryDelay = request.headers.get('retryDelay') 
      ? parseInt(request.headers.get('retryDelay') ?? this.defaultRetryDelay.toString(), 10) 
      :  this.defaultRetryDelay;
    const displayErrorMessages = request.headers.get('displayErrorMessages') != null ? request.headers.get('displayErrorMessages') === 'true' : this.displayErrorMessages;


    return next.handle(request).pipe(
      retry({
        count: maxRetries,
        delay: (error: HttpErrorResponse, retryCount: number) => {
          if (error.status === 0 || error.status > 500) {
            console.log(`Retrying request (${retryCount}/${maxRetries})`);
            const messageProps: SnackBarMessageProps = {
              messageContent: `Retrying (${retryCount}/${
                maxRetries
              }), ${extractErrorMessage(error)}`,
              durationInSeconds: 4,
              showIcon: true,
              messageType: snackbarMessageType.Error,
              title: 'Error ',
            };
            if (displayErrorMessages)
              this.snackBarMessagesService.displaySnackBarMessage(messageProps);

            // Server unreachable or server error, retry after a delay
            return timer(retryDelay);
          } else {
            // Other errors, don't retry
            return throwError(() => error);
          }
        },
      }),
      catchError((error: HttpErrorResponse) => {
        //same condition as above, only display retries errors for the Targeted errors
        if(!(error.status === 0 || error.status > 500))
          return throwError(() => error);
        // Handle any remaining errors after retries
        console.error(
          `HTTP request failed after ${maxRetries} retries:`,
          error
        );
        const messageProps: SnackBarMessageProps = {
          messageContent: `${extractErrorMessage(error).toString()}`,
          durationInSeconds: 4,
          showIcon: true,
          messageType: snackbarMessageType.Error,
          title: '',
        };
        if (displayErrorMessages)
          this.snackBarMessagesService.displaySnackBarMessage(messageProps);
        return throwError(() => error);
      })
    );
  }


  public static CreateInterceptorHeaders(
    maxRetries: number = 3,
    retryDelayInMs: number = 3000,
    displayErrorMessages: boolean = true
  ): HttpHeaders {
    return new HttpHeaders()
      .set('maxRetries', maxRetries.toString())
      .set('retryDelay', retryDelayInMs.toString())
      .set('displayErrorMessages', displayErrorMessages.toString());
  }
}

export const HttpInterceptorConfig = {
  provide: HTTP_INTERCEPTORS,
  useClass: RetryInterceptor,
  multi: true,
};


 