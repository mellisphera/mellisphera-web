import { UserloggedService } from './../../userlogged.service';
  import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

import { Login } from '../../_model/login';
import { User } from '../../_model/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { AtokenStorageService } from './atoken-storage.service';
import { JwtResponse } from '../../_model/jwt-response';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {


  login: Login;
  user: User;
  jwtReponse : JwtResponse;
  loginObs : Observable<any>;
  lastConnection : Date;
  isAuthenticated : boolean;
  connexionStatus : BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  errLogin : boolean;

  public showNavBarEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router,
              private http : HttpClient,
              private tokenService : AtokenStorageService,
              private userService: UserloggedService) {
                this.login = { email : '', password : ''};
                this.errLogin = false;
                this.isAuthenticated = false;
              }

  signIn() {
    this.loginObs = this.http.post<JwtResponse>(CONFIG.URL+'api/auth/signin', this.login, httpOptions);
    this.loginObs.subscribe(
      (data) => {
        this.jwtReponse = data;
        this.tokenService.saveToken(this.jwtReponse.accessToken);
        this.tokenService.saveAuthorities(this.jwtReponse.authorities);
        this.login.email = this.jwtReponse.email;
        this.connexionStatus.next(data);
        this.isAuthenticated = this.tokenService.getToken() ? true : false;
        this.errLogin = !this.isAuthenticated;
        this.userService.setConnexion(this.jwtReponse.connexions);
        console.log(this.jwtReponse);
        if (this.jwtReponse.connexions === 1) {
          this.userService.setWizardActive();
        }
        this.userService.setUser(this.jwtReponse);
        this.router.navigate(['/home']);
      },
      (err) => {
        this.errLogin = true;
        console.log(err);
      }
    );
  }

}
