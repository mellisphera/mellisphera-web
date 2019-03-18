import { Injectable } from '@angular/core';
import { RucheInterface } from '../../../_model/ruche';
import { DeprecatedDatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StackService {

  private arrayHiveSelect: Array<RucheInterface>;
  constructor() {
    this.arrayHiveSelect = [];
  }
  /**
   *
   *
   * @param {RucheInterface} hive
   * @memberof StackService
   */
  addHive(hive: RucheInterface) {
    this.arrayHiveSelect.push(hive);
  }

  /**
   *
   *
   * @param {RucheInterface} hive
   * @memberof StackService
   */
  removeHive(hive: RucheInterface) {
    const index = this.arrayHiveSelect.indexOf(hive);
    this.arrayHiveSelect.splice(index, 1);
  }

  /**
   *
   *
   * @returns {Array<RucheInterface>}
   * @memberof StackService
   */
  getHiveSelect(): Array<RucheInterface> {
    return this.arrayHiveSelect;
  }

  checkHiveisActive(idHive: string) {
    return this.arrayHiveSelect.filter(hive => hive.id === idHive).length > 0 ? 'active' : '';
  }
}
