import { Injectable } from '@angular/core';
import { isArray } from 'util';
import { MyDate } from '../../../class/MyDate';
import { EChartOption } from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class MelliChartsService {

  private mergeMillichartsActif: EChartOption; // Merge utilsé
  private mergeAllData: any; // Merge de toute les données pour la ruche

  public startCalendar: Date;
  public endCalendar: Date;

  constructor() {
    this.mergeAllData = null;
    this.endCalendar = new Date();
    this.startCalendar = new Date(this.endCalendar.getFullYear() - 1, this.endCalendar.getMonth(), this.endCalendar.getDate());
    this.mergeMillichartsActif = {
      series: []
    };
  }

  /**
   *
   *
   * @param {*} merge
   * @returns {*}
   * @memberof MelliChartsService
   */
  public setMergeAllData(merge: any): any {
    this.mergeAllData = merge;
  }
  /**
   *
   *
   * @returns {*}
   * @memberof MelliChartsService
   */
  public getMergeAllData(): any {
    return this.mergeAllData;
  }
  /**
   *
   *
   * @param {*} merge
   * @memberof MelliChartsService
   */
  public setMerge(merge: EChartOption): void {
    this.mergeMillichartsActif.series = [];
    if (isArray(merge.series)) {
      this.mergeMillichartsActif.series = this.mergeMillichartsActif.series.concat(merge.series);
    } else {
      this.mergeMillichartsActif.series.push(merge.series);
    }
    this.mergeMillichartsActif.tooltip = merge.tooltip;
    this.mergeMillichartsActif.legend = merge.legend;
    this.mergeMillichartsActif.visualMap = merge.visualMap;
  }

  /**
   *
   *
   * @returns {*}
   * @memberof MelliChartsService
   */
  public getMerge(): any {
    return this.mergeMillichartsActif;
  }
  
}
