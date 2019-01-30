import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AtokenStorageService } from './atoken-storage.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  TOKEN_HEADER_KEY = 'Authorization';
  constructor(private tokenService : AtokenStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>>{
    let authReq = req.clone({
      setHeaders : {
        Authorization : `Bearer ${this.tokenService.getToken()}`
      }
    });
    console.log(authReq);
    return next.handle(authReq);
  }

}

//authReq = req.clone({ headers: req.headers.set(this.TOKEN_HEADER_KEY, 'token ' + token), withCredentials : true});