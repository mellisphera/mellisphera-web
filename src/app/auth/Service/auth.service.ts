  import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs";
import { Observable } from 'rxjs';

import { Login } from '../../_model/login';
import { User } from '../../_model/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../../config';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {


  login : Login;
  user : User;
  loginObs : Observable<any>;
  lastConnection : Date;
  isAuthenticated : boolean;
  connexionStatus : BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  errLogin : boolean;

  public showNavBarEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router,
              private http : HttpClient) {
                this.login = { username : "", password : ""};
                this.user = { 
                  id : null,
                  createdAt : new Date(),
                  login : this.login,
                  phone : null,
                  email : null,
                  connexions : null,
                  lastConnection : null,
                  fullName : null,
                  position : null,
                  country : null,
                  city : null,
                  levelUser : null, 
              }
                this.errLogin = false;
                this.isAuthenticated = false;
              }

  signIn() {
    this.loginObs = this.http.post<any>(CONFIG.URL+'user/loguser',this.login,httpOptions);
    this.loginObs.subscribe(
      (data)=>{
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
        }
      },
      (err)=>{
        console.log(err);
      }
    );
  }

}
