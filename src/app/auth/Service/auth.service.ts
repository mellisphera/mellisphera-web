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
  import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

import { Login } from '../../_model/login';
import { User } from '../../_model/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../../constants/config';
import { AtokenStorageService } from './atoken-storage.service';
import { JwtResponse } from '../../_model/jwt-response';
import { TranslateService } from '@ngx-translate/core';
import { SocketService } from '../../dashboard/service/socket.service';



@Injectable()
export class AuthService {


  login: Login;
  user: User;
  public jwtReponse: JwtResponse;
  loginObs: Observable<any>;
  lastConnection: Date;
  isAuthenticated: boolean;
  connexionStatus: BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  errLogin: boolean;

  public showNavBarEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router,
              private http: HttpClient,
              private tokenService: AtokenStorageService,
              private socketService: SocketService,
              private userService: UserloggedService,
              private translateService: TranslateService) {
                this.login = { email : '', password : ''};
                this.errLogin = false;
                this.isAuthenticated = false;
              }

  signIn(origin: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'originURL': origin});
    const httpOptions = { headers: headers };
    this.login.email = this.login.email.toLowerCase();
    this.loginObs = this.http.post<JwtResponse>(CONFIG.URL + 'api/auth/signin', this.login, httpOptions);
    this.loginObs.subscribe(
      (data) => {
        this.jwtReponse = data;
        this.tokenService.saveToken(this.jwtReponse.accessToken);
        this.tokenService.saveAuthorities(this.jwtReponse.authorities);
        this.userService.setJwtReponse(this.jwtReponse);
        this.login.email = this.jwtReponse.email;
        this.connexionStatus.next(data);
        this.isAuthenticated = this.tokenService.getToken() ? true : false;
        this.errLogin = !this.isAuthenticated;
        this.translateService.addLangs(['en', 'fr']);
        this.socketService.loadDataRequest(this.userService.getJwtReponse());

         if (this.jwtReponse.lang === null || this.jwtReponse.lang.toLowerCase().indexOf('en') !== -1) {
           this.translateService.use('en');
        } else if (this.jwtReponse.lang.toLowerCase().indexOf('fr') === -1) {
          this.translateService.use('fr');
        }
        if (this.jwtReponse.connexions === 1) {
          this.userService.setWizardActive(true);
        }
        if (this.tokenService.checkAuthorities('ROLE_ADMIN')) {
            this.router.navigateByUrl('dashboard/admin');

        } else {
          this.router.navigateByUrl('dashboard/home/info-apiary');

        }
      },
      (err) => {
        this.errLogin = true;
        console.log(err);
        // this.bmService.checkBmUser(this.login.email, this.login.password);
      }
    );
  }

/*   resetPassword(email: string): Observable<any> {
    return this.http.post<any>(CONFIG.URL + 'api/auth/reset', email, httpOptions);
  } */

}
