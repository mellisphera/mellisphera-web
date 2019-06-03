import { Injectable } from '@angular/core';
import { UserPref } from '../../_model/user-pref';
import { isObject } from 'rxjs/internal/util/isObject';
import { isString } from 'util';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor() { }


  /**
   *
   *
   * @param {string} date
   * @returns {string}
   * @memberof UnitService
   */
  getHourlyDate(date: string | Date): string {
    if (isString(date)) {  
      const dtSplit = date.split('T');
      const daily = dtSplit[0];
      const hourly = dtSplit[1].split(':');
      var newInstanceDate = new Date(daily);
      newInstanceDate.setHours(parseInt(hourly[0], 10));
      newInstanceDate.setMinutes(parseInt(hourly[1], 10));
    } else {
      var newInstanceDate = new Date(date);
    }

    return this.getUserPref().timeFormat
      .replace(/Y/g, String(newInstanceDate.getFullYear()))
      .replace(/M/g, String(newInstanceDate.getMonth() + 1))
      .replace(/D/g, String(newInstanceDate.getDate()))
      .replace(/h/g, String(newInstanceDate.getHours()))
      .replace(/m/g, String(newInstanceDate.getMinutes()));
  }

  /**
   *
   *
   * @param {Date} date
   * @returns {string}
   * @memberof UnitService
   */
  getDailyDate(date: string | Date): string {
    let newInstanceDate = null;
    if (isString(date)) {
      if (date.indexOf('T')) {
        newInstanceDate = new Date(date.split('T')[0]);
      }
    }
    newInstanceDate = new Date(date);
   return this.getUserPref().timeFormat.replace(/Y/g, String(newInstanceDate.getFullYear()))
      .replace(/M/g, String(newInstanceDate.getMonth() + 1))
      .replace(/D/g, String(newInstanceDate.getDate()))
      .replace(/h:m/g, '');
  }


  /**
 *
 *
 * @param {number} temp
 * @returns {number}
 * @memberof UserParamsService
 */
  convertTempFromUsePref(temp: number, unit: string): number {
    if (unit === 'IMPERIAL') {
      return this.getValRound(temp * 9 / 5 + 32);
    } else {
      return temp;
    }
  }

  getUserPref(): UserPref {
    return JSON.parse(window.sessionStorage.getItem('jwtReponse')).userPref;
  }

  getLocalDate(dateUtc: Date): Date {
    console.log(dateUtc);
    return new Date(Date.UTC(dateUtc.getFullYear(), dateUtc.getMonth(), dateUtc.getDate(), dateUtc.getHours(), dateUtc.getMinutes()));
  }

  /**
   *
   *
   * @param {number} weight
   * @returns {number}
   * @memberof UserParamsService
   */
  convertWeightFromuserPref(weight: number, unit: string): number {
    if (unit === 'IMPERIAL') {
      return this.getValRound(weight * 2.2046);
    } else {
      return weight;
    }
  }

  /**
   *
   *
   * @param {number} value
   * @returns {number}
   * @memberof UnitService
   */
  getValRound(value: number): number {
    const tmp = Math.pow(10, 2);
    return Math.round(value * tmp) / tmp;
  }
}
