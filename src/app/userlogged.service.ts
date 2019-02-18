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
    if (!this.authService.isAuthenticated ){
      console.log('not login');
      this.setUser({
        'username' : 'fstl',
        'password' : 'fstl'
      });
    }
    return JSON.parse(sessionStorage.getItem('currentUser'));
  }

  setUser(user: Login) {
    window.sessionStorage.removeItem('currentUser');
    window.sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUser(): string {
    return JSON.parse(window.sessionStorage.getItem('currentUser')).username;
  }

  logOut(){
    return localStorage.removeItem('currentUser');
  }

  signOut() {
    window.sessionStorage.clear();
  }
}
