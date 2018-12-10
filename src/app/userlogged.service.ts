import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Login } from './_model/login';

@Injectable()
export class UserloggedService {

  private messageSource = new BehaviorSubject<string>('');
  currentMessage = this.messageSource.asObservable();

  loginDemo : Login;

  constructor(private authService : AuthService) {
    this.loginDemo = {
      username : "demo",
      password : 'demo'
    }
   }

   changeMessage(message : string){
     this.messageSource.next(message);
   }
   currentUser(){
     if(sessionStorage.getItem("currentUser")){
      return JSON.parse(sessionStorage.getItem('currentUser'));
     }
     else{
      sessionStorage.setItem("currentUser",JSON.stringify(this.loginDemo));
      return sessionStorage.getItem("currentUser");
     }
     
  } 
  logOut(){
    return localStorage.removeItem('currentUser');
  }
}
