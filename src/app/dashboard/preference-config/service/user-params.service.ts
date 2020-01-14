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
import { UserPref } from '../../../_model/user-pref';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../../../constants/config';
import { UserloggedService } from '../../../userlogged.service';
import { BehaviorSubject, Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class UserParamsService {

  public dtFormat: Array<string>;
  private formatDate: string;
  private userPref: UserPref;
  private regexDate: RegExp;
  private prefSubject: BehaviorSubject<UserPref>;
  constructor(private httpClient: HttpClient, ) {
    this.prefSubject = new BehaviorSubject({
      timeZone: '',
      timeFormat: '',
      lang: '',
      unitSystem: '',
      availableSource: [],
      weatherSource: '',
      weatherStation : false
    });
    this.dtFormat = [
      'YYYY-MM-DD HH:mm',
      'DD-MM-YYYY HH:mm',
      'DD/MM/YYYY HH:mm',
      'MM/DD/YYYY HH:mm'
    ];
    this.initService();

  }

  initService(): void {
    this.userPref = this.getUserPref() ? this.getUserPref() : null;
    this.prefSubject.next(this.userPref);
    this.formatDate = this.getUserPref() ?  this.getUserPref().timeFormat : this.dtFormat[0];
  }
  setFormatDt(indexFormat: number): void {
    this.userPref.timeFormat = this.dtFormat[indexFormat];
  
  }
  public getSubject(): BehaviorSubject<UserPref> {
    return this.prefSubject;
  }

  /**
   *
   *
   * @param {string} unit
   * @memberof UserParamsService
   */
  setUnit(unit: string): void  {
    this.userPref.unitSystem = unit;
  }

  setLang(lang: string): void  {
    this.userPref.lang = lang.toLowerCase();
  }

  setWeatherSource(weatherSrc: string): void {
    this.userPref.weatherSource = weatherSrc;
  }
  /**
   *
   *
   * @memberof UserParamsService
   */
  emitPrefSubject(): void {
    this.prefSubject.next(this.userPref);
  }
  /**
   *
   *
   * @param {string} datePipe
   * @memberof UserService
   */
  setUserPref(): Observable<UserPref> {
    return this.httpClient.put<UserPref>(CONFIG.URL + 'userPref/update/' + this.getUsername(), this.userPref, httpOptions);
  }


  updatePassword(password: string): Observable<String> {
    return this.httpClient.put<String>(CONFIG.URL + 'userPref/updatePassword/' + this.getIdUser(), password, httpOptions);
  }
  /**
   *
   *
   * @returns {UserPref}
   * @memberof UserParamsService
   */
  getUserPref(): UserPref {
    return JSON.parse(window.localStorage.getItem('jwtReponse')).userPref;
  }

  /**
   *
   *
   * @returns {string}
   * @memberof UserParamsService
   */
  getUsername(): string {
    return JSON.parse(window.localStorage.getItem('jwtReponse')).username;
  }

  getIdUser() {
    return JSON.parse(window.localStorage.getItem('jwtReponse')).idUser;
  }


  /**
   *
   *
   * @param {number} temp
   * @returns {number}
   * @memberof UserParamsService
   */
  convertTempFromUsePref(temp: number): number {
    if (this.userPref.unitSystem === 'IMPERIAL') {
      return temp * 9 / 5 + 32;
    } else {
      return temp;
    }
  }

  /**
   *
   *
   * @param {number} weight
   * @returns {number}
   * @memberof UserParamsService
   */
  convertWeightFromuserPref(weight: number): number {
    if (this.userPref.unitSystem === 'IMPERIAL') {
      return weight * 2.2046;
    } else {
      return weight;
    }
  }

}
