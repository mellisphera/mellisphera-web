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

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

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
              private userService: UserloggedService,
              private translateService: TranslateService) {
                this.login = { email : '', password : ''};
                this.errLogin = false;
                this.isAuthenticated = false;
              }

  signIn() {
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
         if (this.jwtReponse.country === null || this.jwtReponse.country === 'US') {
           this.translateService.use('en');
        } else if (this.jwtReponse.country === 'FR') {
          this.translateService.use('fr');
        }
        console.log(this.jwtReponse);
        if (this.jwtReponse.connexions === 1) {
          this.userService.setWizardActive(true);
        }
        console.log(this.tokenService.getAuthorities());
        if (this.tokenService.checkAuthorities('ROLE_ADMIN')) {
            this.router.navigateByUrl('dashboard/admin');

        } else {
          this.router.navigateByUrl('dashboard/home');

        }
      },
      (err) => {
        this.errLogin = true;
        console.log(err);
        // this.bmService.checkBmUser(this.login.email, this.login.password);
      }
    );
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post<any>(CONFIG.URL + 'api/auth/reset', email, httpOptions);
  }

}
