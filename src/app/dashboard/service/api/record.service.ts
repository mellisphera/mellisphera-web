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

//import { NgxEchartsModule } from 'ngx-echarts';
/**
 * @author mickael
 * @description Ensemble des requetes pour récupérer les données heure/heure
 *
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CONFIG } from '../../../../constants/config';
import { Record } from '../../../_model/record';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataRange } from '../../../_model/data-range';
import { MyDate } from '../../../class/MyDate';
import { store } from '@angular/core/src/render3/instructions';
import { EChartsOptionConfig, ECharts, EChartOption } from 'echarts';
import { UnitService } from '../unit.service';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  public recArray: Record[];
  public recordObs: Observable<Record[]>;
  public loading: boolean;
  private recArrrayTint: any[];
  private recArrayText: any[];
  private recArrayWeight: any;
  private recArrayDateExt: any[];
  private recArrayDateInt: any[];
  private recArrayHint: any[];
  private recArrayHext: any[];
  private recArrayBatteryInt: any[];
  private recArrayBatteryExt: any[];
  public mergeOptionHourly: any = null;
  public currenthiveId: string;
  private templateSerie: any;
  private rangeHourly: Date[];
  private unitSystem: string;
  public mergeOptionStack: any = null;
  public mergeOptionStackApiary: any;
  public stackSubject: BehaviorSubject<EChartOption>;
  private mergeTemp: any;
  private legendOption: Array<string>;
  constructor(private http: HttpClient, private unitService: UnitService, private graphGlobal: GraphGlobal) {
    this.currenthiveId = null;
    // this.stackSubject = new BehaviorSubject({});
    this.mergeTemp = {
      legend: {
        data: []
      },
      series: [],
    };
    this.updateMergeStack();

    this.mergeOptionStack = {
      series: []
    };
    this.loading = false;
    this.legendOption = [];
  }


  /**
   *
   * @param {string} hiveId
   * @param {string} hiveName
   * @param {*} lastMerge
   * @param {boolean} [hive]
   * @returns {Observable<any>}
   * @memberof RecordService
   */
  getRecordByhiveId(hiveId: string, hiveName: string, lastMerge: any, color?: string): Observable<any> {
    return this.http.post<Record[]>(CONFIG.URL + 'records/hive/' + hiveId, this.rangeHourly, httpOptions).map((records) => {
      let sensor = [];
      let series = [];
      records.map(res => {
        if (sensor.indexOf(res.sensorRef) === -1) {
          sensor.push(res.sensorRef);
          res.recordDate = new Date(res.recordDate);
        }
      });
      sensor.forEach(elt => {
        if (elt.startsWith('41')) {
          series.push({
            name: hiveName + ' / Temp-int (' + elt + ')',
            type: 'line',
            data: records.filter(ref => ref.sensorRef === elt).map(recRes => {
              return {
                name: recRes.recordDate,
                value: [recRes.recordDate,
                this.unitService.convertTempFromUsePref(recRes.temp_int, this.unitSystem, false)],
                sensorRef: recRes.sensorRef
              };
            }),
            showSymbol: false,
            hoverAnimation: true,
            xAxisIndex: 1,
            yAxisIndex: 1,
            lineStyle: {
              color: color
            },
            itemStyle: {
              color: color
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: '#EBEBEB'
              },
              label: {
                show: true
              },
              data: [[{
                yAxis: this.unitSystem === 'METRIC' ? '33' : '90'
              }, {
                yAxis: this.unitSystem === 'METRIC' ? '37' : '100'
              }]]
            },
          });
        } else if (elt.startsWith('42')) {
          series = series.concat([
            {
              data: records.filter(ref => ref.sensorRef === elt).map(recRes => {
                return {
                  name: recRes.recordDate,
                  value: [recRes.recordDate, this.unitService.convertTempFromUsePref(recRes.temp_int, this.unitSystem, false)],
                  sensorRef: recRes.sensorRef
                };
              }),
              name: hiveName + ' / Temp-int (' + elt + ')',
              type: 'line',
              xAxisIndex: 1,
              yAxisIndex: 1,
              showSymbol: false,
              hoverAnimation: true,
              lineStyle: {
                color: color
              },
              itemStyle: {
                color: color
              },
              markArea: {
                silent: true,
                itemStyle: {
                  color: '#EBEBEB'
                },
                label: {
                  show: true
                },
                data: [[{
                  yAxis: this.unitSystem === 'METRIC' ? '33' : '90'
                }, {
                  yAxis: this.unitSystem === 'METRIC' ? '37' : '100'
                }]]
              },
            },
            {
              data: records.filter(ref => ref.sensorRef === elt).map(recRes => {
                return {
                  name: recRes.recordDate,
                  value: [recRes.recordDate, recRes.humidity_int, this.unitSystem],
                  sensorRef: recRes.sensorRef
                };
              }),
              name: hiveName + ' / Hum-int (' + elt + ')',
              type: 'line',
              xAxisIndex: 2,
              yAxisIndex: 2,
              showSymbol: false,
              hoverAnimation: true,
              lineStyle: {
                color: color
              },
              itemStyle: {
                color: color
              },
            }
          ]);
        } else if (elt.startsWith('43')) {
          series = series.concat([
            {
              name: hiveName + ' / ' + this.graphGlobal.getTitle("Weight") + ' (' + elt + ')',
              type: 'line',
              data: records.filter(ref => ref.sensorRef === elt).map(recRes => {
                return {
                  name: recRes.recordDate,
                  value: [recRes.recordDate, this.unitService.convertWeightFromuserPref(recRes.weight, this.unitSystem, false)],
                  sensorRef: recRes.sensorRef
                };
              }),
              showSymbol: false,
              hoverAnimation: true,
              yAxisIndex: 0,
              lineStyle: {
                color: color
              },
              itemStyle: {
                color: color
              },
            },
            {
              name: hiveName + ' / Temp-ext (' + elt + ')',
              type: 'line',
              xAxisIndex: 1,
              yAxisIndex: 1,
              showSymbol: false,
              hoverAnimation: true,
              data: records.filter(ref => ref.sensorRef === elt).map(recRes => {
                return {
                  name: recRes.recordDate,
                  value: [recRes.recordDate, this.unitService.convertTempFromUsePref(recRes.temp_ext, this.unitSystem, false)],
                  sensorRef: recRes.sensorRef
                };
              }),
              lineStyle: {
                color: color
              },
              itemStyle: {
                color: color
              },
            }
          ]);
        } else if (elt.startsWith('39')) {
          series.push({
            name: hiveName + ' / Temp-int (' + elt + ')',
            type: 'line',
            data: records.filter(ref => ref.sensorRef === elt).map(recRes => {
              return {
                name: recRes.recordDate,
                value: [recRes.recordDate, this.unitService.convertTempFromUsePref(recRes.temp_int, this.unitSystem, false)],
                sensorRef: recRes.sensorRef
              };
            }),
            xAxisIndex: 1,
            yAxisIndex: 1,
            showSymbol: false,
            markArea: {
              silent: true,
              itemStyle: {
                color: '#EBEBEB'
              },
              label: {
                show: true
              },
              data: [[{
                yAxis: this.unitSystem === 'METRIC' ? '33' : '90'
              }, {
                yAxis: this.unitSystem === 'METRIC' ? '37' : '100'
              }]]
            },
            hoverAnimation: true,
            lineStyle: {
              color: color
            },
            itemStyle: {
              color: color
            },
          });
        }
      });
      return {
        series: series.concat(lastMerge.series),
        legend: {
          data: series.map(legend => legend.name).concat(lastMerge.legend.data),
          show: false
        }
      };
    });
  }

  getRecordBySensor(hiveOd, range: Date[], userId, unit) {}

  setUnitSystem(unit: string): void {
    this.unitSystem = unit;
  }
  /**
   * @param {DataRange} scale
   * @memberof RecordService
   */
  setRange(scale: DataRange): void {
    let date = new Date();
    switch(scale.type){
      case 'DAY':
        date.setDate((new Date().getDate() - scale.scale));
        break;
      case 'MONTH':
        date.setMonth((new Date().getMonth() - scale.scale));
        break;
      case 'YEAR':
        date.setFullYear(new Date().getFullYear() - 1);
        break;
      case 'HOUR':
        date.setHours(scale.scale);
        break;
      default:
        date.setDate(date.getDate() - 15);
    }
    this.rangeHourly = MyDate.getRange(date);
  }

  updateMergeStack() {
    this.mergeOptionStackApiary = {
      legend: {
        data: []
      },
      series: [],
    };
  }

  /**
   *
   *
   * @memberof RecordService
   */
  updateMerge(): void {
    this.mergeOptionHourly = {
      series: [
        {
          data: []
        },
        {
          data: []
        },
        {
          data: []
        }
      ]
    };
    this.mergeOptionStack = {
      series: [
        {
          data: this.recArrrayTint
        },
        {
          data: this.recArrayText
        },
        {
          data: this.recArrayHint
        },
        {
          data: this.recArrayHext
        },
        {
          data: this.recArrayBatteryInt
        },
        {
          data: this.recArrayBatteryExt
        }
      ]
    };
  }

  /**
   *
   *
   * @param {string} hiveId
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof RecordService
   */
  getWeightByHive(hiveId: string, range: Date[], unit: string): Observable<any> {
    return this.http.get<any>(CONFIG.URL + `records/weight/${hiveId}/${range[0].getTime()}/${range[1].getTime()}/${unit}`)
  }

  /**
   *
   *
   * @param {string} hiveId
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof RecordService
   */
  getTempIntByHive(hiveId: string, range: Date[], unit: string): Observable<any> {
    return this.http.get<any>(CONFIG.URL +`records/temp_int/${hiveId}/${range[0].getTime()}/${range[1].getTime()}/${unit}`);
  }

  /**
   *
   *
   * @param {string} hiveId
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof RecordService
   */
  getHintIntByHive(hiveId: string, range: Date[]): Observable<any> {
    return this.http.get<any>(CONFIG.URL + `records/hint/${hiveId}/${range[0].getTime()}/${range[1].getTime()}`);
  }

  /**
   *
   *
   * @param {string} hiveId
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof RecordService
   */
  getTempExtByHive(hiveId: string, range: Date[], unit: string): Observable<any> {
    return this.http.get<any>(CONFIG.URL + `records/temp_ext/${hiveId}/${range[0].getTime()}/${range[1].getTime()}/${unit}`);
  }

  /**
   *
   *
   * @param {string} hiveId
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof RecordService
   */
  getBatExtByHive(hiveId: string, range: Date[], unit: string): Observable<any> {
    return this.http.get<any>(CONFIG.URL + `records/batExt/${hiveId}/${range[0].getTime()}/${range[1].getTime()}/${unit}`);
  }

  
  /**
   *
   *
   * @param {string} hiveId
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof RecordService
   */
  getBatIntByHive(hiveId: string, range: Date[]): Observable<any> {
    return this.http.post<any>(CONFIG.URL + 'records/batInt/' + hiveId, range);
  }

  getRecordsBySensorRefAndDateBetween(sensorRef: string, range: Date[]): Observable<Record[]>{
    return this.http.post<Record[]>(CONFIG.URL + 'records/sensor/between/' + sensorRef, range, httpOptions);
  }
}
