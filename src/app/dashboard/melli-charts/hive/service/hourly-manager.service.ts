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
    console.log(data);
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
  getChartWeight(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.recordService.getWeightByHive(idHive, range).subscribe(
      (_weight: any) => {
        let option = Object.assign({}, this.baseOpions);
        if (rangeChange) {
          console.error('RANGE CHANGED');
          this.getSerieByData(_weight, type.name, (serieComplete: any, legend: Array<string>) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index] = Object.assign({}, serieComplete);
            option.legend.data = option.legend.data.concat(legend) 
          })
          chartInstance.setOption(option, true);
        } else {
          if (this.existSeries(option.series, type.unit, idHive)) {
            option.series = new Array();
          }
          //this.cleanChartsInstance(chartInstance, type.name);
          this.getSerieByData(_weight, type.name, (serieComplete: any, legend: Array<string>) => {
            console.log(serieComplete);
            option.legend.data = option.legend.data.concat(legend) 

            option.series.push(serieComplete);
          });
          console.log(option.series);
          // option.tooltip = this.getTooltipBySerie(chartName);
          option.yAxis.name = type.name;
          chartInstance.setOption(option, true);
        }
        this.baseOpions = option;
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(idHive);
        this.incrementeCharComplete();
      }

    )
  }


  getChartTempInt(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.recordService.getTempIntByHive(idHive, range).subscribe(
      _temp => {
        let option = Object.assign({}, this.baseOpions);
        console.log(rangeChange);
        if (rangeChange) {
          console.error('RANGE CHANGED');
          this.getSerieByData(_temp, type.name, (serieComplete: any, legend: Array<string>) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.legend.data = option.legend.data.concat(legend) 
            option.series[index] = Object.assign({}, serieComplete);
          })
          chartInstance.setOption(option, true);
        } else {
          if (this.existSeries(option.series, type.unit, idHive)) {
            option.series = new Array();
            console.error('clean');
          }
          // this.cleanChartsInstance(chartInstance, type.unit);
          this.getSerieByData(_temp, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            console.log(serieComplete);
            option.series.push(serieComplete);
          });
          option.yAxis.name = type.name;
          chartInstance.setOption(option, true);
        }
        this.baseOpions = option;
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(idHive);
        this.incrementeCharComplete();

      }
    );
  }

  getChartTempExt(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.recordService.getTempExtByHive(idHive, range).subscribe(
      _temp_ext => {
        let option = Object.assign({}, this.baseOpions);
        console.log(rangeChange);
        if (rangeChange) {
          console.error('RANGE CHANGED');
          this.getSerieByData(_temp_ext, type.name, (serieComplete: any, legend: Array<string>) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.legend.data = option.legend.data.concat(legend) 
            option.series[index] = Object.assign({}, serieComplete);
          })
          chartInstance.setOption(option, true);
        } else {
          if (this.existSeries(option.series, type.unit, idHive)) {
            option.series = new Array();
          }
          // this.cleanChartsInstance(chartInstance, type.name);
          this.getSerieByData(_temp_ext, type.name, (serieComplete: any, legend: Array<string>) => {
            console.log(serieComplete);
            option.legend.data = option.legend.data.concat(legend) 
            option.series.push(serieComplete);
          });
          option.yAxis.name = type.unit;

          chartInstance.setOption(option, true);
        }
        this.baseOpions = option;
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(idHive);
        this.incrementeCharComplete();

      }
    )
  }



  cleanChartsInstance(chartInstance: any, labelSerie: string) {
    if (chartInstance.getOption().series.filter(_filter => _filter.name !== labelSerie).length > 0) {
      this.baseOpions = Object.assign({}, BASE_OPTIONS.baseOptionDaily);
    }
  }

  existSeries(serieArray, unite: string, hive: string): boolean {
    if (!isUndefined(serieArray)) {

    }
    if (isUndefined(serieArray) || serieArray.length < 1) {
      return true;
    } else if (serieArray.length > 0) {
      if (unite === this.currentUnit) {
        console.log('IDENTIQUE');
        return false;
      } else {
        console.log('NOT IDENTIQUE');
        return true;
      }
    } else {
      return false;
    }
  }

  getChartHint(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.recordService.getHintIntByHive(idHive, range).subscribe(
      (_hint) => {
        let option = Object.assign({}, this.baseOpions);
        if (rangeChange) {
          console.error('RANGE CHANGED');
          this.getSerieByData(_hint, type.name, (serieComplete: any, legend: Array<string>) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index] = Object.assign({}, serieComplete);
            option.legend.data = option.legend.data.concat(legend) 
          })
          chartInstance.setOption(option, true);
        } else {
          if (this.existSeries(option.series, type.unit, idHive)) {
            option.series = new Array();
          }
          this.getSerieByData(_hint, type.name, (serieComplete: any, legend: Array<string>) => {
            console.log(serieComplete);
            option.legend.data = option.legend.data.concat(legend) 
            option.series.push(serieComplete);
          });
          chartInstance.setOption(option, true);
        }
        this.baseOpions = option;
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(idHive);
        this.incrementeCharComplete();

      }
    )
  }



  getChartBatInt(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.recordService.getBatIntByHive(idHive, range).subscribe(
      _batInt => {
        let option = Object.assign({}, this.baseOpions);
        console.log(rangeChange);
        if (rangeChange) {
          console.error('RANGE CHANGED');
          this.getSerieByData(_batInt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index] = Object.assign({}, serieComplete);
          })
          chartInstance.setOption(option, true);
        } else {
          if (this.existSeries(option.series, type.unit, idHive)) {
            option.series = new Array();
          }
          this.getSerieByData(_batInt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            console.log(serieComplete);
            option.series.push(serieComplete);
          });
          chartInstance.setOption(option, true);
        }
        this.baseOpions = option;
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(idHive);
        this.incrementeCharComplete();

      }
    )
  }

  getChartBatExt(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.recordService.getBatExtByHive(idHive, range).subscribe(
      _batExt => {
        let option = Object.assign({}, this.baseOpions);
        if (rangeChange) {
          console.error('RANGE CHANGED');
          this.getSerieByData(_batExt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index] = Object.assign({}, serieComplete);
          })
          chartInstance.setOption(option, true);

        } else {
          if (this.existSeries(option.series, type.unit, idHive)) {
            option.series = new Array();
          }
          // this.cleanChartsInstance(chartInstance, type.name);
          this.getSerieByData(_batExt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            console.log(serieComplete);
            option.series.push(serieComplete);
          });
          chartInstance.setOption(option, true);

        }
        this.baseOpions = option;
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(idHive);
        this.incrementeCharComplete();

      }
    )
  }

  getTempHourlyWeather(type: Tools, idApiary: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    const arrayObs : Array<Observable<any>> = [
      this.weatherService.getTempCurrentHourlyWeather(idApiary, range),
      this.weatherService.getTempForecastHourlyWeather(idApiary, range)
    ];
    Observable.forkJoin(arrayObs).map(_elt => _elt.flat()).subscribe(
      _tExt => {
        _tExt = _tExt.map(_elt => {
          return {date: _elt.date, value: _elt.value.temp, sensorRef: _elt.sensorRef};
        });
        console.log(_tExt);
         let option = Object.assign({}, this.baseOpions);
        if (rangeChange) {
          console.error('RANGE CHANGED');
          this.getSerieByData(_tExt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index] = Object.assign({}, serieComplete);
          })
          chartInstance.setOption(option, true);

        } else {
          if (this.existSeries(option.series, type.unit, idApiary)) {
            option.series = new Array();
          }
          // this.cleanChartsInstance(chartInstance, type.name);
          this.getSerieByData(_tExt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            console.log(serieComplete);
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

  getHextHourlyWeather(type: Tools, idApiary: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    const arrayObs : Array<Observable<any>> = [
      this.weatherService.getTempCurrentHourlyWeather(idApiary, range),
      this.weatherService.getTempForecastHourlyWeather(idApiary, range)
    ];
    Observable.forkJoin(arrayObs).map(_elt => _elt.flat()).subscribe(
      _hExt => {
        _hExt = _hExt.map(_elt => {
          return {date: _elt.date, value: _elt.value.humidity, sensorRef: _elt.sensorRef};
        });
        console.log(_hExt);
         let option = Object.assign({}, this.baseOpions);
        if (rangeChange) {
          console.error('RANGE CHANGED');
          this.getSerieByData(_hExt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index] = Object.assign({}, serieComplete);
          })
          chartInstance.setOption(option, true);

        } else {
          if (this.existSeries(option.series, type.unit, idApiary)) {
            option.series = new Array();
          }
          // this.cleanChartsInstance(chartInstance, type.name);
          this.getSerieByData(_hExt, type.name, (serieComplete: any, legend: Array<string>) => {
            option.legend.data = option.legend.data.concat(legend) 
            console.log(serieComplete);
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
      console.log(range);
      console.log(this.currentRange);
      console.log(startRangeSelect !== startCurrentRange || endRangeSelect !== endCurrentRange);
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
    console.log(series);
     if (series.length > 0) {
      series.forEach(element => {
        const indexSerie = option.series.map(_serie => _serie.name).indexOf(element.name);
        this.baseOpions.series.splice(indexSerie, 1);
        option.series.splice(indexSerie, 1);
      });
    }

    // echartInstance.clear();   
    console.log(this.baseOpions);
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
   * @param {string} idHive
   * @memberof HourlyManagerService
   */
  public setCurrentHive(idHive: string): void {
    this.currentHive = idHive;
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
