import { NgxEchartsModule } from 'ngx-echarts';
/**
 * @author mickael
 * @description Ensemble des requetes pour récupérer les données heure/heure
 *
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CONFIG } from '../../../../../../../config';
import { Record } from '../../../../../../_model/record';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataRange } from './data-range';
import { MyDate } from '../../../../../../class/MyDate';
import { store } from '@angular/core/src/render3/instructions';
import { EChartsOptionConfig, ECharts, EChartOption } from 'echarts';
import { UnitService } from '../../../../../service/unit.service';

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
  constructor(private http: HttpClient, private unitService: UnitService) {
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
  getRecordByIdHive(idHive: string, hiveName: string, lastMerge: any, hive: boolean, color?: string): Observable<any> {
    return this.http.post<Record[]>(CONFIG.URL + 'records/hive/' + idHive, this.rangeHourly, httpOptions).map((records) => {
      let sensor = [];
      let series = [];
      records.map(res => {
        if (sensor.indexOf(res.sensorRef) === -1) {
          sensor.push(res.sensorRef);
        }
      });
      sensor.forEach(elt => {
        console.log(elt);
        console.log(elt.startsWith('43'));
        if (elt.startsWith('41')) {
          series.push({
            name: hiveName + ' / Temp-int (' + elt + ')',
            type: 'line',
            data: records.filter(ref => ref.sensorRef === elt).map(recRes => {
              return {
                name: recRes.recordDate,
                value: [this.unitService.getHourlyDate(recRes.recordDate + ''),
                  this.unitService.convertTempFromUsePref(recRes.temp_int, this.unitSystem)],
                sensorRef: recRes.sensorRef
              };
            }),
            showSymbol: false,
            hoverAnimation: true,
            xAxisIndex: (hive) ? 0 : 1,
            yAxisIndex: (hive) ? 0 : 1,
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
                yAxis: '33'
              }, {
                yAxis: '37'
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
            name: hiveName + ' / Temp-int (' + elt + ')',
            type: 'line',
            xAxisIndex: (hive) ? 0 : 1,
            yAxisIndex: (hive) ? 0 : 1,
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
                yAxis: '33'
              }, {
                yAxis: '37'
              }]]
            },
          });
        } else if (elt.startsWith('43')) {
          series = series.concat([
            {
              name: hiveName + ' / Weight (' + elt + ')',
              type: 'line',
              data: records.filter(ref => ref.sensorRef === elt).map(recRes => {
                return {
                  name: recRes.recordDate,
                  value: [recRes.recordDate, this.unitService.convertWeightFromuserPref(recRes.weight, this.unitSystem)],
                  sensorRef: recRes.sensorRef
                };
              }),
              showSymbol: false,
              hoverAnimation: true,
              yAxisIndex: 0,
              color: 'black'
            },
            {
              name: hiveName + ' / Temp-ext (' + elt + ')',
              type: 'line',
              xAxisIndex: (hive) ? 0 : 1,
              yAxisIndex: (hive) ? 0 : 1,
              showSymbol: false,
              hoverAnimation: true,
              data: records.filter(ref => ref.sensorRef === elt).map(recRes => {
                return {
                  name: recRes.recordDate,
                  value: [recRes.recordDate, this.unitService.convertTempFromUsePref(recRes.temp_ext, this.unitSystem)],
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
                value: [recRes.recordDate, this.unitService.convertTempFromUsePref(recRes.temp_int, this.unitSystem)],
                sensorRef: recRes.sensorRef
              };
            }),
            xAxisIndex: (hive) ? 0 : 1,
            yAxisIndex: (hive) ? 0 : 1,
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
                yAxis: '50'
              }, {
                yAxis: '75'
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
      /*        if (!hive) {
              return {
                series: [
                  {
                    name: hiveName + ' / weight',
                    type: 'line',
                    showSymbol: false,
                    data: this.recArrayWeight,
                    lineStyle: {
                      color: color
                    },
                    itemStyle: {
                      color: color
                    },
                  },
                  {
                    name: hiveName + ' / Tint',
                    type: 'line',
                    xAxisIndex: (hive) ? 0 : 1,
                    yAxisIndex: (hive) ? 0 : 1,
                    showSymbol: false,
                    data: this.recArrrayTint,
                    itemStyle: {
                      color: color
                    },
                    lineStyle: {
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
                        yAxis: '33'
                      }, {
                        yAxis: '37'
                      }]]
                    },
                  },
                  {
                    name: hiveName + ' / Text',
                    type: 'line',
                    xAxisIndex: (hive) ? 0 : 1,
                    yAxisIndex: (hive) ? 0 : 1,
                    showSymbol: false,
                    data: this.recArrayText,
                    lineStyle: {
                      color: color
                    },
                    itemStyle: {
                      color: color
                    },
                  },
                  {
                    name: hiveName + ' / Hint',
                    type: 'line',
                    xAxisIndex: (hive) ? 1 : 2,
                    yAxisIndex: (hive) ? 0 : 2,
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
                        yAxis: '50'
                      }, {
                        yAxis: '75'
                      }]]
                    },
                    data: this.recArrayHint,
                    lineStyle: {
                      color: color
                    },
                    itemStyle: {
                      color: color
                    },
                  },
      
                ].concat(lastMerge.series),
                legend: {
                  data: [hiveName + ' / Tint', hiveName + ' / Text', hiveName + ' / Hint', hiveName + ' / weight']
                    .concat(lastMerge.legend.data),
                  show: false
                }
              };
            } else {
              return {
                series: [
                  (this.recArrrayTint.length > 0) ?
                    {
                      type: 'line',
                      name: 'Tint(' + this.recArrrayTint[0].sensorRef + ')',
                      data: this.recArrrayTint,
                      showSymbol: false,
                    } : null,
                  (this.recArrayText.length > 0) ?
                    {
                      type: 'line',
                      name: 'Text(' + this.recArrayText[0].sensorRef + ')',
                      showSymbol: false,
                      data: this.recArrayText
                    } : null,
                  (this.recArrayHint.length > 0) ?
                    {
                      type: 'line',
                      name: 'Hint(' + this.recArrayHint[0].sensorRef + ')',
                      data: this.recArrayHint,
                      xAxisIndex: 1,
                      yAxisIndex: 1,
                      showSymbol: false,
                    } : null,
                  (this.recArrayBatteryInt.length > 0) ?
                    {
                      type: 'line',
                      name: 'Batery-int(' + this.recArrayBatteryInt[0].sensorRef + ')',
                      data: this.recArrayBatteryInt,
                      xAxisIndex: 2,
                      yAxisIndex: 2,
                      showSymbol: false,
                    } : null,
                  (this.recArrayBatteryExt.length > 0) ?
                    {
                      type: 'line',
                      name: 'Batery-ext(' + this.recArrayBatteryExt[0].sensorRef + ')',
                      data: this.recArrayBatteryExt,
                      xAxisIndex: 2,
                      yAxisIndex: 2,
                      showSymbol: false,
                    } : null
                ],
                legend: {
                  data: [
                    (this.recArrrayTint.length > 0) ? 'Tint(' + this.recArrrayTint[0].sensorRef + ')' : null,
                    (this.recArrayText.length > 0) ? 'Text(' + this.recArrayText[0].sensorRef + ')' : null,
                    (this.recArrayHint.length > 0) ? 'Hint(' + this.recArrayHint[0].sensorRef + ')' : null,
                    (this.recArrayBatteryInt.length > 0) ? 'Batery-int(' + this.recArrayBatteryInt[0].sensorRef + ')' : null,
                    (this.recArrayBatteryExt.length > 0) ? 'Batery-ext(' + this.recArrayBatteryExt[0].sensorRef + ')' : null
                  ],
                }
              };
            } */
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
                value: [recRes.recordDate, this.unitService.convertTempFromUsePref(recRes.temp_int, this.unitSystem)],
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
                yAxis: '33'
              }, {
                yAxis: '37'
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
                yAxis: '33'
              }, {
                yAxis: '37'
              }]]
            },
          });
        } else if (elt.startsWith('43')) {
          console.log('ok');
          series = series.concat([
            {
              data: records.filter(ref => ref.sensorRef === elt).map(recRes => {
                return {
                  name: recRes.recordDate,
                  value: [recRes.recordDate, this.unitService.convertTempFromUsePref(recRes.weight, this.unitSystem)],
                  sensorRef: recRes.sensorRef
                };
              }),
              name: 'Weight (' + elt + ')',
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
                  value: [recRes.recordDate, this.unitService.convertWeightFromuserPref(recRes.temp_ext, this.unitSystem)],
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
                value: [recRes.recordDate, this.unitService.convertTempFromUsePref(recRes.temp_int, this.unitSystem)],
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
                yAxis: '33'
              }, {
                yAxis: '37'
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
    let date;
    if (scale.type === 'DAY') {
      date = new Date();
      date.setDate((new Date().getDate() - scale.scale));
    } else if (scale.type === 'MONTH') {
      date = new Date();
      date.setMonth((new Date().getMonth() - scale.scale));
    } else {
      date = new Date();
      date.setFullYear(new Date().getFullYear() - 1);
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
}
