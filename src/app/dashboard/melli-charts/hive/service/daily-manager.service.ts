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
import { isUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class DailyManagerService {

  public baseOpions: any;
  private currentRange: Date[];
  constructor(
    private dailyWService: DailyRecordsWService,
    private dailyHService: DailyRecordService,
    private graphGlobal: GraphGlobal,
    private dailyStock: DailyStockHoneyService,
    private unitService: UnitService
  ) {
    this.baseOpions = Object.assign({}, BASE_OPTIONS.baseOptionDaily);
  }


  getChartWeightincome(idHive: string, chartInstance: any, range: Date[]) {
    this.dailyWService.getDailyRecordsWbyHiveForMelliCharts(idHive).subscribe(
      _daliW => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
          option.series[0].data = _daliW.weightIncomeHight;
          option.series[1].data = _daliW.weightIncomeLow;
        } else {
          if (this.existSeries(option.series, 'tMax')) {
            option.series = new Array();
          }
          this.cleanChartsInstance(chartInstance, 'tMax');
          let seriesGain = Object.assign({}, SERIES.effectScatter);
          let seriesLoss= Object.assign({}, SERIES.effectScatter);
          /** First serie */
          seriesGain.name = 'gain';
          seriesGain.coordinateSystem = 'calendar';
          seriesGain.data = _daliW.weightIncomeHight;
          seriesGain.itemStyle = {
            normal: {
              color: '#00FE0C'
            }
          };
          seriesGain.symbolSize = (val: Array<any>) => {
            if (val[1] >= 0) {
              if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                return (0.5 * Math.sqrt((1000 * val[1])));
              } else {
                return (0.5 * Math.sqrt((1000 * val[1] * 0.45)));
              }
            }
            return 0;
          }
          /** Second serie */
          seriesLoss.name = 'loss';
          seriesLoss.coordinateSystem = 'calendar';
          seriesLoss.data = _daliW.weightIncomeLow;
          seriesLoss.itemStyle = {
            normal: {
              color: '#FE0000'
            }
          };
          seriesLoss.symbolSize = (val: Array<any>) => {
            if (val[1] < 0) {
              if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                return (0.5 * Math.sqrt(Math.abs(1000 * val[1])));
              } else {
                return (0.5 * Math.sqrt(Math.abs(1000 * val[1] * 0.45)));
              }
            }
            return 0;
          };
          option.series.push(seriesGain);
          option.series.push(seriesLoss);
          option.calendar.range = range;
        }
        this.currentRange = range;
        chartInstance.setOption(option);
        this.baseOpions = option;
        console.log(chartInstance.getOption());

      }
    )
  }

  getChartTmax(idHive: string, chartInstance: any, range: Date[]) {
    this.dailyHService.getTmaxByHive(idHive, range).subscribe(
      _tMax => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
         option.series[0].data = _tMax.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, 'tMax')) {
            option.series = new Array();
          }
          this.cleanChartsInstance(chartInstance, 'tMax');
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _tMax.map(_data => new Array(_data.date, _data.value));
          option.visualMap = this.getVisualMapBySerie('tMax');
          option.calendar.range = range;
          option.series.push(serie);
        }
        this.currentRange = range;
        chartInstance.setOption(option);
        this.baseOpions = option;
        console.log(chartInstance.getOption());

      }
    )
  }

  getChartHint(idHive: string, chartInstance: any, range: Date[]) {
    this.dailyHService.getHintByHive(idHive, range).subscribe(
      _hInt => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
         option.series[0].data = _hInt.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, 'hInt')) {
            option.series = new Array();
          }
          this.cleanChartsInstance(chartInstance, 'hInt');
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _hInt.map(_data => new Array(_data.date, _data.value));
          option.visualMap = this.getVisualMapBySerie('hInt');
          option.calendar.range = range;
          option.series.push(serie);
        }
        this.currentRange = range;
        chartInstance.setOption(option);
        this.baseOpions = option;
        console.log(chartInstance.getOption());

      }
    )
  }

  existSeries(serieArray, name: string): boolean {
    if (isUndefined(serieArray) || serieArray.length < 1 || serieArray.filter(_filter => _filter.name != name).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  cleanChartsInstance(chartInstance: any, labelSerie: string) {
    if (chartInstance.getOption().series.filter(_filter => _filter.name !== labelSerie).length > 0) {
      this.baseOpions = Object.assign({}, BASE_OPTIONS.baseOptionDaily);
      console.log(this.baseOpions);
    }
  }
  getVisualMapBySerie(serieLabel: string): any {
    let visualMap = Object.assign({}, CALENDAR.visualMap);
    switch(serieLabel) {
      case 'tMax':
        visualMap.type = 'continuous';
        visualMap.min = this.unitService.getUserPref().unitSystem === 'METRIC' ? -10 : 50;
        visualMap.max = this.unitService.getUserPref().unitSystem === 'METRIC' ? 40 : 100;
        visualMap.inRange.color = ['#313695', '#4575b4', '#74add1',
         '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
        break;
      case 'hInt':
        visualMap.type = 'piecewise',
        visualMap.pieces = [
          { min: 20, max: 50 },
          { min: 50, max: 75 },
          { min: 75, max: 87 },
          { min: 87, max: 100 }];
          visualMap.inRange.color =  ['#97A6C5', '#6987C5', '#3C68C5', '#05489B'];
        break;
      default:
      break;
    }
    return visualMap;
  }

  ifRangeChanged(range: Date[]): boolean {
    if (isUndefined(this.currentRange) || (this.currentRange[0] === range[0] && this.currentRange[1] === range[1])) {
     return false;
    } else {
      return true;
    }
 }
}
