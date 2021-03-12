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
import { HttpClient } from '@angular/common/http';
import { DataRange } from '../../../../_model/data-range';
import { e } from '@angular/core/src/render3';
import { resolve } from 'q';

@Injectable({
  providedIn: 'root'
})
export class StackMelliChartsService {

  private arrayHiveSelect: Array<RucheInterface>;
  private colorByHive: Array<any>;
  private stackEchartInstance: any;
  private broodChartInstance: any;
  private weightChartInstance: any;
  public range: DataRange;
  private arrayColor: Array<any>;
  constructor(private httpClient: HttpClient) {
    this.arrayHiveSelect = [];
    this.colorByHive = [];
    this.getColor();
    this.stackEchartInstance = null;
  }


  /**
   *
   *
   * @param {*} stackEchartInstance
   * @memberof StackMelliChartsService
   */
  setEchartInstance(stackEchartInstance: any): void {
    this.stackEchartInstance = stackEchartInstance;
  }

  /**
   *
   *
   * @param {*} chartInstance
   * @memberof StackMelliChartsService
   */
  setBroodChartInstance(chartInstance: any): void {
    this.broodChartInstance = chartInstance;
  }


  /**
   *
   *
   * @param {*} chartInstance
   * @returns {*}
   * @memberof StackMelliChartsService
   */
  getBroodChartInstance(): any {
    return this.broodChartInstance;
  }

  /**
  *
  *
  * @param {*} chartInstance
  * @memberof StackMelliChartsService
  */
 setWeightChartInstance(chartInstance: any): void {
   this.weightChartInstance = chartInstance;
 }


 /**
  *
  *
  * @param {*} chartInstance
  * @returns {*}
  * @memberof StackMelliChartsService
  */
 getWeightChartInstance(): any {
   return this.weightChartInstance;
 }

/**
 *
 *
 * @returns {Promise<boolean>}
 * @memberof StackMelliChartsService
 */
checkIfInstanceEchartAlerayExist(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.stackEchartInstance !== null) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  }
  /**
   *
   *
   * @returns {*}
   * @memberof StackMelliChartsService
   */
  getEchartInstance(): any {
    return this.stackEchartInstance;
  }



  /**
   *
   *
   * @memberof StackMelliChartsService
   */
  cleanSlectedHives(): void {
    this.arrayHiveSelect = new Array();
  }

  /**
   *
   *
   * @param {*} chartInstance
   * @memberof StackMelliChartsService
   */
  cleanSerieFromEchartInstance(chartInstance: any): void {
    const option = chartInstance.getOption();
    option.series = [];
    chartInstance.clear();
    chartInstance.setOption(option);
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
   * @memberof StackMelliChartsService
   */
  addHive(hive: RucheInterface) {
    this.arrayHiveSelect.push(hive);
  }

  addColorForObs(hive: RucheInterface, color: string){
    this.colorByHive.push({hiveId: hive._id, color: color});
  }

  /**
   *
   *
   * @param {RucheInterface} hive
   * @returns {boolean}
   * @memberof StackMelliChartsService
   */
  ifActiveAlreadySelected(hive: RucheInterface): boolean {
    return this.arrayHiveSelect.findIndex(_hive => _hive._id === hive._id) !== -1;
  }

  /**
   *
   *
   * @param {string} hiveId
   * @returns {string}
   * @memberof StackMelliChartsService
   */
  getColorByHive(hiveId: string): string {
    return this.colorByHive.filter(elt => elt.hiveId === hiveId)[0].color;
  }



  /**
   *
   *
   * @param {number} index
   * @returns
   * @memberof StackMelliChartsService
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
   * @memberof StackMelliChartsService
   */
  removeHive(hive: RucheInterface) {
    const index = this.arrayHiveSelect.indexOf(hive);
    const indexColor = this.colorByHive.map(elt => elt.hiveId).indexOf(hive._id);
    this.arrayHiveSelect.splice(index, 1);
    this.colorByHive.splice(indexColor, 1);
  }

  /**
   *
   *
   * @returns {RucheInterface}
   * @memberof StackMelliChartsService
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
   * @memberof StackMelliChartsService
   */
  getHiveSelect(): Array<RucheInterface> {
    return this.arrayHiveSelect;
  }

  checkHiveisActive(hiveId: string) {
    return this.arrayHiveSelect.filter(hive => hive._id === hiveId).length > 0 ? 'active' : '';
  }
}
