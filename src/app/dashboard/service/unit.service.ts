import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor() { }


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

  getValRound(value: number): number{
    const tmp = Math.pow(10, 3);
    return Math.round( value * tmp ) / tmp;
  }
}
