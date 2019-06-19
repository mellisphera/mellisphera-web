import { JwtResponse } from './_model/jwt-response';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth/Service/auth.service';
import { Login } from './_model/login';
import { RucherModel } from './_model/rucher-model';

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

  /**
   *
   *
   * @returns {boolean}
   * @memberof UserloggedService
   */
  checkWriteObject(idUsername: string): boolean {
    return idUsername === this.getIdUserLoged();
  }
  setJwtReponse(auth: JwtResponse) {
    window.sessionStorage.removeItem('jwtReponse');
    window.sessionStorage.setItem('jwtReponse', JSON.stringify(auth));
  }

  getJwtReponse(): JwtResponse {
    return JSON.parse(window.sessionStorage.getItem('jwtReponse'));
  }

  /**
   *
   *
   * @returns {RucherModelodel[]}
   * @memberof UserloggedService
   */
  getSharingApiaryId(): Array<string> {
    return JSON.parse(window.sessionStorage.getItem('sharingApiary'));
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
      return JSON.parse(window.sessionStorage.getItem('jwtReponse')).username.toLowerCase();
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
      return JSON.parse(window.sessionStorage.getItem('jwtReponse')).country;
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
  getIdUserLoged(): string {
    return JSON.parse(window.sessionStorage.getItem('jwtReponse')).idUser;
  }
  /**
   *
   *
   * @returns {number}
   * @memberof UserloggedService
   */
  getConnexion(): number {
    try {
      return JSON.parse(window.sessionStorage.getItem('jwtReponse')).connexions;
    } catch (e) {
      return NaN;
    }
  }

  signOut(): void {
    window.sessionStorage.clear();
  }
}
