import { Injectable } from '@angular/core';
import { RucheInterface } from '../../../_model/ruche';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MelliChartsHiveService {

  private hiveSelect: RucheInterface;
  private echartInstances: any;
  private arrayColor: Array<any>;
  constructor(private httpClient: HttpClient) {
    this.hiveSelect = null;
    this.getColor();
  }


  getColor() {
    this.httpClient.get<any>('./assets/data/color.json').subscribe(
      data => {
        this.arrayColor = data;
      }
    );
  }

  getHiveSelect(): RucheInterface{
    return this.hiveSelect;
  }

  setHiveSelect(hive: RucheInterface) {
    this.hiveSelect = hive;
  }

  /**
   *
   *
   * @param {number} index
   * @param {RucheInterface} hive
   * @returns
   * @memberof MelliChartsHiveService
   */
  getColorByIndex(index: number, hive: RucheInterface) {
    if (this.hiveSelect === hive) {
      return (index < this.arrayColor.length - 1) ? this.arrayColor[index].hexString : null ;
    } else {
      return 'white';
    }
  }




  /**
   *
   *
   * @param {*} echarInstance
   * @memberof MelliChartsHiveService
   */
  setChartInstance(echarInstance: any): void {
    this.echartInstances = echarInstance;
  }

  /**
   *
   *
   * @returns {*}
   * @memberof MelliChartsHiveService
   */
  getChartInstance(): any {
    return this.echartInstances;
  }

  /**
   *
   *
   * @param {string} idHive
   * @returns
   * @memberof MelliChartsHiveService
   */
  checkHiveisActive(hiveTest: RucheInterface): boolean {
    return this.hiveSelect.id === hiveTest.id;
  }


}
