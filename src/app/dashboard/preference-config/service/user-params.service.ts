import { Injectable } from '@angular/core';
import { UserPref } from '../../../_model/user-pref';

@Injectable({
  providedIn: 'root'
})
export class UserParamsService {

  public dtFormat: Array<string>;
  private formatDate: string;
  private regexDate: RegExp;
  constructor() {
    this.dtFormat = [
      'Y-M-D h:m',
      'D-M-Y h:m',
      'D/M/Y h:m'

    ];
    this.formatDate = this.getUserPref() ?  this.getUserPref().timeFormat : this.dtFormat[0] ;
  }
  /**
   *
   *
   * @param {string} datePipe
   * @memberof UserService
   */
  setFormatDate(dtFormat: string): void {
    this.formatDate = dtFormat;
  }

  getUserPref(): UserPref {
    return JSON.parse(window.sessionStorage.getItem('jwtReponse')).userPref;
  }

  /**
   *
   *
   * @returns {string}
   * @memberof UserService
   */
  getFormatDate(date: Date): string {
    const newInstanceDate = new Date(date);
    return this.formatDate.replace(/Y/g, String(newInstanceDate.getFullYear()))
    .replace(/M/g, String(newInstanceDate.getMonth() + 1))
    .replace(/D/g, String(newInstanceDate.getDate()))
    .replace(/h/g, String(newInstanceDate.getHours()))
    .replace(/m/g, String(newInstanceDate.getMinutes()));
  }
  getFormatCalendar(date: Date): string {
    const newInstanceDate = new Date(date);
    return this.formatDate.replace(/Y/g, String(newInstanceDate.getFullYear()))
    .replace(/M/g, String(newInstanceDate.getMonth() + 1))
    .replace(/D/g, String(newInstanceDate.getDate()))
    .replace(/h:m/g, '');
  }

}
