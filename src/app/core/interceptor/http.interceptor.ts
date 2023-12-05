import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_STRING } from 'src/app/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class CoreInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<string>,
    next: HttpHandler
  ): Observable<HttpEvent<string>> {
    return next.handle(
      req.clone({
        url: `${API_STRING}/${req.url}`
      })
    );
  }
}
