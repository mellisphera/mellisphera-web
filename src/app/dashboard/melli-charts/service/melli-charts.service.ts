import { Injectable } from '@angular/core';
import { isArray } from 'util';

@Injectable({
  providedIn: 'root'
})
export class MelliChartsService {

  private mergeMillichartsActif: any; // Merge utilsé
  private mergeAllData: any; // Merge de toute les données pour la ruche

  constructor() {
    this.mergeAllData = null;
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
  public setMergeAllData(merge: any): any{
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
  public setMerge(merge: any): void {
    this.mergeMillichartsActif.series = [];
    if (isArray(merge)) {
      this.mergeMillichartsActif.series = this.mergeMillichartsActif.series.concat(merge);
    } else {
      this.mergeMillichartsActif.series.push(merge);
    }
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
