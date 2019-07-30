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
  private echartInstance: any;
  public range: DataRange;
  private arrayColor: Array<any>;
  constructor(private httpClient: HttpClient) {
    this.arrayHiveSelect = [];
    this.colorByHive = [];
    this.getColor();
    this.echartInstance = null;
  }


  /**
   *
   *
   * @param {*} echartInstance
   * @memberof StackMelliChartsService
   */
  setEchartInstance(echartInstance: any): void {
    this.echartInstance = echartInstance;
  }

/**
 *
 *
 * @returns {Promise<boolean>}
 * @memberof StackMelliChartsService
 */
checkIfInstanceEchartAlerayExist(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.echartInstance !== null) {
        resolve(true);
      } else {
        reject(false);
      }
    })
  }
  /**
   *
   *
   * @returns {*}
   * @memberof StackMelliChartsService
   */
  getEchartInstance(): any {
    return this.echartInstance;
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
    this.colorByHive.push({idHive: hive.id, color: color});
  }

  /**
   *
   *
   * @param {RucheInterface} hive
   * @returns {boolean}
   * @memberof StackMelliChartsService
   */
  ifActiveAlreadySelected(hive: RucheInterface): boolean {
    return this.arrayHiveSelect.findIndex(_hive => _hive.id === hive.id) !== -1;
  }

  /**
   *
   *
   * @param {string} idHive
   * @returns {string}
   * @memberof StackMelliChartsService
   */
  getColorByHive(idHive: string): string {
    return this.colorByHive.filter(elt => elt.idHive === idHive)[0].color;
  }



  /**
   *
   *
   * @param {number} index
   * @returns
   * @memberof StackMelliChartsService
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
   * @memberof StackMelliChartsService
   */
  removeHive(hive: RucheInterface) {
    const index = this.arrayHiveSelect.indexOf(hive);
    const indexColor = this.colorByHive.map(elt => elt.idHive).indexOf(hive.id);
    this.arrayHiveSelect.splice(index, 1, this.getEmptyHive());
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
      id : '',
      name : '',
      description : '',
      idUsername : '',
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
   * @memberof StackMelliChartsService
   */
  getHiveSelect(): Array<RucheInterface> {
    return this.arrayHiveSelect;
  }

  checkHiveisActive(idHive: string) {
    return this.arrayHiveSelect.filter(hive => hive.id === idHive).length > 0 ? 'active' : '';
  }
}
