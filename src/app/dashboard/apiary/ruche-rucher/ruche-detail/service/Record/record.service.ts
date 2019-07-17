import { NgxEchartsModule } from 'ngx-echarts';
/**
 * @author mickael
 * @description Ensemble des requetes pour récupérer les données heure/heure
 *
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CONFIG } from '../../../../../../../constants/config';
import { Record } from '../../../../../../_model/record';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataRange } from './data-range';
import { MyDate } from '../../../../../../class/MyDate';
import { store } from '@angular/core/src/render3/instructions';
import { EChartsOptionConfig, ECharts, EChartOption } from 'echarts';
import { UnitService } from '../../../../../service/unit.service';
import { GraphGlobal } from '../../../../../graph-echarts/GlobalGraph';

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
  public currentIdHive: string;
  private templateSerie: any;
  private rangeHourly: Date[];
  private unitSystem: string;
  public mergeOptionStack: any = null;
  public mergeOptionStackApiary: any;
  public stackSubject: BehaviorSubject<EChartOption>;
  private mergeTemp: any;
  private legendOption: Array<string>;
  constructor(private http: HttpClient, private unitService: UnitService, private graphGlobal: GraphGlobal) {
    this.currentIdHive = null;
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
   * @param {string} idHive
   * @param {string} hiveName
   * @param {*} lastMerge
   * @param {boolean} [hive]
   * @returns {Observable<any>}
   * @memberof RecordService
   */
  getRecordByIdHive(idHive: string, hiveName: string, lastMerge: any, color?: string): Observable<any> {
    return this.http.post<Record[]>(CONFIG.URL + 'records/hive/' + idHive, this.rangeHourly, httpOptions).map((records) => {
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

  /**
   *
   *
   * @param {string} idHive
   * @returns {Observable<any>}
   * @memberof RecordService
   */
  getHourlyByHive(idHive: string): Observable<any> {
    return this.http.post<Record[]>(CONFIG.URL + 'records/hive/' + idHive, this.rangeHourly, httpOptions).map((records) => {
      var sensor = [];
      var series = [];
      records.map(res => {
        if (sensor.indexOf(res.sensorRef) === -1) {
          sensor.push(res.sensorRef);
        }
      });
      sensor.forEach(elt => {
        if (elt.startsWith('41')) {
          series.push({
            data: records.filter(ref => ref.sensorRef === elt).map(recRes => {
              return {
                name: recRes.recordDate,
                value: [recRes.recordDate, this.unitService.convertTempFromUsePref(recRes.temp_int, this.unitSystem, false)],
                sensorRef: recRes.sensorRef
              };
            }),
            name: 'Temp-int (' + elt + ')',
            type: 'line',
            showSymbol: false,
            hoverAnimation: true,
            yAxisIndex: 1,
            color: 'green',
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
          series.push({
            data: records.filter(ref => ref.sensorRef === elt).map(recRes => {
              return {
                name: recRes.recordDate,
                value: [recRes.recordDate, this.unitService.convertTempFromUsePref(recRes.temp_int, this.unitSystem)],
                sensorRef: recRes.sensorRef
              };
            }),
            name: 'Temp-int (' + elt + ')',
            type: 'line',
            showSymbol: false,
            hoverAnimation: true,
            yAxisIndex: 1,
            color: 'red',
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
        } else if (elt.startsWith('43')) {
          series = series.concat([
            {
              data: records.filter(ref => ref.sensorRef === elt).map(recRes => {
                return {
                  name: recRes.recordDate,
                  value: [recRes.recordDate, this.unitService.convertTempFromUsePref(recRes.weight, this.unitSystem, false)],
                  sensorRef: recRes.sensorRef
                };
              }),
              name: this.graphGlobal.getTitle("Weight") + ' (' + elt + ')',
              type: 'line',
              showSymbol: false,
              hoverAnimation: true,
              yAxisIndex: 0,
              color: 'black'
            },
            {
              name: 'Temp-ext (' + elt + ')',
              type: 'line',
              showSymbol: false,
              hoverAnimation: true,
              data: records.filter(ref => ref.sensorRef === elt).map(recRes => {
                return {
                  name: recRes.recordDate,
                  value: [recRes.recordDate, this.unitService.convertWeightFromuserPref(recRes.temp_ext, this.unitSystem, false)],
                  sensorRef: recRes.sensorRef
                };
              }),
              yAxisIndex: 1,
              color: 'blue'
            }
          ]);
        } else if (elt.startsWith('39')) {
          series.push({
            data: records.filter(ref => ref.sensorRef === elt).map(recRes => {
              return {
                name: recRes.recordDate,
                value: [recRes.recordDate, this.unitService.convertTempFromUsePref(recRes.temp_int, this.unitSystem, false)],
                sensorRef: recRes.sensorRef
              };
            }),
            name: 'Temp-int (' + elt + ')',
            type: 'line',
            showSymbol: false,
            hoverAnimation: true,
            yAxisIndex: 1,
            color: 'green',
            markArea: {
              silent: true,
              itemStyle: {
                color: '#ff00ff'
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
        }
      });
      return {
        series: series,
        legend: {
          data: series.map(legend => legend.name)
        }
      };
    });
  }

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
   * @param {string} idHive
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof RecordService
   */
  getWeightByHive(idHive: string, range: Date[]): Observable<any> {
    return this.http.post<any>(CONFIG.URL + 'records/weight/' + idHive, range);
  }

  /**
   *
   *
   * @param {string} idHive
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof RecordService
   */
  getTempIntByHive(idHive: string, range: Date[]): Observable<any> {
    return this.http.post<any>(CONFIG.URL + 'records/temp_int/' + idHive, range);
  }

  /**
   *
   *
   * @param {string} idHive
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof RecordService
   */
  getHintIntByHive(idHive: string, range: Date[]): Observable<any> {
    return this.http.post<any>(CONFIG.URL + 'records/hint/' + idHive, range);
  }

  /**
   *
   *
   * @param {string} idHive
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof RecordService
   */
  getTempExtByHive(idHive: string, range: Date[]): Observable<any> {
    return this.http.post<any>(CONFIG.URL + 'records/temp_ext/' + idHive, range);
  }
}
