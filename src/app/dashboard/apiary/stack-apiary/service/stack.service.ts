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
import { RucheInterface } from '../../../../_model/ruche';
import { DeprecatedDatePipe } from '@angular/common';
import { DataRange } from '../../../../_model/data-range';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StackService {

  private arrayHiveSelect: Array<RucheInterface>;
  private colorByHive: Array<any>;
  public range: DataRange;
  private arrayColor: Array<any>;
  constructor(private httpClient: HttpClient) {
    this.arrayHiveSelect = [];
    this.colorByHive = [];
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

  addColorForObs(hive: RucheInterface, color: string){
    this.colorByHive.push({idHive: hive._id, color: color});
  }

  /**
   *
   *
   * @param {string} idHive
   * @returns {string}
   * @memberof StackService
   */
  getColorByHive(idHive: string): string {
    return this.colorByHive.filter(elt => elt.idHive === idHive)[0].color;
  }

  /**
   *
   *
   * @param {number} index
   * @returns
   * @memberof StackService
   */
  getColorByIndex(index: number, hive: RucheInterface) {
    if (this.arrayHiveSelect.filter(elt => elt._id === hive._id).length > 0) {
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
    const indexColor = this.colorByHive.map(elt => elt.idHive).indexOf(hive._id);
    this.arrayHiveSelect.splice(index, 1, this.getEmptyHive());
    this.colorByHive.splice(indexColor, 1);
  }

  /**
   *
   *
   * @returns {RucheInterface}
   * @memberof StackService
   */
  getEmptyHive(): RucheInterface {
    return {
      _id : '',
      name : '',
      description : '',
      userId : '',
      username : '',
      apiaryId: '',
      dataLastReceived: null,
      hidden: false,
      createDate: null,
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
    return this.arrayHiveSelect.filter(hive => hive._id === idHive).length > 0 ? 'active' : '';
  }
}