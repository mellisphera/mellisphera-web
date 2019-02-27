import { JwtResponse } from './_model/jwt-response';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth/Service/auth.service';
import { Login } from './_model/login';

@Injectable()
export class UserloggedService {

  private messageSource = new BehaviorSubject<string>('');
  currentMessage = this.messageSource.asObservable();


  constructor(private authService : AuthService) {
   }

   changeMessage(message: string) {
     this.messageSource.next(message);
   }
   currentUser(): JwtResponse {
    return JSON.parse(sessionStorage.getItem('currentUser'));
  }

  setUser(user: JwtResponse) {
    window.sessionStorage.removeItem('currentUser');
    window.sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUser() {
    try {
      return JSON.parse(window.sessionStorage.getItem('currentUser')).username.toLowerCase();
    } catch (e) {
      return false;
    }
  }

  logOut(){
    return localStorage.removeItem('currentUser');
  }

  signOut() {
    window.sessionStorage.clear();
  }
}
