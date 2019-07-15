import { Injectable } from '@angular/core';
import { RucheInterface } from '../../../_model/ruche';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MelliChartsHiveService {

  private hiveSelect: RucheInterface;
  private dailyEchartInstances: any;
  private hourlyEchartInstances: any
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
   * @memberof MelliChartsHonHourlyChartInitiveService
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
  setDailyChartInstance(echarInstance: any): void {
    this.dailyEchartInstances = echarInstance;
  }

  /**
   *
   *
   * @returns {*}
   * @memberof MelliChartsHiveService
   */
  getDailyChartInstance(): any {
    return this.dailyEchartInstances;
  }

  /**
   *
   *
   * @returns {*}
   * @memberof MelliChartsHiveService
   */
  getHourlyChartInstance(): any {
    return this.hourlyEchartInstances;
  }
  
  /**
   *
   *
   * @param {*} echarInstance
   * @memberof MelliChartsHiveService
   */
  setHourlyChartInstnace(echarInstance: any): void {
    this.hourlyEchartInstances = echarInstance;
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
