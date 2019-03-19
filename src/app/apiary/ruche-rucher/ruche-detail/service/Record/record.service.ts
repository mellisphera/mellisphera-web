import { NgxEchartsModule } from 'ngx-echarts';
/**
 * @author mickael
 * @description Ensemble des requetes pour la récupérer les données heure/heure
 *
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CONFIG } from '../../../../../../config';
import { Record } from '../../../../../_model/record';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataRange } from './data-range';
import { MyDate } from '../../../../../class/MyDate';
import { store } from '@angular/core/src/render3/instructions';
import { EChartsOptionConfig, ECharts, EChartOption } from 'echarts';

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
  public mergeOptionStack: any = null;
  public mergeOptionStackApiary: any;
  public stackSubject: BehaviorSubject<EChartOption>;
  private mergeTemp: any;
  private legendOption: Array<string>;
  constructor(private http: HttpClient) {
    this.currentIdHive = null;
    this.stackSubject = new BehaviorSubject({});
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
  getRecordByIdHive(idHive: string, hiveName: string, lastMerge: any, hive?: boolean): Observable<any> {
    return this.http.post<Record[]>(CONFIG.URL + 'records/hive/' + idHive, this.rangeHourly, httpOptions).map((records) => {
      this.recArrayText = records.filter(record => record.temp_ext != null)
        .map((rec) => {
          return { name: rec.recordDate, value: [rec.recordDate, rec.temp_ext], sensorRef: rec.sensorRef };
        });
      this.recArrayWeight = records.filter(record => record.weight != null)
        .map((rec) => {
          return { name: rec.recordDate, value: [rec.recordDate, rec.weight], sensorRef: rec.sensorRef };
        });
      this.recArrayBatteryExt = records.filter(record => record.battery_ext != null)
        .map((rec) => {
          return { name: rec.recordDate, value: [rec.recordDate, rec.battery_ext], sensorRef: rec.sensorRef };
        });
      this.recArrayBatteryInt = records.filter(record => record.battery_int != null)
        .map((rec) => {
          return { name: rec.recordDate, value: [rec.recordDate, rec.battery_int], sensorRef: rec.sensorRef };
        });
      this.recArrayHext = records.filter(record => record.humidity_ext != null)
        .map((rec) => {
          return { name: rec.recordDate, value: [rec.recordDate, rec.humidity_ext], sensorRef: rec.sensorRef };
        });
      this.recArrayHint = records.filter(record => record.humidity_int != null)
        .map((rec) => {
          return { name: rec.recordDate, value: [rec.recordDate, rec.humidity_int], sensorRef: rec.sensorRef };
        });
      this.recArrrayTint = records.filter(record => record.temp_int != null)
        .map((rec) => {
          return { name: rec.recordDate, value: [rec.recordDate, rec.temp_int], sensorRef: rec.sensorRef };
        });
      if (!hive) {
        return {
          series: [
            {
              name: hiveName + '-weight',
              type: 'line',
              showSymbol: false,
              data: this.recArrayWeight
            },
            {
              name: hiveName + '-Tint',
              type: 'line',
              xAxisIndex: (hive) ? 0 : 1,
              yAxisIndex: (hive) ? 0 : 1,
              showSymbol: false,
              data: this.recArrrayTint
            },
            {
              name: hiveName + '-Text',
              type: 'line',
              xAxisIndex: (hive) ? 0 : 1,
              yAxisIndex: (hive) ? 0 : 1,
              showSymbol: false,
              data: this.recArrayText
            },
            {
              name: hiveName + '-Hint',
              type: 'line',
              xAxisIndex: (hive) ? 1 : 2,
              yAxisIndex: (hive) ? 0 : 2,
              showSymbol: false,
              data: this.recArrayHint
            },

          ].concat(lastMerge.series),
          legend: {
            data: [hiveName + '-Tint', hiveName + '-Text', hiveName + '-Hint', hiveName + '-weight']
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
                name:  'Batery-int(' + this.recArrayBatteryInt[0].sensorRef + ')',
                data: this.recArrayBatteryInt,
                xAxisIndex: 2,
                yAxisIndex: 2,
                showSymbol: false,
              } : null,
            (this.recArrayBatteryExt.length > 0) ?
              {
                type: 'line',
                name: 'Batery-ext(' +this.recArrayBatteryExt[0].sensorRef + ')',
                data: this.recArrayBatteryExt,
                xAxisIndex: 2,
                yAxisIndex: 2,
                showSymbol: false,
              } : null
          ],
          legend: {
            data: [
              (this.recArrrayTint.length > 0) ? 'Tint(' + this.recArrrayTint[0].sensorRef + ')'  : null,
              (this.recArrayText.length > 0) ? 'Text(' + this.recArrayText[0].sensorRef + ')' : null,
              (this.recArrayHint.length > 0) ? 'Hint(' + this.recArrayHint[0].sensorRef + ')' : null,
              (this.recArrayBatteryInt.length > 0) ? 'Batery-int(' + this.recArrayBatteryInt[0].sensorRef + ')' : null,
              (this.recArrayBatteryExt.length > 0) ? 'Batery-ext(' + this.recArrayBatteryExt[0].sensorRef + ')' : null
            ],
          }
        };
      }
    });
  }
  /**
   *
   * @param {string} hiveName
   * @memberof RecordService
   * @description Supprime les ruche déselectionnée du graph
   */
  removeHiveStack(hiveName: string) {
    this.mergeTemp.series.filter(serie => hiveName === serie.name.split('-')[0]).forEach(element => {
      const index = this.mergeTemp.series.indexOf(element);
      this.mergeTemp.series.splice(index, 1);
      this.legendOption.splice(index, 1);
    });
    this.stackSubject.next(this.mergeTemp);
    // this.stackSubject.complete();
  }

  getHourlyByHive(idHive: string) {
    return this.http.post<Record[]>(CONFIG.URL + 'records/hive/' + idHive, this.rangeHourly, httpOptions).map((records) => {
      this.recArrayText = records.filter(record => record.temp_ext != null)
        .map((rec) => {
          return { name: rec.recordDate, value: [rec.recordDate, rec.temp_ext], sensorRef: rec.sensorRef };
        });
      this.recArrayWeight = records.filter(record => record.weight != null)
        .map((rec) => {
          return { name: rec.recordDate, value: [rec.recordDate, rec.weight], sensorRef: rec.sensorRef };
        });
        this.recArrrayTint = records.filter(record => record.temp_int != null)
        .map((rec) => {
          return { name: rec.recordDate, value: [rec.recordDate, rec.temp_int], sensorRef: rec.sensorRef };
        });

      return {
        series: [
          {
            data: this.recArrayWeight,
            name:'Weight',
            type:'line',
            showSymbol: false,
            hoverAnimation: true,
            yAxisIndex: 0,
            color : 'black'
          },
          {
            data: this.recArrrayTint,
            name:'Temp-int',
            type:'line',
            showSymbol: false,
            hoverAnimation: true,
            yAxisIndex: 1,
            color : 'red'
          },
          {
            name:'Temp-ext',
            type:'line',
            showSymbol: false,
            hoverAnimation: true,
            data : '',
            yAxisIndex: 1,
            color : 'blue'
          }
        ],
        legend: {
          data: ['Weight', 'Temp-int', 'Temp-ext']
        }
      };
    });
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
        data: [this.legendOption]
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
  cleanTemplate() {
    this.templateSerie = {
      tInt: {
        name: 'Tint',
        type: 'line',
        showSymbol: false,
        data: []
      },
      tExt: {
        name: 'Text',
        type: 'line',
        showSymbol: false,
        data: []
      },
      hInt: {
        name: 'Hint',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        showSymbol: false,
        data: []
      },
      hExt: {
        name: 'Hext',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        showSymbol: false,
        data: []
      },
      bInt: {
        name: 'Batery-int',
        type: 'bar',
        xAxisIndex: 2,
        yAxisIndex: 2,
        showSymbol: false,
        color: 'red',
        large: true,
        largeThreshold: 10,
        barGap: '30%',
        data: []
      },
      bExt: {
        name: 'Batery-ext',
        type: 'bar',
        xAxisIndex: 2,
        yAxisIndex: 2,
        showSymbol: false,
        color: 'blue',
        large: true,
        largeThreshold: 10,
        barGap: '30%',
        data: []
      }
    };
  }
  mapRecord(next) {
    this.recArrrayTint = [];
    this.recArrayText = [];
    this.recArrayDateInt = [];
    this.recArrayWeight = [];
    this.recArrayDateExt = [];
    this.recArrayBatteryExt = [];
    this.recArrayBatteryInt = [];
    this.recArrayHext = [];
    this.recArrayHint = [];
    this.recArray.forEach((element, index) => {
      if (element.temp_ext != null) {
        this.recArrayText.push({
          name: element.recordDate, value: [
            element.recordDate, element.temp_ext
          ]
        });
        this.recArrayWeight.push({
          name: element.recordDate, value: [
            element.recordDate, element.weight
          ]
        });
        this.recArrayBatteryExt.push({
          name: element.recordDate, value: [
            element.recordDate, element.battery_ext
          ]
        });
        this.recArrayHext.push({
          name: element.recordDate, value: [
            element.recordDate, element.humidity_ext
          ]
        });
        // this.recArrayDateExt.push(element.recordDate,element.recordDate);
      } else if (element.temp_int != null) {
        this.recArrrayTint.push({
          name: element.recordDate, value: [
            element.recordDate, element.temp_int
          ]
        });
        this.recArrayBatteryInt.push({
          name: element.recordDate, value: [
            element.recordDate, element.battery_int
          ]
        });
        this.recArrayHint.push({
          name: element.recordDate, value: [
            element.recordDate, element.humidity_int
          ]
        });
        // this.recArrayDateInt.push(element.recordDate);
      }
    });
    next();
  }
}
