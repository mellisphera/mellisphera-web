import { Injectable } from '@angular/core';
import { RucheInterface } from '../../../../_model/ruche';
import { DeprecatedDatePipe } from '@angular/common';
import { DataRange } from '../../ruche-rucher/ruche-detail/service/Record/data-range';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StackService {

  private arrayHiveSelect: Array<RucheInterface>;
  public range: DataRange;
  private arrayColor: Array<any>;
  constructor(private httpClient: HttpClient) {
    this.arrayHiveSelect = [];
    this.getColor();
  }

  getColor() {
    this.httpClient.get<any>('./assets/data/color.json').subscribe(
      data => {
        this.arrayColor = data;
      }
    );
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
      return (index < this.arrayColor.length - 1) ? this.arrayColor[index].hexString : null ;
    } else {
      return 'white';
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

  /**
   *
   *
   * @returns {RucheInterface}
   * @memberof StackService
   */
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