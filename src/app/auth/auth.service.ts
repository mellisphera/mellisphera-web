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
  loginObs : Observable<boolean>;

  isAuthenticated : boolean;

  errLogin : boolean;

  public showNavBarEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  private authenticated = false;

  constructor(private router: Router, 
              private usersService: UsersService,
              private http : HttpClient) {
                this.login = { username : "", password : ""};
                this.isAuthenticated = false;
                this.errLogin = false;
              }

  signIn() {
    this.loginObs = this.http.post<boolean>(CONFIG.URL+'user/loguser',this.login,httpOptions);
    this.loginObs.subscribe(
      (data)=>{
        this.isAuthenticated = data;
        this.errLogin = !this.isAuthenticated;
        console.log(!this.isAuthenticated);
        if(this.isAuthenticated){
          console.log("ok");
          this.router.navigate(['/position-Ruche']);
        }
      },
      (err)=>{
        console.log(err);
      }
    );
  }

}
