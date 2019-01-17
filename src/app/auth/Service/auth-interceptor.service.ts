import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AtokenStorageService } from './atoken-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  TOKEN_HEADER_KEY = 'Authorization';
  constructor(private tokenService : AtokenStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;
    //const token = this.tokenService.getToken();
    const token = this.tokenService.getToken();
    if (token != null) {
        if(req.url.indexOf("openweathermap")==-1){
          authReq = req.clone({ headers: req.headers.set(this.TOKEN_HEADER_KEY, 'Bearer ' + token) });
        }
    } 
    return next.handle(authReq);
  }
}