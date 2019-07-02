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

  getChartWeight(idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getWeightByHive(idHive, range).subscribe(
      (_weight: any) => {
        console.log(_weight);
        let option = this.baseOpions;
        if (this.ifRangeChanged(range)) {
          option.series[0].data = _weight.map((elt) => {
            return { name: elt.date, value: [elt.date, elt.value] };
          });
        } else {
          if(!this.existSeries(option.series, 'Weight')) {
            console.log('NEW');
            option.series = new Array();
            option.yAxis = new Array();
          }
          let series = Object.assign({}, SERIES.line);
          series.name = 'Weight';
          series.data = _weight.map((elt) => {
            return { name: elt.date, value: [elt.date, elt.value] };
          });
          option = this.addYaxis(option, 'Weight');
          series.yAxisIndex = option.yAxis.length - 1;
          console.log(option);
          option.series.push(series);
        }
        chartInstance.setOption(option);

        this.baseOpions = option;
        this.currentRange = range;

      }
      
    )
  }


  getChartTempInt(idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getTempIntByHive(idHive, range).subscribe(
      (_temp) => {
        console.log(_temp);
        let option = this.baseOpions;
        if (this.ifRangeChanged(range)) {
          option.series[0].data = _temp.map((elt) => {
            return { name: elt.date, value: [elt.date, elt.value] };
          });
        } else {
          if(!this.existSeries(option.series, 'Temp')) {
            console.log('NEW');
            option.series = new Array();
            option.yAxis = new Array();
          }
          console.log(option.series);
          let series = Object.assign({}, SERIES.line);
          series.name = 'Temp';
          series.data = _temp.map((elt) => {
            return { name: elt.date, value: [elt.date, elt.value] };
          })
          option = this.addYaxis(option, 'Temp');
          console.log(option.yAxis.length);
          series.yAxisIndex = option.yAxis.length - 1;
          option.series.push(series);
        }
        chartInstance.setOption(option);

        this.baseOpions = option;
        this.currentRange = range;

      }
    )
  }

  addYaxis(option: any, serieLabel: string): any {
    if(option.yAxis.filter(y => y.name === serieLabel).length < 1) {
      let yAxis = Object.assign({}, BASE_OPTIONS.yAxis);
      yAxis.name = serieLabel;
      option.yAxis.push(yAxis);
      return option;
    }
  }
  existSeries(serieArray, name: string): boolean {
    if (isUndefined(serieArray) || serieArray.length < 1 || serieArray.filter(_filter => _filter.name === name).length > 0) {
      return false;
    } else {
      return true;
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

}
