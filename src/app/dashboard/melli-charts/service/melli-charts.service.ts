import { Injectable } from '@angular/core';
import { isArray } from 'util';

@Injectable({
  providedIn: 'root'
})
export class MelliChartsService {

  private mergeMilliCharts: any;

  constructor() {
    this.mergeMilliCharts = {
      series: []
    };
  }

  /**
   *
   *
   * @param {*} merge
   * @memberof MelliChartsService
   */
  public setMerge(merge: any): void {
    console.log(merge);
    this.mergeMilliCharts.series = [];
    if (isArray(merge)) {
      console.log(this.mergeMilliCharts.series.concat(merge));
      this.mergeMilliCharts.series = this.mergeMilliCharts.series.concat(merge);
    } else {
      this.mergeMilliCharts.series.push(merge);
    }
  }

  /**
   *
   *
   * @returns {*}
   * @memberof MelliChartsService
   */
  public getMerge(): any {
    return this.mergeMilliCharts;
  }
}
