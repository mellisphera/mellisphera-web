import { Injectable } from '@angular/core';
import { RucheInterface } from '../../../_model/ruche';
import { HttpClient } from '@angular/common/http';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class MelliChartsHiveService {
  
  private hiveSelect: RucheInterface;
  private dailyDeviceEchartInstances: any;
  private dailyOtherChartIstances: any;
  private hourlyEchartInstances: any
  private arrayColor: Array<any>;
  constructor(private httpClient: HttpClient) {
    this.hiveSelect = null;
    this.dailyDeviceEchartInstances = null;
    this.hourlyEchartInstances = null;
    this.dailyOtherChartIstances = null;
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
    * @returns {Promise<Boolean>}
    * @memberof MelliChartsHiveService
    */
    checkHiveNotNul(): Promise<Boolean> {
      return new Promise((resolve, reject) => {
        if (this.getHiveSelect() !== null) {
          resolve(true);
        } else {
          reject(false);
        }
      });
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
    
    
    checkifDailyDeviceInstanceChart(): Promise<Boolean> {
      return new Promise((resolve, reject) => {
        if (this.dailyDeviceEchartInstances !== null) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    }
    
    
    /**
    *
    *
    * @param {*} echarInstance
    * @memberof MelliChartsHiveService
    */
    setDailyDeviceChartInstance(echartInstance: any): void {
      this.dailyDeviceEchartInstances = echartInstance;
    }
    

    /**
     *
     *
     * @param {*} echartInstance
     * @memberof MelliChartsHiveService
     */
    setDailyOtherChartInstance(echartInstance: any): void {
      this.dailyOtherChartIstances = echartInstance;
    }

    /**
     *
     *
     * @returns {*}
     * @memberof MelliChartsHiveService
     */
    getDailyOtherChartInstance(): any {
      return this.dailyOtherChartIstances;
    }


    checkifOtherInstanceChart(): Promise<Boolean> {
      return new Promise((resolve, reject) => {
        if (this.dailyOtherChartIstances !== null) {
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
    * @memberof MelliChartsHiveService
    */
    getDailyDeviceChartInstance(): any {
      return this.dailyDeviceEchartInstances;
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
    setHourlyChartInstance(echarInstance: any): void {
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
  