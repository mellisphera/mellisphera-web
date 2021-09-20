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
import { RecordService } from '../../../service/api/record.service';
import { BASE_OPTIONS } from '../../charts/BASE_OPTIONS';
import { SERIES } from '../../charts/SERIES';
import { isUndefined } from 'util';
import { BehaviorSubject, Observable } from 'rxjs';
import { WeatherService } from '../../../service/api/weather.service';
import { ForecastHourlyWeather } from '../../../../_model/forecast-hourly-weather';
import { CurrentHourlyWeather } from '../../../../_model/current-hourly-weather';
import { UnitService } from '../../../service/unit.service';


interface Tools {
  name: string;
  id: string;
  origin: string;
  unit?: string;
  class: string;
  icons?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HourlyManagerService {

  public baseOpions: any;
  private currentUnit: string;
  private currentHive: string;
  private numberChartAcive: number;
  private currentRange: Date[];
  private subjectCountChartComplete: BehaviorSubject<number>;
  constructor(
    private recordService: RecordService,
    private unitService: UnitService,
    private weatherService: WeatherService
  ) {
    this.subjectCountChartComplete = new BehaviorSubject(0);
    this.numberChartAcive = 0;
    this.currentUnit = null;
    this.currentHive = null;
    this.baseOpions = Object.assign(BASE_OPTIONS.baseOptionHourly);
  }


  /**
   *
   *
   * @param {Array<any>} data
   * @param {string} nameSerie
   * @param {Function} next
   * @memberof HourlyManagerService
   */
  getSerieByData(data: Array<any>, nameSerie: string, next: Function): void {
    let sensorRef: Array<string> = [];
    let legend: Array<string> = [];
    data.forEach(_data => {
      if (sensorRef.indexOf(_data.sensorRef) === -1) {
        sensorRef.push(_data.sensorRef);
        let serieTmp = Object.assign({}, SERIES.line);
        serieTmp.name = nameSerie + ' | ' + _data.sensorRef;
        legend.push(serieTmp.name);
        serieTmp.data = data.filter(_filter => _filter.sensorRef === _data.sensorRef).map(_map => {
          return { name: _map.date, value: [_map.date, _map.value, _map.sensorRef] };
        });
        next(serieTmp, legend);
      }
    });
  }
  getChartWeight(type: Tools, hiveId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.recordService.getWeightByHive(hiveId, range, this.unitService.getUserPref().unitSystem).subscribe(
      (_weight: any) => {
        let option = Object.assign({}, this.baseOpions);
        if (rangeChange) {
          this.getSerieByData(_weight, type.name, (serieComplete: any, legend: Array<string>) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index] = Object.assign({}, serieComplete);
            option.legend.data = option.legend.data.concat(legend) 
          })
          chartInstance.setOption(option, true);
        } else {
          if (this.existSeries(option.series, type.unit, hiveId)) {
            option.series = new Array();
          }
          //this.cleanChartsInstance(chartInstance, type.name);
          this.getSerieByData(_weight, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 

            option.series.push(serieComplete);
          });
          // option.tooltip = this.getTooltipBySerie(chartName);
          option.yAxis.name = type.name;
          chartInstance.setOption(option, true);
        }
        this.baseOpions = option;
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(hiveId);
        this.incrementeCharComplete();
      }

    )
  }


  getChartTempInt(type: Tools, hiveId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.recordService.getTempIntByHive(hiveId, range, this.unitService.getUserPref().unitSystem).subscribe(
      _temp => {
        let option = Object.assign({}, this.baseOpions);
        if (rangeChange) {
          this.getSerieByData(_temp, type.name, (serieComplete: any, legend: Array<string>) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.legend.data = option.legend.data.concat(legend) 
            option.series[index] = Object.assign({}, serieComplete);
          })
          chartInstance.setOption(option, true);
        } else {
          if (this.existSeries(option.series, type.unit, hiveId)) {
            option.series = new Array();
          }
          // this.cleanChartsInstance(chartInstance, type.unit);
          this.getSerieByData(_temp, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            option.series.push(serieComplete);
          });
          option.yAxis.name = type.name;
          chartInstance.setOption(option, true);
        }
        this.baseOpions = option;
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(hiveId);
        this.incrementeCharComplete();

      }
    );
  }

  getChartTempExt(type: Tools, hiveId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.recordService.getTempExtByHive(hiveId, range, this.unitService.getUserPref().unitSystem).subscribe(
      _temp_ext => {
        let option = Object.assign({}, this.baseOpions);
        if (rangeChange) {
          this.getSerieByData(_temp_ext, type.name, (serieComplete: any, legend: Array<string>) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.legend.data = option.legend.data.concat(legend) 
            option.series[index] = Object.assign({}, serieComplete);
          })
          chartInstance.setOption(option, true);
        } else {
          if (this.existSeries(option.series, type.unit, hiveId)) {
            option.series = new Array();
          }
          // this.cleanChartsInstance(chartInstance, type.name);
          this.getSerieByData(_temp_ext, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            option.series.push(serieComplete);
          });
          option.yAxis.name = type.unit;

          chartInstance.setOption(option, true);
        }
        this.baseOpions = option;
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(hiveId);
        this.incrementeCharComplete();

      }
    )
  }



  cleanChartsInstance(chartInstance: any, labelSerie: string) {
    if (chartInstance.getOption().series.filter(_filter => _filter.name !== labelSerie).length > 0) {
      this.baseOpions = Object.assign({}, BASE_OPTIONS.baseOptionDailyMelliCharts);
    }
  }

  existSeries(serieArray, unite: string, hive: string): boolean {
    if (!isUndefined(serieArray)) {

    }
    if (isUndefined(serieArray) || serieArray.length < 1) {
      return true;
    } else if (serieArray.length > 0) {
      if (unite === this.currentUnit) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  getChartHint(type: Tools, hiveId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.recordService.getHintIntByHive(hiveId, range).subscribe(
      (_hint) => {
        let option = Object.assign({}, this.baseOpions);
        if (rangeChange) {
          this.getSerieByData(_hint, type.name, (serieComplete: any, legend: Array<string>) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index] = Object.assign({}, serieComplete);
            option.legend.data = option.legend.data.concat(legend) 
          })
          chartInstance.setOption(option, true);
        } else {
          if (this.existSeries(option.series, type.unit, hiveId)) {
            option.series = new Array();
          }
          this.getSerieByData(_hint, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            option.series.push(serieComplete);
          });
          chartInstance.setOption(option, true);
        }
        this.baseOpions = option;
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(hiveId);
        this.incrementeCharComplete();

      }
    )
  }



  getChartBatInt(type: Tools, hiveId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.recordService.getBatIntByHive(hiveId, range).subscribe(
      _batInt => {
        let option = Object.assign({}, this.baseOpions);
        if (rangeChange) {
          this.getSerieByData(_batInt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index] = Object.assign({}, serieComplete);
          })
          chartInstance.setOption(option, true);
        } else {
          if (this.existSeries(option.series, type.unit, hiveId)) {
            option.series = new Array();
          }
          this.getSerieByData(_batInt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            option.series.push(serieComplete);
          });
          chartInstance.setOption(option, true);
        }
        this.baseOpions = option;
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(hiveId);
        this.incrementeCharComplete();

      }
    )
  }

  getChartBatExt(type: Tools, hiveId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.recordService.getBatExtByHive(hiveId, range, this.unitService.getUserPref().unitSystem).subscribe(
      _batExt => {
        let option = Object.assign({}, this.baseOpions);
        if (rangeChange) {
          this.getSerieByData(_batExt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index] = Object.assign({}, serieComplete);
          })
          chartInstance.setOption(option, true);

        } else {
          if (this.existSeries(option.series, type.unit, hiveId)) {
            option.series = new Array();
          }
          // this.cleanChartsInstance(chartInstance, type.name);
          this.getSerieByData(_batExt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            option.series.push(serieComplete);
          });
          chartInstance.setOption(option, true);

        }
        this.baseOpions = option;
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(hiveId);
        this.incrementeCharComplete();

      }
    )
  }

  getTempHourlyWeather(type: Tools, apiaryId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    const arrayObs : Array<Observable<any>> = [
      this.weatherService.getTempCurrentHourlyWeather(apiaryId, range),
      this.weatherService.getTempForecastHourlyWeather(apiaryId, range)
    ];
    Observable.forkJoin(arrayObs).map(_elt => _elt.flat()).subscribe(
      _tExt => {
        _tExt = _tExt.map(_elt => {
          return {date: _elt.date, value: _elt.value.temp, sensorRef: _elt.sensorRef};
        });
         let option = Object.assign({}, this.baseOpions);
        if (rangeChange) {
          this.getSerieByData(_tExt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index] = Object.assign({}, serieComplete);
          })
          chartInstance.setOption(option, true);

        } else {
          if (this.existSeries(option.series, type.unit, apiaryId)) {
            option.series = new Array();
          }
          // this.cleanChartsInstance(chartInstance, type.name);
          this.getSerieByData(_tExt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            option.series.push(serieComplete);
          });
          chartInstance.setOption(option, true);

        }
        this.baseOpions = option;
        this.setCurrentUnite(type.unit);
        this.incrementeCharComplete();
 
      }
    );
  }

  getHextHourlyWeather(type: Tools, apiaryId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    const arrayObs : Array<Observable<any>> = [
      this.weatherService.getTempCurrentHourlyWeather(apiaryId, range),
      this.weatherService.getTempForecastHourlyWeather(apiaryId, range)
    ];
    Observable.forkJoin(arrayObs).map(_elt => _elt.flat()).subscribe(
      _hExt => {
        _hExt = _hExt.map(_elt => {
          return {date: _elt.date, value: _elt.value.humidity, sensorRef: _elt.sensorRef};
        });
         let option = Object.assign({}, this.baseOpions);
        if (rangeChange) {
          this.getSerieByData(_hExt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index] = Object.assign({}, serieComplete);
          })
          chartInstance.setOption(option, true);

        } else {
          if (this.existSeries(option.series, type.unit, apiaryId)) {
            option.series = new Array();
          }
          // this.cleanChartsInstance(chartInstance, type.name);
          this.getSerieByData(_hExt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            option.series.push(serieComplete);
          });
          chartInstance.setOption(option, true);

        }
        this.baseOpions = option;
        this.setCurrentUnite(type.unit);
        this.incrementeCharComplete();
 
      }
    );
  }

  /**
   *
   *
   * @param {Date[]} range
   * @returns {boolean}
   * @memberof HourlyManagerService
   */
  ifRangeChanged(range: Date[]): boolean {
    try {
      const startRangeSelect = range[0].getTime();
      const endRangeSelect = range[1].getTime();

      const startCurrentRange = this.currentRange[0].getTime();
      const endCurrentRange = this.currentRange[1].getTime();
      if (startRangeSelect !== startCurrentRange || endRangeSelect !== endCurrentRange) {
        return true;
      }
      else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  /**
   *
   *
   * @param {*} echartInstance
   * @param {string} seriesName
   * @memberof HourlyManagerService
   */
  removeSeriesFromChartInstance(echartInstance: any, seriesName: string): void {
    let option = echartInstance.getOption();
    const series = option.series.filter(_filter => _filter.name.split('|')[0] === seriesName);
     if (series.length > 0) {
      series.forEach(element => {
        const indexSerie = option.series.map(_serie => _serie.name).indexOf(element.name);
        this.baseOpions.series.splice(indexSerie, 1);
        option.series.splice(indexSerie, 1);
      });
    }

    // echartInstance.clear();   
    echartInstance.setOption(option, true);

  }


  /**
   *
   *
   * @param {string} unite
   * @memberof HourlyManagerService
   */
  public setCurrentUnite(unite: string): void {
    this.currentUnit = unite;
  }

  /**
   *
   *
   * @param {string} hiveId
   * @memberof HourlyManagerService
   */
  public setCurrentHive(hiveId: string): void {
    this.currentHive = hiveId;
  }


  /**
   *
   *
   * @memberof HourlyManagerService
   */
  private checkAllChartIsComplete(): void {
    this.subjectCountChartComplete.subscribe(
      _value => {
        if (this.numberChartAcive === _value) {
          this.subjectCountChartComplete.complete();
        }
      }
    )
  }

  private incrementeCharComplete(): void {
    this.subjectCountChartComplete.next(+1);
    this.checkAllChartIsComplete();
  }

  /**
   *
   *
   * @param {number} nbChart
   * @memberof HourlyManagerService
   */
  public setNbChartSelected(nbChart: number): void {
    this.numberChartAcive = nbChart;
  }

  public getCountChartSubject(): BehaviorSubject<number> {
    return this.subjectCountChartComplete;
  }

  public resetCountSubject() {
    this.subjectCountChartComplete = new BehaviorSubject(0);
  }

  /**
   *
   *
   * @param {*} echartInstance
   * @memberof HourlyManagerService
   */
  setOriginOption(echartInstance: any): void {
    this.baseOpions.xAxis[0].axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getHourlyDate(new Date(value));
    };
  }
}
