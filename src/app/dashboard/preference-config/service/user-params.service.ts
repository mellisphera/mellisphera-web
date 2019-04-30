import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserParamsService {

  private dtFormat: Array<string>;
  private formatDate: string;
  private regexDate: RegExp;
  constructor() {
    this.dtFormat = [
      'Y-M-D h:m',
      'D-M-Y h:m',
      'D/M/D h:m'

    ];
    this.setFormatDate(this.dtFormat[0]);
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

  /**
   *
   *
   * @returns {string}
   * @memberof UserService
   */
  getFormatDate(date: Date): string {
    const newInstanceDate = new Date(date);
    return this.formatDate.replace(/Y/g, String(newInstanceDate.getFullYear()))
    .replace(/M/g, String(newInstanceDate.getMonth()))
    .replace(/D/g, String(newInstanceDate.getDate()))
    .replace(/h/g, String(newInstanceDate.getHours()))
    .replace(/m/g, String(newInstanceDate.getMinutes()));
  }
  getFormatCalendar(date: Date): string {
    const newInstanceDate = new Date(date);
    return this.formatDate.replace(/Y/g, String(newInstanceDate.getFullYear()))
    .replace(/M/g, String(newInstanceDate.getMonth()))
    .replace(/D/g, String(newInstanceDate.getDate()))
    .replace(/h:m/g, '');
  }
}
