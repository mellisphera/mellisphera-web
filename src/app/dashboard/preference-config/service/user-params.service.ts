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
      unitSystem: ''
    });
    this.dtFormat = [
      'Y-M-D h:m',
      'D-M-Y h:m',
      'D/M/Y h:m'

    ];
    this.userPref = this.getUserPref() ? this.getUserPref() : null;
    console.log(this.userPref);
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
    return JSON.parse(window.sessionStorage.getItem('jwtReponse')).userPref;
  }

  /**
   *
   *
   * @returns {string}
   * @memberof UserParamsService
   */
  getUsername(): string {
    return JSON.parse(window.sessionStorage.getItem('jwtReponse')).username;
  }

  getIdUser() {
    return JSON.parse(window.sessionStorage.getItem('jwtReponse')).idUser;
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
