import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../../../config';
import { DailyRecordsW } from '../../../../../_model/daily-records-w';
import { ElementSchemaRegistry } from '@angular/compiler';
import { MyDate } from '../../../../../class/MyDate';
import { User } from '../../../../../_model/user';
import { UserParamsService } from '../../../../preference-config/service/user-params.service';

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
  private dailyRecArray: any[];
  private weightIncome: any[];
  mergeOptionWeight: any = null;
  private rangeCalendar: Array<string>;
  currentIdHive: string;

  arrayTempExt: any[];
  mergeOptionWeightTempExt: any;

  timeLine: any[];

  constructor(private http: HttpClient, private userConfig: UserParamsService) {
    this.dailyRecArray = [];
    this.arrayTempExt = [];
    this.weightIncome = [];
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
      this.arrayTempExt = res.map(elt => [MyDate.getWekitDate(MyDate.convertDate(new Date(elt.recordDate))), elt.temp_ext_max]);
      this.weightIncome = res.map(elt => [MyDate.getWekitDate(MyDate.convertDate(new Date(elt.recordDate))), elt.weight_income_gain]);
      return {
        tempExt: {
          series: {
            name: hiveName,
            type: 'heatmap',
            coordinateSystem: 'calendar',
            data: this.arrayTempExt
          },
          title: {
            text: 'External Temperature (max,°C)'
          },
          visualMap: {
            min: -10,
            max: 40,
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
              return params.marker + this.userConfig.getFormatCalendar(params.data[0]) + '<br/>' +
              params.seriesName + ' : ' + params.data[1];
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
          console.log('Aucune');
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
      title: {
        text: 'External Temperature (max,°C)'
      },
      visualMap: {
        min: -10,
        max: 40,
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
      this.arrayTempExt.push([element.recordDate, element.temp_ext_max])
      if (this.getMonth(element.recordDate) != lastMonth) {
        this.timeLine.push(element.recordDate);
      }
      this.dailyRecArray.push([
        element.recordDate,
        element.weight_income_gain
      ]);
      lastMonth = this.getMonth(element.recordDate)
    });
  }

}
