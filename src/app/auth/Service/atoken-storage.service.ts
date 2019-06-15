import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { CONFIG } from '../../../config';
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
  checkAuthorities(role: string): Boolean{
    return this.getAuthorities().indexOf(role) !== -1 ? true : false;
  }

}
