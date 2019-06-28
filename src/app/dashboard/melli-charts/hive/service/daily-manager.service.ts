import { Injectable } from '@angular/core';
import { DailyRecordsWService } from '../../../apiary/ruche-rucher/ruche-detail/service/daily-records-w.service';
import { DailyRecordService } from '../../../service/dailyRecordService';
import { DailyStockHoneyService } from '../../../apiary/ruche-rucher/ruche-detail/service/daily-stock-honey.service';
import { BASE_OPTIONS } from '../../charts/BASE_OPTIONS';
import { CALENDAR } from '../../charts/CALENDAR';
import { SERIES } from '../../charts/SERIES';
import { UnitService } from '../../../service/unit.service';
import { WEIGHT_CHARTS } from '../../charts/weight/WEIGHT_CHART';
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';

@Injectable({
  providedIn: 'root'
})
export class DailyManagerService {

  public baseOpions: any;
  constructor(
    private dailyWService: DailyRecordsWService,
    private dailyHService: DailyRecordService,
    private graphGlobal: GraphGlobal,
    private dailyStock: DailyStockHoneyService,
    private unitService: UnitService
  ) {
    this.baseOpions = BASE_OPTIONS.baseOptionDaily;
  }


  getChartWeightincome(idHive: string, echartsInstance: any, range: Date[]) {
    this.dailyWService.getDailyRecordsWbyHiveForMelliCharts(idHive).subscribe(
      _daliW => {
        let option = echartsInstance.getOption()
        option.calendar = CALENDAR.calendar;
        option.calendar.range = range;
        option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
        option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        console.log(option.calendar.dayLabel);
        if (option.series.length > 0) {
          option.series = new Array();
        }
        option.tooltip = WEIGHT_CHARTS.tooltipWeightCalendar;
        option.tooltip.formatter = (params: any) => {
          return params.marker + this.unitService.getDailyDate(params.data[0].split('T')[0]) +
            '<br/>' + params.seriesName + ' : ' + this.graphGlobal.getNumberFormat(this.unitService.getValRound(params.data[1])) + ' ' + this.graphGlobal.weight.unitW;
        };
        option.series.push(Object.assign({}, SERIES.effectScatter));
        option.series[0].name = 'gain';
        option.series[0].coordinateSystem = 'calendar';
        option.series[0].data = _daliW.weightIncomeHight;
        option.series[0].itemStyle = {
          normal: {
            color: '#00FE0C'
          }
        };
        option.series[0].symbolSize = (val: Array<any>) => {
          if (val[1] >= 0) {
            if (this.unitService.getUserPref().unitSystem === 'METRIC') {
              return (0.5 * Math.sqrt((1000 * val[1])));
            } else {
              return (0.5 * Math.sqrt((1000 * val[1] * 0.45)));
            }
          }
          return 0;
        };

        option.series.push(Object.assign({}, SERIES.effectScatter));
        console.log(option.series[1]);
        option.series[1].name = 'loss';
        option.series[1].coordinateSystem = 'calendar';
        option.series[1].data = _daliW.weightIncomeLow;
        option.series[1].itemStyle = {
          normal: {
            color: '#FE0000'
          }
        };
        option.series[1].symbolSize = (val: Array<any>) => {
          if (val[1] < 0) {
            if (this.unitService.getUserPref().unitSystem === 'METRIC') {
              return (0.5 * Math.sqrt(Math.abs(1000 * val[1])));
            } else {
              return (0.5 * Math.sqrt(Math.abs(1000 * val[1] * 0.45)));
            }
          }
          return 0;
        },
          option.legend[0].data = ['gain', 'loss'];
        echartsInstance.clear();
        console.log(option);
        echartsInstance.setOption(option);
        this.baseOpions = option;
      }
    )
  }
}
