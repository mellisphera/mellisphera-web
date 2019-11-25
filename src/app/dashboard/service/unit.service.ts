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
import { UserPref } from '../../_model/user-pref';
import { isObject } from 'rxjs/internal/util/isObject';
import { isString } from 'util';
import { formatDate } from '@angular/common';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class 
UnitService {

  constructor() { }


  /**
   *
   *
   * @param {string} date
   * @returns {string}
   * @memberof UnitService
   */
  getHourlyDate(date: string | Date): string {
    return moment(date).format(this.getUserPref().timeFormat);
  }

  /**
   *
   *
   * @param {Date} date
   * @returns {string}
   * @memberof UnitService
   */
  getDailyDate(date: string | Date): string {
    return moment(date).format(this.getUserPref().timeFormat.split(' ')[0]);
  }


  /**
 *
 *
 * @param {number} temp
 * @returns {number}
 * @memberof UserParamsService
 */
convertTempFromUsePref(temp: number, unit: string, round?: boolean): number {
  let value;
  if (unit === 'IMPERIAL') {
    value = round ? this.getValRound(temp * 9 / 5 + 32): temp * 9 / 5 + 32;
  } else {
    value =  round ? this.getValRound(temp): temp;
  }
  return value;
}

convertWindFromUserPref(wind: number, unit: string, round?: boolean): number {
  let value;
  if (unit === 'IMPERIAL') {
    value = round ? this.getValRound(wind * 2.276) : wind * 2,276;
  } else {
    value =  round ? this.getValRound(wind * 3.6) : wind * 3.6;
  }
  return value;
}

  /**
   *
   *
   * @returns {UserPref}
   * @memberof UnitService
   */
  getUserPref(): UserPref {
    return JSON.parse(window.localStorage.getItem('jwtReponse')).userPref;
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
    let value;
    if (unit === 'IMPERIAL') {
      value = round? this.getValRound(weight * 2.2046): weight * 2.046;
    } else {
      value = round? this.getValRound(weight): weight;
    }
    return value
  }

  convertMilimetreToPouce(rain: number, unit: string, round?: boolean): number {
    let value;
    if (unit === 'IMPERIAL') {
      value = rain / 25.4;
    } else {
      value = rain;
    }
    return value
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
