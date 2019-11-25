/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { JwtResponse } from './_model/jwt-response';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth/Service/auth.service';
import { Login } from './_model/login';
import { RucherModel } from './_model/rucher-model';
import { AtokenStorageService } from './auth/Service/atoken-storage.service';

@Injectable()
export class UserloggedService {

  private messageSource = new BehaviorSubject<string>('');
  currentMessage = this.messageSource.asObservable();

  private wizardActive: Boolean;

  constructor(private tokenService: AtokenStorageService) {
    this.wizardActive = false;
  }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }
  currentUser(): JwtResponse {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  /**
   *
   *
   * @returns {boolean}
   * @memberof UserloggedService
   */
  checkWriteObject(userId: string): boolean {
    return userId === this.getIdUserLoged() || this.tokenService.checkAuthorities('ROLE_ADMIN');
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
   * @param {string} country
   * @memberof UserloggedService
   */
  setCountry(country: string): void {
    let jwtResponse: JwtResponse = this.getJwtReponse();
    jwtResponse.country = country.toLocaleLowerCase();
    this.setJwtReponse(jwtResponse);
  }

  /**
   *
   *
   * @returns {RucherModelodel[]}
   * @memberof UserloggedService
   */
  getSharingApiaryId(): Array<string> {
    return JSON.parse(window.localStorage.getItem('sharingApiary')) || [];
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
   * @returns {string}
   * @memberof UserloggedService
   */
  getIdUserLoged(): string {
    return JSON.parse(window.localStorage.getItem('jwtReponse')).idUser;
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
