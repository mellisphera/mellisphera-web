import { Injectable } from '@angular/core';
import { RecordService } from '../../../apiary/ruche-rucher/ruche-detail/service/Record/record.service';
import { BASE_OPTIONS } from '../../charts/BASE_OPTIONS';
import { SERIES } from '../../charts/SERIES';
import { isUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class HourlyManagerService {

  public baseOpions: any;
  private currentRange: Date[];
  constructor(
    private recordService: RecordService
  ) {
    this.baseOpions = Object.assign(BASE_OPTIONS.baseOptionHourly);
  }

  getChartWeight(chartName: string, idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getWeightByHive(idHive, range).subscribe(
      (_weight: any) => {
        console.log(_weight);
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          const index = option.series.map(_serie => _serie.name).indexOf(chartName);
          option.series[index].data = _weight.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
        } else {
          if (this.existSeries(option.series, chartName)) {
            option.series = new Array();
          }
          this.cleanChartsInstance(chartInstance, chartName);
          let serie = Object.assign({}, SERIES.line);
          serie.name = chartName;
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

      }
      
    )
  }


  getChartTempInt(chartName: string, idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getTempIntByHive(idHive, range).subscribe(
      _temp => {
        console.log(_temp);
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          const index = option.series.map(_serie => _serie.name).indexOf(chartName);
          option.series[index].data = _temp.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
        } else {
          if (this.existSeries(option.series, chartName)) {
            option.series = new Array();
          }
          this.cleanChartsInstance(chartInstance, chartName);
          let serie = Object.assign({}, SERIES.line);
          serie.name = chartName;
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
      }
    );
  }

  getChartTempExt(chartName: string, idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getTempExtByHive(idHive, range).subscribe(
      _temp_ext => {
        console.log(_temp_ext);
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          const index = option.series.map(_serie => _serie.name).indexOf(chartName);
          option.series[index].data = _temp_ext.map(_data => {
            return {name: _data.date, value: [_data.date, _data.value]};
          });
        } else {
          if (this.existSeries(option.series, chartName)) {
            option.series = new Array();
          }
           this.cleanChartsInstance(chartInstance, chartName);
          let serie = Object.assign({}, SERIES.line);
          serie.name = chartName;
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
      }
    )
  }



  cleanChartsInstance(chartInstance: any, labelSerie: string) {
    if (chartInstance.getOption().series.filter(_filter => _filter.name !== labelSerie).length > 0) {
      this.baseOpions = Object.assign({}, BASE_OPTIONS.baseOptionDaily);
    }
  }

  existSeries(serieArray, name: string): boolean {
    if (!isUndefined(serieArray)) {
      console.log(serieArray);
    }
    if (isUndefined(serieArray) || serieArray.length < 1 || serieArray.length > 0) {
      return true;
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
}
