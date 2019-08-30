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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../constants/config';
import { DailyRecordsW } from '../../../_model/daily-records-w';
import { ElementSchemaRegistry } from '@angular/compiler';
import { MyDate } from '../../../class/MyDate';
import { User } from '../../../_model/user';
import { UserParamsService } from '../../preference-config/service/user-params.service';
import { UnitService } from '../unit.service';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class DailyRecordsWService {


  /*
  *   Service pour les données DailyRecordsW pour le calendrier de poid
  *
  */

  dailyObs: Observable<DailyRecordsW[]>;
  public loading: boolean;
  private dailyRec: DailyRecordsW[];
  public dailyWeightRecords: DailyRecordsW[];
  private dailyRecArray: any[];
  private weightIncome: any[];
  private unitSystem: string;
  mergeOptionWeight: any = null;
  private rangeCalendar: Array<string>;
  currentIdHive: string;

  arrayTempExt: any[];
  mergeOptionWeightTempExt: any;

  timeLine: any[];
  public rangeDailyRecord: Date;

  constructor(private http: HttpClient, private unitService: UnitService, private graphGlobal: GraphGlobal) {
    this.dailyRecArray = [];
    this.arrayTempExt = [];
    this.weightIncome = [];
    this.rangeDailyRecord = new Date();
    this.rangeDailyRecord.setDate(new Date().getDate() - 1);
    this.rangeDailyRecord.setHours(2);
    this.rangeDailyRecord.setMinutes(0);
    this.updateCalendar();
  }

  /**
   *
   *
   * @param {string} idHive
   * @param {string} [hiveName]
   * @returns {Observable<any>}
   * @memberof DailyRecordsWService
   */
  getDailyRecordWByHive(idHive: string, hiveName?: string): Observable<any> {
    this.currentIdHive = idHive;
    return this.http.get<DailyRecordsW[]>(CONFIG.URL + 'dailyRecordsW/hive/' + idHive).map(res => {
      this.arrayTempExt = res.map(elt => [MyDate.getWekitDate(MyDate.convertDate(new Date(elt.recordDate))),
      this.unitService.convertTempFromUsePref(elt.temp_ext_max, this.unitSystem, false)]);
      this.weightIncome = res.map(elt => [MyDate.getWekitDate(MyDate.convertDate(new Date(elt.recordDate))), elt.weight_income_gain]);
      return {
        tempExt: {
          series: {
            name: hiveName,
            type: 'heatmap',
            coordinateSystem: 'calendar',
            data: this.arrayTempExt
          },
          tooltip: {
            formatter: (params) => {
              return params.marker +
                this.unitService.getDailyDate(params.data[0]) + '<br/>' + this.unitService.getValRound(params.data[1]) + (this.unitSystem === 'METRIC' ? '°C' : '°F');
            }
          },
          title: {
            text: this.graphGlobal.getTitle("ExternalTemperature") + '(max, ' + (this.unitSystem === 'METRIX' ? '°C' : '°F') + ')'
          },
          visualMap: {
            min: this.unitSystem === 'METRIC' ? -10 : 15,
            max: this.unitSystem === 'METRIC' ? 40 : 105,
            calculable: true,
            inRange: {
              /* color: ['#abd9e9','#CC0000'] */
              color: ['#313695', '#4575b4', '#74add1',
                '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            },
          }
        },
        weightIncome: {
          tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
              return params.marker + this.unitService.getDailyDate(params.data[0]) + '<br/>' +
                params.seriesName + ' : ' + this.unitService.getValRound(params.data[1]);
            }
          },
          legend: {
            top: 30,
            data: ['gain', 'loss'],
            textStyle: {
              color: 'black'
            }
          },
          series: [
            {
              name: 'gain',
              type: 'effectScatter',
              coordinateSystem: 'calendar',
              data: this.weightIncome,
              symbolSize: (val: any) => {
                if (val[1] >= 0) { return 0.5 * Math.sqrt(1000 * val[1]); }
                else { return 0; }
              },
              showEffectOn: 'emphasis',
              rippleEffect: {
                brushType: 'stroke'
              },
              hoverAnimation: true,
              itemStyle: {
                normal: {
                  color: '#00FE0C'
                }
              }
            },
            {
              name: 'loss',
              type: 'effectScatter',
              coordinateSystem: 'calendar',
              data: this.weightIncome,
              symbolSize: (val: any) => {
                if (val[1] < 0) { return 0.5 * Math.sqrt(Math.abs(1000 * val[1])); }
                else { return 0; }
              },
              showEffectOn: 'emphasis',
              rippleEffect: {
                brushType: 'stroke'
              },
              hoverAnimation: true,
              itemStyle: {
                normal: {
                  color: '#FE0000'
                }
              }
            },
          ]
        }
      };
    });

  }

  setUnitSystem(unit: string): void {
    this.unitSystem = unit;
  }

  /* FOR HIVE CLICK */
  getDailyRecordsWbyIdHive(idHive: string) {
    this.loading = true;
    this.currentIdHive = idHive;
    this.dailyRecArray = [];
    this.arrayTempExt = [];
    this.dailyRec = [];
    this.dailyObs = this.http.get<DailyRecordsW[]>(CONFIG.URL + 'dailyRecordsW/hive/' + idHive);
    this.dailyObs.subscribe(
      (data) => {
        if (data.length > 0) {
          this.dailyRec = data;
          this.getArray();
          this.updateCalendar();
        } else {
          this.updateCalendar();
        }
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.loading = false;
      }

    );
  }

  /* FOR MELLI_CHARTS */
  getDailyRecordsWbyHiveForMelliCharts(idHive: string, range: Date[]): Observable<any> {
    return this.http.post<any[]>(CONFIG.URL + 'dailyRecordsW/hive/between/' + idHive, range).map(dailyW => {
      console.log(dailyW);
      return {
        weightIncomeHight: dailyW.filter(_filter => _filter.value >= 0).map(_elt => {
          return { date: _elt.date, value: this.unitService.convertWeightFromuserPref(_elt.value, this.unitSystem), sensorRef: _elt.sensorRef };
        }),
        weightIncomeLow: dailyW.filter(_filter => _filter.value < 0).map(_elt => {
          return { date: _elt.date, value: this.unitService.convertWeightFromuserPref(_elt.value, this.unitSystem), sensorRef: _elt.sensorRef };
        })
      };
    })
  }

  updateCalendar() {
    this.mergeOptionWeight = {
      series: [
        {
          data: this.dailyRecArray,

        },
        {
          data: this.dailyRecArray,
        },

      ]
    }
    this.mergeOptionWeightTempExt = {
      series: {
        data: this.arrayTempExt
      },
      tooltip: {
        formatter: (params) => {
          return params.marker +
            this.unitService.getDailyDate(params.data[0]) + '<br/>' + this.unitService.getValRound(params.data[1]) + (this.unitSystem === 'METRIC' ? '°C' : '°F');
        }
      },
      title: {
        text: this.graphGlobal.getTitle("ExternalTemperature") + ' (max, ' + (this.unitSystem === 'METRIC' ? '°C' : '°F') + ')'
      },
      visualMap: {
        min: this.unitSystem === 'METRIC' ? -10 : 30,
        max: this.unitSystem === 'METRIC' ? 40 : 100,
        calculable: true,
        inRange: {
          /* color: ['#abd9e9','#CC0000'] */
          color: ['#313695', '#4575b4', '#74add1',
            '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        },
      }
    };
  }

  cleanQuery() {
    this.dailyRec = [];
    this.dailyRecArray = [];
    this.dailyObs = null;
    this.mergeOptionWeight = null;
  }

  convertDate(date: Date) {
    var jour = '' + date.getDate();
    var mois = '' + (date.getMonth() + 1);
    var anee = date.getFullYear();
    if (parseInt(jour) < 10) { jour = '0' + jour; }
    if (parseInt(mois) < 10) { mois = '0' + mois; }

    return anee + '-' + mois + '-' + jour;
  }

  getMonth(date: Date) {
    return (new Date(date).getMonth() + 1);
  }
  getYear(date: string) {
    return new Date(date).getFullYear();
  }

  getArray() {
    this.timeLine = [];
    let lastMonth = null;
    this.dailyRec.forEach((element, index) => {
      this.arrayTempExt.push([element.recordDate, this.unitService.convertTempFromUsePref(element.temp_ext_max, this.unitSystem, false)])
      if (this.getMonth(element.recordDate) !== lastMonth) {
        this.timeLine.push(element.recordDate);
      }
      this.dailyRecArray.push([
        element.recordDate,
        this.unitService.convertWeightFromuserPref(element.weight_income_gain, this.unitSystem, false)
      ]);
      lastMonth = this.getMonth(element.recordDate);
    });
  }

  /**
   * 
   * @param idHive 
   * @param range 
   */
  getWeightByHive(idHive: string, range: Date[]): Observable<any> {
    return this.http.post<any>(CONFIG.URL + 'dailyRecordsW/weightMax/' + idHive, range).map(_elt => _elt.map(_value => {
      return { date: _value.date, value: this.unitService.convertWeightFromuserPref(_value.value, this.unitSystem), sensorRef: _value.sensorRef };
    }));;

  }
  /**
   *
   * @public
   * @param {string} idApiary
   * @memberof DailyRecordsWService
   */
  public nextDay(idApiary: string): void {
    this.rangeDailyRecord.setDate(this.rangeDailyRecord.getDate() + 1);
    this.rangeDailyRecord.setHours(23);
    this.rangeDailyRecord.setMinutes(0);
    this.rangeDailyRecord.setSeconds(0);
    this.getDailyWeightIncomeByApiary(idApiary);
  }
  /**
   *
   * @public
   * @param {string} idApiary
   * @memberof DailyRecordsWService
   */
  public previousDay(idApiary: string): void {
    this.rangeDailyRecord.setDate(this.rangeDailyRecord.getDate() - 1);
    this.rangeDailyRecord.setHours(23);
    this.rangeDailyRecord.setMinutes(0);
    this.rangeDailyRecord.setSeconds(0);
    this.getDailyWeightIncomeByApiary(idApiary);
  }

  public getWeightIncomeByHive(idHive: string): any {
    const selectHive = this.dailyWeightRecords.filter(elt => elt.idHive === idHive)[0];
    if (this.unitSystem === 'METRIC') {
      return selectHive !== undefined ? selectHive.weight_income_gain + ' kg' : null;
    } else {
      return selectHive !== undefined ? selectHive.weight_income_gain + ' lbs' : null;
    }

  }

  public getDailyWeightIncomeByApiary(idApiary: string): void {
    this.dailyWeightRecords = [];
    var tabDate: Date[];
    var previousDay: Date;
    previousDay = new Date();
    previousDay.setFullYear(this.rangeDailyRecord.getFullYear());
    previousDay.setMonth(this.rangeDailyRecord.getMonth());
    previousDay.setDate(this.rangeDailyRecord.getDate() - 1);
    previousDay.setHours(23);
    previousDay.setMinutes(0);
    tabDate = [previousDay, this.rangeDailyRecord];
    this.http.post<DailyRecordsW[]>(CONFIG.URL + 'dailyRecordsW/apiary/' + idApiary, tabDate).subscribe(
      (data) => {
        if (data[0] != null) {
          this.dailyWeightRecords = data.flat();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   *
   *
   * @param {string} idHIve
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof DailyRecordsWService
   */
  public getTempMaxExt(idHIve: string, range: Date[]): Observable<any> {
    return this.http.post<any>(CONFIG.URL + 'dailyRecordsW/tMax/' + idHIve, range).map(_elt => _elt.map(_value => {
      return { date: _value.date, value: this.unitService.convertTempFromUsePref(_value.value, this.unitSystem), sensorRef: _value.sensorRef };
    }));
  }

  /**
   *
   *
   * @param {string} idHIve
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof DailyRecordsWService
   */
  public getTempMinExt(idHIve: string, range: Date[]): Observable<any> {
    return this.http.post<any>(CONFIG.URL + 'dailyRecordsW/tMin/' + idHIve, range).map(_elt => _elt.map(_value => {
      return { date: _value.date, value: this.unitService.convertTempFromUsePref(_value.value, this.unitSystem), sensorRef: _value.sensorRef };
    }));
  }

}
