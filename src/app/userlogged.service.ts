import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable()
export class UserloggedService {

  private messageSource = new BehaviorSubject<string>('');
  currentMessage = this.messageSource.asObservable();


  constructor(private authService : AuthService) { }

   changeMessage(message : string){
     this.messageSource.next(message);
   }
   currentUser(){
     //sessionStorage.setItem("demo",'demo');
    return JSON.parse(sessionStorage.getItem('currentUser'));
    //return sessionStorage.getItem("currentUser") ? JSON.parse(sessionStorage.getItem('currentUser')) : null;
    //return this.authService.login;
  } 
  logOut(){
    return localStorage.removeItem('currentUser');
  }
}
