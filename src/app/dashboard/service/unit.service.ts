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
    let newInstanceDate = null;
    if (isString(date) && /T/g.test(date)) {
      const dtSplit = date.split('T');
      const daily = dtSplit[0];
      const hourly = dtSplit[1].split(':');
      let dtTemp = new Date(daily);
      dtTemp.setHours(parseInt(hourly[0], 10));
      dtTemp.setMinutes(parseInt(hourly[1], 10));
      newInstanceDate = new Date(Date.UTC(dtTemp.getFullYear(), dtTemp.getMonth(), dtTemp.getDate(), dtTemp.getHours(), dtTemp.getMinutes()));
    } else {
      newInstanceDate = new Date(date);
    }
    return this.getUserPref().timeFormat
      .replace(/Y/g, String(newInstanceDate.getFullYear()))
      .replace(/M/g, newInstanceDate.getMonth()+1 < 10 ? '0' + String(newInstanceDate.getMonth() + 1) : String(newInstanceDate.getMonth() + 1 ))
      .replace(/D/g, newInstanceDate.getDate() < 10 ? '0' + String(newInstanceDate.getDate()) : String(newInstanceDate.getDate()))
      .replace(/h/g, newInstanceDate.getHours() < 10 ? '0' + String(newInstanceDate.getHours()) : String(newInstanceDate.getHours()))
      .replace(/m/g, newInstanceDate.getMinutes() < 10 ?  '0' + String(newInstanceDate.getMinutes()) :  String(newInstanceDate.getMinutes()));
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
    } else {
      newInstanceDate = new Date(date);
    }
   return this.getUserPref().timeFormat.replace(/Y/g, String(newInstanceDate.getFullYear()))
      .replace(/M/g, newInstanceDate.getMonth()+1 < 10 ? '0' + String(newInstanceDate.getMonth() + 1) : String(newInstanceDate.getMonth() + 1 ))
      .replace(/D/g, newInstanceDate.getDate() < 10 ? '0' + String(newInstanceDate.getDate()) : String(newInstanceDate.getDate()))
      .replace(/h:m/g, '');
  }


  /**
 *
 *
 * @param {number} temp
 * @returns {number}
 * @memberof UserParamsService
 */
convertTempFromUsePref(temp: number, unit: string, round? : boolean): number {
  if (unit === 'IMPERIAL') {
    return  round ? this.getValRound(temp * 9 / 5 + 32): temp;
  } else {
    return   round ? this.getValRound(temp): temp;
  }
}

  /**
   *
   *
   * @returns {UserPref}
   * @memberof UnitService
   */
  getUserPref(): UserPref {
    return JSON.parse(window.sessionStorage.getItem('jwtReponse')).userPref;
  }

  /**
   *
   *
   * @param {Date} dateUtc
   * @returns {Date}
   * @memberof UnitService
   */
  getLocalDate(dateUtc: Date): Date {
    return new Date(Date.UTC(dateUtc.getFullYear(), dateUtc.getMonth(), dateUtc.getDate(), dateUtc.getHours(), dateUtc.getMinutes()));
  }

  /**
   *
   *
   * @param {number} weight
   * @returns {number}
   * @memberof UserParamsService
   */
  convertWeightFromuserPref(weight: number, unit: string, round?: boolean): number {
    if (unit === 'IMPERIAL') {
      return round? this.getValRound(weight * 2.2046): weight;
    } else {
      return round? this.getValRound(weight): weight;
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
    const tmp = Math.pow(10, 1);
    return Math.round(value * tmp) / tmp;
  }
}
