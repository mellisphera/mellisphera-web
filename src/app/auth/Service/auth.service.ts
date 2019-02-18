import { UserloggedService } from './../../userlogged.service';
  import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs";
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


  login : Login;
  user : User;
  jwtReponse : JwtResponse;
  loginObs : Observable<any>;
  lastConnection : Date;
  isAuthenticated : boolean;
  connexionStatus : BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  errLogin : boolean;

  public showNavBarEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router,
              private http : HttpClient,
              private tokenService : AtokenStorageService) {
                this.login = { username : "", password : ""};
                this.errLogin = false;
                this.isAuthenticated = false;
              }

  signIn() {
    this.loginObs = this.http.post<JwtResponse>(CONFIG.URL+'api/auth/signin',this.login,httpOptions);
    this.loginObs.subscribe(
      (data)=>{
        this.jwtReponse = data;
        this.tokenService.saveToken(this.jwtReponse.accessToken);
        this.tokenService.saveAuthorities(this.jwtReponse.authorities);
        this.login.username = this.jwtReponse.username;
        this.connexionStatus.next(data);
        this.isAuthenticated = this.tokenService.getToken() ? true : false;
        this.errLogin = !this.isAuthenticated;
        this.setUser(this.login);
        this.router.navigate(['/home']);
      },
      (err)=>{
        this.errLogin = true;
        console.log(err);
      }
    );
  }
  setUser(user: Login) {
    window.sessionStorage.removeItem('currentUser');
    window.sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

}

        /*

        ### AVEC TOKEN ###
        this.jwtReponse = data;
        this.tokenService.saveToken(this.jwtReponse.accessToken);
        this.tokenService.saveAuthorities(this.jwtReponse.authorities);
        this.login.username = this.jwtReponse.username  
        this.connexionStatus.next(data);
        this.isAuthenticated = window.sessionStorage.getItem("TOKEN_KEY") ? true : false;
        sessionStorage.setItem("connexion",JSON.stringify(this.isAuthenticated));
        this.errLogin = !this.isAuthenticated;
        if(this.isAuthenticated){
          this.lastConnection = new Date(data);
          console.log(sessionStorage.getItem("connexion") == "true"); 
          
          sessionStorage.setItem("currentUser",JSON.stringify(this.login));
          this.router.navigate(['/position-Ruche']);
        }
        
        
        
        
        
        
        
        ### SANS TOKEN ###

        console.log(data);
        this.user = data;
        //this.login = this.user.login;
        console.log(this.user);
        this.connexionStatus.next(data);
        this.isAuthenticated = this.user.id != null? true : false;
        sessionStorage.setItem("connexion",JSON.stringify(this.isAuthenticated));
        console.log(this.isAuthenticated);
        this.errLogin = !this.isAuthenticated;
        console.log(!this.isAuthenticated);
        if(this.isAuthenticated){
          this.lastConnection = new Date(data);
          console.log(sessionStorage.getItem("connexion") == "true"); 
          
          sessionStorage.setItem("currentUser",JSON.stringify(this.user.login));
          this.router.navigate(['/position-Ruche']);
        
        
        
        
        */


        