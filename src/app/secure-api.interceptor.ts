import { HttpHandlerFn, HttpRequest, HttpInterceptorFn } from '@angular/common/http';
import { getCookie } from './getCookie';

export function secureApiInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const secureRoutes = [getApiUrl()];

  if (secureRoutes.some(route => request.url.startsWith(route))) {
    const xsrfToken = getCookie('XSRF-RequestToken');
    if (xsrfToken) {
      request = request.clone({
        headers: request.headers.set('X-XSRF-TOKEN', xsrfToken)
      });
    }
  }

  return next(request);
}

function getApiUrl(): string {
  return `${getCurrentHost()}/api/`;
}

function getCurrentHost(): string {
  const host = window.location.host;
  return `${window.location.protocol}//${host}`;
}
