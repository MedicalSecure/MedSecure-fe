import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError, retry, catchError, timer } from 'rxjs';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  private maxRetries = 3; // Adjust the number of retries as per your requirement
  private retryDelay = 1000; // Delay between retries in milliseconds

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry({
        count: this.maxRetries,
        delay: (error: HttpErrorResponse, retryCount: number) => {
          console.log(`Retrying request (${retryCount}/${this.maxRetries})`);
          if (error.status === 0 || error.status >= 500) {
            // Server unreachable or server error, retry after a delay
            return timer(this.retryDelay);
          } else {
            // Other errors, don't retry
            return throwError(()=>error);
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle any remaining errors after retries
        console.error(`HTTP request failed after ${this.maxRetries} retries:`, error);
        return throwError(()=>error);
      })
    );
  }
}

export const HttpInterceptorConfig = {
    provide: HTTP_INTERCEPTORS,
    useClass: RetryInterceptor,
    multi: true
}