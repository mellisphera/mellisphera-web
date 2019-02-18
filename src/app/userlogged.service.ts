import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth/Service/auth.service';
import { Login } from './_model/login';

@Injectable()
export class UserloggedService {

  private messageSource = new BehaviorSubject<string>('');
  currentMessage = this.messageSource.asObservable();

  loginDemo : Login;

  constructor(private authService : AuthService) {
   }

   changeMessage(message : string){
     this.messageSource.next(message);
   }
   currentUser(): Login {
    return JSON.parse(sessionStorage.getItem('currentUser'));
  }

  setUser(user: Login) {
    window.sessionStorage.removeItem('currentUser');
    window.sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUser() {
    try {
      return JSON.parse(window.sessionStorage.getItem('currentUser')).username;
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
