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
        let series = Object.assign({}, SERIES.line);
        let yAxis = Object.assign({}, BASE_OPTIONS);
        series.name = 'Weight';
        series.data = _weight.map((elt) => {
          return { name: elt.date, value: [elt.date, elt.value] };
        });
        console.log(!this.existSeries(option.series, 'Weight'));
        console.log(option.series);
        if(!this.existSeries(option.series, 'Weight')) {
          console.log('NEW');
          option.series = new Array();
        }
        option.series.push(series);
        console.log(this.baseOpions);
        console.log(option);
        chartInstance.setOption(option);

       // this.baseOpions = option;
      }
    )
  }


  getChartTempInt(idHive: string, chartInstance: any, range: Date[]) {
    this.recordService.getTempIntByHive(idHive, range).subscribe(
      (_temp) => {
        let option = chartInstance.getOption();
        let series = Object.assign({}, SERIES.line);
        let yAxis = Object.assign({}, BASE_OPTIONS);

      }
    )
  }

  existSeries(serieArray, name: string): boolean {
    if (isUndefined(serieArray) || serieArray.length < 0 || serieArray.filter(_filter => _filter.name === name).length > 0) {
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

}
