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

  setUser(user: JwtResponse): void {
    window.sessionStorage.removeItem('currentUser');
    window.sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  setConnexion(nbConnection: number) {
    window.sessionStorage.setItem('connexions', '' + nbConnection);
  }

  setCountry(country: string): void{
    window.sessionStorage.removeItem('country');
    window.sessionStorage.setItem('country', JSON.stringify(country));
  }

  /**
   *
   *
   * @returns {Boolean}
   * @memberof UserloggedService
   */
  getWizardActive(): Boolean {
    return this.wizardActive;
  }
  setWizardActive(status: boolean): void {
    this.wizardActive = status;
  }
  /**
   *
   *
   * @returns {string}
   * @memberof UserloggedService
   */
  getUser(): string {
    try {
      return JSON.parse(window.sessionStorage.getItem('currentUser')).username.toLowerCase();
    } catch (e) {
      return '';
    }
  }
  /**
   *
   *
   * @returns {string}
   * @memberof UserloggedService
   */
  getCountry(): string{
    try {
      return JSON.parse(window.sessionStorage.getItem('country'));
    } catch (e) {
      return '';
    }
  }
  /**
   *
   *
   * @returns {number}
   * @memberof UserloggedService
   */
  getConnexion(): number {
    try {
      return JSON.parse(window.sessionStorage.getItem('connexions'));
    } catch (e) {
      return NaN;
    }
  }

  signOut(): void {
    window.sessionStorage.clear();
  }
}
