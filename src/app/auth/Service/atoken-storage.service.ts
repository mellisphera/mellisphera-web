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

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { CONFIG } from '../../../constants/config';
import { RequestOptions } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class AtokenStorageService {

  //TOKEN_KEY
  private roles: Array<string> = [];

  constructor(private httpClient : HttpClient) { }

  /**
   *
   *
   * @returns {string}
   * @memberof AtokenStorageService
   */
  getToken(): string {
    return window.localStorage.getItem('TOKEN_KEY');
  }

  /**
   *
   *
   * @param {string} token
   * @memberof AtokenStorageService
   */
  saveToken(token: string): void {
    window.localStorage.removeItem('TOKEN_KEY');
    window.localStorage.setItem('TOKEN_KEY', token);
  }

  /**
   *
   *
   * @param {string[]} authorities
   * @memberof AtokenStorageService
   */
  public saveAuthorities(authorities: string[]) {
    window.localStorage.removeItem('AUTHORITIES_KEY');
    window.localStorage.setItem('AUTHORITIES_KEY', JSON.stringify(authorities));
    this.getAuthorities();
  }

  /**
   *
   *
   * @returns {string[]}
   * @memberof AtokenStorageService
   */
  public getAuthorities(): string[] {
    this.roles = [];
    if (localStorage.getItem('TOKEN_KEY')) {
      JSON.parse(localStorage.getItem('AUTHORITIES_KEY')).forEach(auth => {
        this.roles.push(auth.authority);
      });
    }
 
    return this.roles;
  }

  /**
   *
   *
   * @memberof AtokenStorageService
   */
  signOut(): void {
    window.localStorage.clear();
  }

  /**
   *
   *
   * @returns {boolean}
   * @memberof AtokenStorageService
   */
  getAdmin(): boolean{
    return this.roles.indexOf('ROLE_ADMIN') !== -1;
  }

  /**
   *
   *
   * @param {string} role
   * @returns {Boolean}
   * @memberof AtokenStorageService
   */
  checkAuthorities(role: string): boolean{
    return this.getAuthorities().indexOf(role) !== -1 ? true : false;
  }

}
