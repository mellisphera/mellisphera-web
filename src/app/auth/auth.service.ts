import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs";
import { Observable } from 'rxjs';
import { UsersService } from './users.service';

import { Login } from '../_model/login';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../config';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {


  login : Login;
  loginObs : Observable<any>;
  lastConnection : Date;
  isAuthenticated : boolean;
  connexionStatus : BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  errLogin : boolean;

  public showNavBarEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router, 
              private usersService: UsersService,
              private http : HttpClient) {
                this.login = { username : "", password : ""};
                this.errLogin = false;
                this.isAuthenticated = false;
              }

  signIn() {
    this.loginObs = this.http.post<any>(CONFIG.URL+'user/loguser',this.login,httpOptions);
    this.loginObs.subscribe(
      (data)=>{
        this.connexionStatus.next(data);
        this.isAuthenticated = typeof(data) == "string" ? true : false;
        sessionStorage.setItem("connexion",JSON.stringify(this.isAuthenticated));
        console.log(this.isAuthenticated);
        this.errLogin = !this.isAuthenticated;
        console.log(!this.isAuthenticated);
        if(this.isAuthenticated){
          this.lastConnection = new Date(data);
          console.log(sessionStorage.getItem("connexion") == "true"); 
          sessionStorage.setItem("currentUser",JSON.stringify(this.login));
          this.router.navigate(['/position-Ruche']);
        }
      },
      (err)=>{
        console.log(err);
      }
    );
  }

}
