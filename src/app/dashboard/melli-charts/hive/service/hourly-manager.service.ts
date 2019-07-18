import { Injectable } from '@angular/core';
import { RecordService } from '../../../apiary/ruche-rucher/ruche-detail/service/Record/record.service';
import { BASE_OPTIONS } from '../../charts/BASE_OPTIONS';
import { SERIES } from '../../charts/SERIES';
import { isUndefined } from 'util';


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
  private currentRange: Date[];
  constructor(
    private recordService: RecordService
  ) {
    this.currentUnit = null;
    this.currentHive = null;
    this.baseOpions = Object.assign(BASE_OPTIONS.baseOptionHourly);
  }

  getChartWeight(type: Tools, idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getWeightByHive(idHive, range).subscribe(
      (_weight: any) => {
        console.log(_weight);
        let option = Object.assign({}, this.baseOpions);
        console.error(option);
        if(this.ifRangeChanged(range)) {
          const index = option.series.map(_serie => _serie.name).indexOf(type.name);
          option.series[index].data = _weight.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
        } else {
          if (this.existSeries(option.series, type.unit, idHive)) {
            option.series = new Array();
          }
          this.cleanChartsInstance(chartInstance, type.name);
          let serie = Object.assign({}, SERIES.line);
          serie.name = type.name;
          serie.data = _weight.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
          // option.tooltip = this.getTooltipBySerie(chartName);
          option.series.push(serie);
          console.log(option);
        }
        this.currentRange = range;
        chartInstance.setOption(option);
        this.baseOpions = option;
        console.log(chartInstance.getOption());
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(idHive);
      }
      
    )
  }


  getChartTempInt(type: Tools, idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getTempIntByHive(idHive, range).subscribe(
      _temp => {
        console.log(_temp);
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          const index = option.series.map(_serie => _serie.name).indexOf(type.name);
          option.series[index].data = _temp.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
        } else {
          if (this.existSeries(option.series, type.name, idHive)) {
            option.series = new Array();
          }
          this.cleanChartsInstance(chartInstance, type.unit);
          let serie = Object.assign({}, SERIES.line);
          serie.name = type.name;
          serie.data = _temp.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
          // option.tooltip = this.getTooltipBySerie(chartName);
          option.series.push(serie);
          console.log(option);
        }
        this.currentRange = range;
        chartInstance.setOption(option);
        this.baseOpions = option;
        console.log(chartInstance.getOption());
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(idHive);
      }
    );
  }

  getChartTempExt(type: Tools, idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getTempExtByHive(idHive, range).subscribe(
      _temp_ext => {
        console.log(_temp_ext);
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          const index = option.series.map(_serie => _serie.name).indexOf(type.name);
          option.series[index].data = _temp_ext.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
        } else {
          if (this.existSeries(option.series, type.unit, idHive)) {
            option.series = new Array();
          }
           this.cleanChartsInstance(chartInstance, type.name);
          let serie = Object.assign({}, SERIES.line);
          serie.name = type.name;
          serie.data = _temp_ext.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
          // option.tooltip = this.getTooltipBySerie(chartName);
          option.series.push(serie);
          console.log(option);
        }
        this.currentRange = range;
        chartInstance.setOption(option);
        this.baseOpions = option;
        console.log(chartInstance.getOption());
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(idHive);
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
      console.log(serieArray);
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

  getChartHint(idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getHintIntByHive(idHive, range).subscribe(
      (_hint) => {
        console.log(_hint);
      }
    )
  }

  
  /**
   *
   *
   * @param {Date[]} range
   * @returns {boolean}
   * @memberof HourlyManagerService
   */
  ifRangeChanged(range: Date[]): boolean {
     if (isUndefined(this.currentRange) || (this.currentRange[0] === range[0] && this.currentRange[1] === range[1])) {
      return false;
     } else {
       return true;
     }
  }

  removeSeriesFromChartInstance(echartInstance: any, seriesName: string) {
    let options = echartInstance.getOption();
    Object.assign({}, options).series.forEach((element: any, i: number) => {
      options.series.splice(i, 1);
    });
    echartInstance.setOption(options);
    this.baseOpions = options;
  }


  /**
   *
   *
   * @param {string} unite
   * @memberof HourlyManagerService
   */
  setCurrentUnite(unite: string): void {
    this.currentUnit = unite;
  }

  /**
   *
   *
   * @param {string} idHive
   * @memberof HourlyManagerService
   */
  setCurrentHive(idHive: string): void {
    this.currentHive = idHive;
  }
}
