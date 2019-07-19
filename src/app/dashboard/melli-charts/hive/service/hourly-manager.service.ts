import { Injectable } from '@angular/core';
import { RecordService } from '../../../apiary/ruche-rucher/ruche-detail/service/Record/record.service';
import { BASE_OPTIONS } from '../../charts/BASE_OPTIONS';
import { SERIES } from '../../charts/SERIES';
import { isUndefined } from 'util';
import { BehaviorSubject } from 'rxjs';


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
    private recordService: RecordService
  ) {
    this.subjectCountChartComplete = new BehaviorSubject(0);
    this.numberChartAcive = 0;
    this.currentUnit = null;
    this.currentHive = null;
    this.baseOpions = Object.assign(BASE_OPTIONS.baseOptionHourly);
  }

  getChartWeight(type: Tools, idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getWeightByHive(idHive, range).subscribe(
      (_weight: any) => {
        let option = Object.assign({}, this.baseOpions);
        console.error(option);
        if(this.ifRangeChanged(range)) {
          console.error('RANGE CHANGED');
          const index = option.series.map(_serie => _serie.name).indexOf(type.name);
          option.series[index].data = _weight.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
        } else {
          if (this.existSeries(option.series, type.unit, idHive)) {
            option.series = new Array();
          }
          //this.cleanChartsInstance(chartInstance, type.name);
          let serie = Object.assign({}, SERIES.line);
          serie.name = type.name;
          serie.data = _weight.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
          // option.tooltip = this.getTooltipBySerie(chartName);
          option.series.push(serie);
          option.yAxis[0].name = type.unit;
          console.log(option);
        }
        chartInstance.setOption(option);
        this.baseOpions = option;
        console.log(chartInstance.getOption());
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(idHive);
        this.incrementeCharComplete();
      }
      
    )
  }


  getChartTempInt(type: Tools, idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getTempIntByHive(idHive, range).subscribe(
      _temp => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          console.error('RANGE CHANGED');
          const index = option.series.map(_serie => _serie.name).indexOf(type.name);
          option.series[index].data = _temp.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
        } else {
          if (this.existSeries(option.series, type.name, idHive)) {
            option.series = new Array();
          }
         // this.cleanChartsInstance(chartInstance, type.unit);
          let serie = Object.assign({}, SERIES.line);
          serie.name = type.name;
          serie.data = _temp.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
          // option.tooltip = this.getTooltipBySerie(chartName);
          option.series.push(serie);
          console.log(option);
        }
        chartInstance.setOption(option);
        this.baseOpions = option;
        console.log(chartInstance.getOption());
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(idHive);
        this.incrementeCharComplete();

      }
    );
  }

  getChartTempExt(type: Tools, idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getTempExtByHive(idHive, range).subscribe(
      _temp_ext => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          console.error('RANGE CHANGED');
          const index = option.series.map(_serie => _serie.name).indexOf(type.name);
          option.series[index].data = _temp_ext.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
        } else {
          if (this.existSeries(option.series, type.unit, idHive)) {
            option.series = new Array();
          }
          // this.cleanChartsInstance(chartInstance, type.name);
          let serie = Object.assign({}, SERIES.line);
          serie.name = type.name;
          serie.data = _temp_ext.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
          // option.tooltip = this.getTooltipBySerie(chartName);
          option.series.push(serie);
          option.yAxis[0].name = type.unit;

          console.log(option);
        }
        chartInstance.setOption(option);
        this.baseOpions = option;
        console.log(chartInstance.getOption());
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

  getChartHint(type: Tools, idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getHintIntByHive(idHive, range).subscribe(
      (_hint) => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          console.error('RANGE CHANGED');
          const index = option.series.map(_serie => _serie.name).indexOf(type.name);
          option.series[index].data = _hint.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
        } else {
          if (this.existSeries(option.series, type.unit, idHive)) {
            option.series = new Array();
            console.log('CLEAR');
          }
          // this.cleanChartsInstance(chartInstance, type.name);
          let serie = Object.assign({}, SERIES.line);
          serie.name = type.name;
          serie.data = _hint.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
          // option.tooltip = this.getTooltipBySerie(chartName);
          option.series.push(serie);
          console.log(option);
        }
        chartInstance.setOption(option);
        this.baseOpions = option;
        console.log(chartInstance.getOption());
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(idHive);
        this.incrementeCharComplete();

      }
    )
  }

  

  getChartBatInt(type: Tools, idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getBatIntByHive(idHive, range).subscribe(
      _batInt => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          console.error('RANGE CHANGED');
          const index = option.series.map(_serie => _serie.name).indexOf(type.name);
          option.series[index].data = _batInt.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
        } else {
          if (this.existSeries(option.series, type.unit, idHive)) {
            option.series = new Array();
            console.log('CLEAR');
          }
          // this.cleanChartsInstance(chartInstance, type.name);
          let serie = Object.assign({}, SERIES.line);
          serie.name = type.name;
          serie.data = _batInt.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
          // option.tooltip = this.getTooltipBySerie(chartName);
          option.series.push(serie);
          console.log(option);
        }
        chartInstance.setOption(option);
        this.baseOpions = option;
        console.log(chartInstance.getOption());
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(idHive);
        this.incrementeCharComplete();

      }
    )
  }

  getChartBatExt(type: Tools, idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getBatExtByHive(idHive, range).subscribe(
      _batExt => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          console.error('RANGE CHANGED');
          const index = option.series.map(_serie => _serie.name).indexOf(type.name);
          option.series[index].data = _batExt.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
        } else {
          if (this.existSeries(option.series, type.unit, idHive)) {
            option.series = new Array();
            console.log('CLEAR');
          }
          // this.cleanChartsInstance(chartInstance, type.name);
          let serie = Object.assign({}, SERIES.line);
          serie.name = type.name;
          serie.data = _batExt.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
          // option.tooltip = this.getTooltipBySerie(chartName);
          option.series.push(serie);
          console.log(option);
        }
        chartInstance.setOption(option);
        this.baseOpions = option;
        console.log(chartInstance.getOption());
        this.setCurrentUnite(type.unit);
        this.setCurrentHive(idHive);
        this.incrementeCharComplete();

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

  /**
   *
   *
   * @param {*} echartInstance
   * @param {string} seriesName
   * @memberof HourlyManagerService
   */
  removeSeriesFromChartInstance(echartInstance: any, seriesName: string): void {
    let option = echartInstance.getOption();
    const indexSerie = option.series.map(_serie => _serie.name).indexOf(seriesName);
    this.baseOpions.series.splice(indexSerie, 1);
    option.series.splice(indexSerie, 1);
    // echartInstance.clear();   
    echartInstance.setOption(option, true);
    console.log(echartInstance.getOption());
    console.log(option.series);

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
   * @param {Date[]} range
   * @memberof HourlyManagerService
   */
  public setNewRange(range: Date[]): void {
    this.currentRange = range;
  }

  /**
   *
   *
   * @memberof HourlyManagerService
   */
  private checkAllChartIsComplete(): void {
    this.subjectCountChartComplete.subscribe(
      _value => {
        console.log(this.baseOpions);
        if (this.numberChartAcive === _value) {
          this.subjectCountChartComplete.complete();
        }
      }
    )
  }

  private incrementeCharComplete(): void {
    this.numberChartAcive ++;
    this.subjectCountChartComplete.next(this.numberChartAcive);
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
}
