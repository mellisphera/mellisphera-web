import { Injectable } from '@angular/core';
import { RecordService } from '../../../apiary/ruche-rucher/ruche-detail/service/Record/record.service';
import { BASE_OPTIONS } from '../../charts/BASE_OPTIONS';
import { SERIES } from '../../charts/SERIES';
import { Record } from '../../../../_model/record';

@Injectable({
  providedIn: 'root'
})
export class HourlyManagerService {

  public baseOpions: any;
  constructor(
    private recordService: RecordService
  ) {
    this.baseOpions = BASE_OPTIONS.basepPtions;
  }

  getChartWeight(idHive: string, chartInstance: any, range: Date[]){
    this.recordService.getWeightByHive(idHive, range).subscribe(
      (_weight: Record[]) => {
        console.log(_weight);
        let option = chartInstance.getOption();
        if (option.series.length > 0) {
          option.series = new Array();
        }
        option = Object.assign(option , BASE_OPTIONS.line);
        console.log(option);
        option.xAxis[0].type = 'time';
        option.grid[0].left = '0%';
        console.log(BASE_OPTIONS.line);
        option.series.push(Object.assign({}, SERIES.line));
        option.series[0].data =_weight.map((elt: Record) => {
          return { name: elt.recordDate, value: [elt.recordDate, elt.weight]};
        });
        chartInstance.clear();
        chartInstance.setOption(option);
        this.baseOpions = option;
      }
    )

  }
}
