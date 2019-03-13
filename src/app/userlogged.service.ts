import { JwtResponse } from './_model/jwt-response';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth/Service/auth.service';
import { Login } from './_model/login';

@Injectable()
export class UserloggedService {

  private messageSource = new BehaviorSubject<string>('');
  currentMessage = this.messageSource.asObservable();

  private wizardActive: Boolean;

  constructor() {
    this.wizardActive = false;
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

  setConnexion(nbConnection: number) {
    window.sessionStorage.setItem('connexions', '' + nbConnection);
  }


  getWizardActive() {
    return this.wizardActive;
  }
  setWizardActive() {
    this.wizardActive = !this.wizardActive;
  }
  getUser() {
    try {
      return JSON.parse(window.sessionStorage.getItem('currentUser')).username.toLowerCase();
    } catch (e) {
      return false;
    }
  }

  getConnexion() {
    try {
      return JSON.parse(window.sessionStorage.getItem('connexions'));
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
