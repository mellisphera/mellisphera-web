/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { UserloggedService } from './../../userlogged.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AtokenStorageService } from './atoken-storage.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoadingService } from '../../dashboard/service/loading.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  TOKEN_HEADER_KEY = 'Authorization';
  constructor(private tokenService: AtokenStorageService, 
    private router: Router,
    private loadingService: LoadingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.tokenService.getToken()}`
      }
    });

    if (req.url.indexOf('slack') !== -1) {
      return next.handle(req);
    } else {
      return next.handle(authReq)
      .pipe(
        catchError( (error: HttpErrorResponse) => {
          console.log(error);
           let errMsg: any;
           // Client Side Error
           if (error.error instanceof ErrorEvent) {        
             errMsg = `Error: ${error.error.message}`;
           }
           else if (error.error.message) {
             errMsg = {'error_code': error.status,  'message' : error.error.message};
           }
           else {  // Server Side Error
             errMsg = `error_code: ${error.status},  Message: ${error.message}`;
           }
           if (error.status === 401) {
             this.loadingService.loading = false;
             this.router.navigateByUrl('login');
           }
           return throwError(errMsg);
         })
      )

    }
  }

}

//authReq = req.clone({ headers: req.headers.set(this.TOKEN_HEADER_KEY, 'token ' + token), withCredentials : true});