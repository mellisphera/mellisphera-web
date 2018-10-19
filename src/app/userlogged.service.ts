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
    //return JSON.parse(localStorage.getItem('currentUser'));
    return this.authService.login;
  } 
  logOut(){
    return localStorage.removeItem('currentUser');
  }
}
