import { Injectable } from '@angular/core';
import { RucheInterface } from '../../../_model/ruche';
import { DeprecatedDatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StackService {

  private arrayHiveSelect: Array<RucheInterface>;
  private arrayColor: Array<string>;
  constructor() {
    this.arrayHiveSelect = [];
    this.arrayColor = [
      'green',
      'orange',
      'red',
      '#40A497',
      'blue',
      'yellow',
      '#5C33B3',
      '#6493E0',
      '#40F24F',
      '#108C8B',
      '#074784',
      'grey',
      '#DF5451',
      '#00FEEA',
      '#c23531',
      '#2f4554',
      '#61a0a8',
      '#d48265',
      '#91c7ae',
      '#749f83',
      '#ca8622',
      '#bda29a',
      '#6e7074',
      '#546570',
      '#c4ccd3'
    ];
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
   * @param {number} index
   * @returns
   * @memberof StackService
   */
  getColorByIndex(index: number, hive: RucheInterface) {
    if (this.arrayHiveSelect.filter(elt => elt.id === hive.id).length > 0) {
      return (index < this.arrayColor.length - 1) ? this.arrayColor[index] : null ;
    } else {
      return null;
    }
  }


  /**
   *
   *
   * @param {RucheInterface} hive
   * @memberof StackService
   */
  removeHive(hive: RucheInterface) {
    const index = this.arrayHiveSelect.indexOf(hive);
    this.arrayHiveSelect.splice(index, 1, this.getEmptyHive());
  }

  getEmptyHive(): RucheInterface {
    return {
      id : '',
      name : '',
      description : '',
      username : '',
      idApiary: '',
      apiaryName: '',
      hivePosX : '',
      hivePosY : '',
      sharingUser : []
    };
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
