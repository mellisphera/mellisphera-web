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
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  setJwtReponse(auth: JwtResponse) {
    window.localStorage.removeItem('jwtReponse');
    window.localStorage.setItem('jwtReponse', JSON.stringify(auth));
  }

  getJwtReponse(): JwtResponse {
    return JSON.parse(window.localStorage.getItem('jwtReponse'));
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
      return JSON.parse(window.localStorage.getItem('jwtReponse')).username.toLowerCase();
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
  getCountry(): string {
    try {
      return JSON.parse(window.localStorage.getItem('jwtReponse')).country;
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
      return JSON.parse(window.localStorage.getItem('jwtReponse')).connexions;
    } catch (e) {
      return NaN;
    }
  }

  signOut(): void {
    window.localStorage.clear();
  }
}
