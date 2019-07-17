import { Injectable } from '@angular/core';
import { DailyRecordsWService } from '../../../apiary/ruche-rucher/ruche-detail/service/daily-records-w.service';
import { DailyRecordService } from '../../../service/api/dailyRecordService';
import { DailyStockHoneyService } from '../../../apiary/ruche-rucher/ruche-detail/service/daily-stock-honey.service';
import { BASE_OPTIONS } from '../../charts/BASE_OPTIONS';
import { CALENDAR } from '../../charts/CALENDAR';
import { SERIES } from '../../charts/SERIES';
import { UnitService } from '../../../service/unit.service';
import 'rxjs/add/observable/forkJoin';
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';
import { isUndefined } from 'util';
import { WeatherService } from '../../../service/api/weather.service';
import { ICONS_WEATHER } from '../../charts/icons/icons_weather';
import { Observable } from 'rxjs';
import { AstroService } from '../../service/astro.service';
import { ICONS_ASTRO } from '../../charts/icons/icons_astro';

@Injectable({
  providedIn: 'root'
})
export class DailyManagerService {

  public baseOpions: any;
  private currentRange: Date[];
  constructor(
    private dailyWService: DailyRecordsWService,
    private dailyHService: DailyRecordService,
    private weatherService: WeatherService,
    private graphGlobal: GraphGlobal,
    private astroService: AstroService,
    private dailyStock: DailyStockHoneyService,
    private unitService: UnitService
  ) {
    this.baseOpions = Object.assign({}, BASE_OPTIONS.baseOptionDaily);
  }

  getChartDailyWeather(chartName: string, idApiary: string, chartInstance: any, range: Date[]) {
    const weatherObs = [this.weatherService.getCurrentDailyWeather(idApiary, range), this.weatherService.getForecastDailyWeather(idApiary, range)];
    Observable.forkJoin(weatherObs).map(_elt => _elt.flat()).subscribe(
      _weather => {
        console.log(_weather);
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          console.log('range');
          option.calendar.range = range;
          option.series[0].data = _weather.map(_data => new Array<any>(_data.date, _data.weather['mainDay'], _data.weather['iconDay'],  _data.main));
        } else {
          if (this.existSeries(option.series, chartName)) {
            option.series = new Array();
            console.log('vide');
          }
          this.cleanChartsInstance(chartInstance, chartName);
          let serie = Object.assign({}, SERIES.custom);
          serie.name = chartName;
          serie.data = _weather.map(_data => new Array<any>(_data.date, _data.weather['mainDay'], _data.weather['iconDay'], _data.main));
          serie.renderItem = (params, api) => {
            let cellPoint = api.coord(api.value(0));
            let cellWidth = params.coordSys.cellWidth;
            let cellHeight = params.coordSys.cellHeight;
            let value = api.value(1);
            return {
                type: 'group',
                children: [
                  {
                    type: 'path',
                    z2: 1000 ,
                    shape: {
                      pathData: ICONS_WEATHER[api.value(2)],
                      x: -11,
                      y: -10,
                      width: 25,
                      height: 25
                  },
                  position: [cellPoint[0], cellPoint[1]],
                },
                {
                  type: 'rect',
                  z2: 0,
                  shape: {
                    x: -cellWidth / 2,
                    y: -cellHeight / 2,
                    width: cellWidth,
                    height: cellHeight,
                  },
                  position: [cellPoint[0], cellPoint[1]],
                  style: {
                    fill: this.getColorCalendarByValue(api.value(0)),
                    stroke: 'black'
                  }
                }
              ]
            };
          }
          option.tooltip = this.getTooltipBySerie(chartName);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.dayLabel.align = 'left';
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.visualMap = null;
          option.series.push(serie);
        }
        this.currentRange = range;
        chartInstance.clear();
        chartInstance.setOption(option);
        this.baseOpions = option;
        console.log(chartInstance.getOption());
      }
    )
  }

  getChartAstro(chartName: string, idApiary: string, chartInstance: any, range: Date[]) {
    this.astroService.getAstroByApiary(idApiary, range).subscribe(
      _astro => {
        console.log(_astro);
        console.log(_astro);
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          console.log('range');
          option.calendar.range = range;
          option.series[0].data = _astro.map(_data => new Array<any>(_data.date, _data.moon['phase_name'], _data.moon['ascendant']));
        } else {
          if (this.existSeries(option.series, chartName)) {
            option.series = new Array();
            console.log('vide');
          }
          this.cleanChartsInstance(chartInstance, chartName);
          let serie = Object.assign({}, SERIES.custom);
          serie.name = 'Weather';
          serie.data = _astro.map(_data => new Array<any>(_data.date, _data.moon['phase_name'], _data.moon['ascendant']));
          serie.renderItem = (params, api) => {
            let cellPoint = api.coord(api.value(0));
            let cellWidth = params.coordSys.cellWidth;
            let cellHeight = params.coordSys.cellHeight;
            let value = api.value(1);
            return {
                type: 'group',
                children: [
                  {
                    type: 'path',
                    z2: 1000 ,
                    shape: {
                      pathData: ICONS_ASTRO[api.value(1)],
                      x: -11,
                      y: -11,
                      width: 25,
                      height: 25
                  },
                  style: {
                    fill: (value === 'NEW_MOON') ? 'white' : 'black'
                  },
                  position: [cellPoint[0], cellPoint[1]],
                },
                 {
                   type: 'rect',
                   z2: 0,
                   shape: {
                     x: -cellWidth / 2,
                     y: -cellHeight / 2,
                     width: cellWidth,
                     height: cellHeight,
                   },
                   position: [cellPoint[0], cellPoint[1]],
                   style: {
                     fill: this.getColorCalendarByValue(api.value(0), api.value(2)),
                     stroke: 'black'
                   }
                 }
              ]
            };
          }
          option.tooltip = this.getTooltipBySerie(chartName);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.dayLabel.align = 'left';
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.visualMap = null;
          option.series.push(serie);
        }
        this.currentRange = range;
        chartInstance.clear();
        chartInstance.setOption(option, true);
        this.baseOpions = option;
        console.log(chartInstance.getOption());
      }
    )
  }
  getChartWeightincome(chartName: string, idHive: string, chartInstance: any, range: Date[]) {
    this.dailyWService.getDailyRecordsWbyHiveForMelliCharts(idHive).subscribe(
      _daliW => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
          option.series[0].data = _daliW.weightIncomeHight;
          option.series[1].data = _daliW.weightIncomeLow;
        } else {
          if (this.existSeries(option.series, 'gain')) {
            option.series = new Array();
          }
          this.cleanChartsInstance(chartInstance, 'gain');
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
          option.visualMap = null;
          option.legend.data = ['gain', 'loss'];
          console.log(option);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.tooltip = this.getTooltipBySerie('Weight');
          option.calendar.range = range;
        }
        this.currentRange = range;
        chartInstance.setOption(option);
        this.baseOpions = option;
        console.log(chartInstance.getOption());

      }
    )
  }

  getChartTintMax(chartName: string, idHive: string, chartInstance: any, range: Date[]) {
    this.dailyHService.getTempIntMaxByHive(idHive, range).subscribe(
      _tMax => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
          option.series[0].data = _tMax.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, chartName)) {
            option.series = new Array();
          }
          this.cleanChartsInstance(chartInstance, chartName);
          let serie = Object.assign({}, SERIES.heatmap);
          serie.name = chartName;
          serie.data = _tMax.map(_data => new Array(_data.date, _data.value));
          option.visualMap = this.getVisualMapBySerie(chartName);
          option.tooltip = this.getTooltipBySerie(chartName);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
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

  getChartTextMax(chartName: string, idHive: string, chartInstance: any, range: Date[]) {
    this.dailyWService.getTempMaxExt(idHive, range).subscribe(
      _tmpMaxExt => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
          option.series[0].data = _tmpMaxExt.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, chartName)) {
            option.series = new Array();
          }
          this.cleanChartsInstance(chartInstance, chartName);
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _tmpMaxExt.map(_data => new Array(_data.date, _data.value));
          option.visualMap = this.getVisualMapBySerie(chartName);
          option.tooltip = this.getTooltipBySerie(chartName);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
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
  getChartTextMin(chartName: string, idHive: string, chartInstance: any, range: Date[]) {
    this.dailyWService.getTempMinExt(idHive, range).subscribe(
      _tMinExt => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
          option.series[0].data = _tMinExt.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, '52')) {
            option.series = new Array();
          }
          this.cleanChartsInstance(chartInstance, chartName);
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _tMinExt.map(_data => new Array(_data.date, _data.value));
          serie.name = chartName;
          option.visualMap = this.getVisualMapBySerie(chartName);
          option.tooltip = this.getTooltipBySerie(chartName);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
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
  getChartHint(chartName: string, idHive: string, chartInstance: any, range: Date[]) {
    this.dailyHService.getHintByHive(idHive, range).subscribe(
      _hInt => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
          option.series[0].data = _hInt.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, chartName)) {
            option.series = new Array();
          }
          this.cleanChartsInstance(chartInstance, chartName);
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _hInt.map(_data => new Array(_data.date, _data.value));
          option.tooltip = this.getTooltipBySerie(chartName);
          option.visualMap = this.getVisualMapBySerie(chartName);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
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
  getChartBrood(chartName: string, idHive: string, chartInstance: any, range: Date[]) {
    this.dailyHService.getBroodByHive(idHive, range).subscribe(
      _brood => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
          option.series[0].data = _brood.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, chartName)) {
            option.series = new Array();
          }
          this.cleanChartsInstance(chartInstance, chartName);
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _brood.map(_data => new Array(_data.date, _data.value));
          option.visualMap = this.getVisualMapBySerie(chartName);
          option.tooltip = this.getTooltipBySerie(chartName);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
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

  getChartTminInt(chartName: string, idHive: string, chartInstance: any, range: Date[]) {
    this.dailyHService.getTminByHive(idHive, range).subscribe(
      _tMin => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
          option.series[0].data = _tMin.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, chartName)) {
            option.series = new Array();
          }
          this.cleanChartsInstance(chartInstance, chartName);
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _tMin.map(_data => new Array(_data.date, _data.value));
          serie.name = chartName;
          option.visualMap = this.getVisualMapBySerie(chartName);
          option.tooltip = this.getTooltipBySerie(chartName);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
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

  getChartWeight(chartName: string, idHive: string, chartInstance: any, range: Date[]){
    this.dailyWService.getWeightByHive(idHive, range).subscribe(
      _weightMax => {
        let option = Object.assign({}, this.baseOpions);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
        option.series[0].data = _weightMax.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, chartName)) {
            option.series = new Array();
          }
          this.cleanChartsInstance(chartInstance, chartName);
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _weightMax.map(_data => new Array(_data.date, _data.value));
          option.visualMap = this.getVisualMapBySerie(chartName);
          option.tooltip = this.getTooltipBySerie(chartName);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
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

  /**
   *
   *
   * @param {*} serieArray
   * @param {string} name
   * @returns {boolean}
   * @memberof DailyManagerService
   */
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

  cleanChartsInstance(chartInstance: any, labelSerie: string) {
    if (chartInstance.getOption().series.filter(_filter => _filter.name !== labelSerie).length > 0) {
      this.baseOpions = Object.assign({}, BASE_OPTIONS.baseOptionDaily);
    }
  }
  /**
   *
   *
   * @param {string} serieLabel
   * @returns {*}
   * @memberof DailyManagerService
   */
  getVisualMapBySerie(serieLabel: string): any {
    const visualMap = Object.assign({}, CALENDAR.visualMap);
    switch (serieLabel) {
      case 'WEIGHT_MAX':
          visualMap.type = 'continuous';
          visualMap.top = 15;
          visualMap.min = this.unitService.getUserPref().unitSystem === 'METRIC' ? 10 : 25;
          visualMap.max = this.unitService.getUserPref().unitSystem === 'METRIC' ? 100 : 220;
          visualMap.inRange.color = ['#313695', '#4575b4', '#74add1',
          '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
          break;
      case 'TEMP_INT_MAX':
        visualMap.type = 'continuous';
        visualMap.top = 15;
        visualMap.min = this.unitService.getUserPref().unitSystem === 'METRIC' ? -10 : 50;
        visualMap.max = this.unitService.getUserPref().unitSystem === 'METRIC' ? 40 : 100;
        visualMap.inRange.color = ['#313695', '#4575b4', '#74add1',
        '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
        break;
      case 'HRIN':
        visualMap.type = 'piecewise',
        visualMap.pieces = [
          { min: 20, max: 50 },
          { min: 50, max: 75 },
          { min: 75, max: 87 },
          { min: 87, max: 100 }];
          visualMap.top = 15;
          visualMap.inRange.color =  ['#97A6C5', '#6987C5', '#3C68C5', '#05489B'];
          break;
      case 'BROOD':
          visualMap.type = 'continuous';
          visualMap.min = 0;
          visualMap.max = 100;
          visualMap.inRange.color =  ['red', 'yellow', '#129001'];
          visualMap.top = 15;
          break;
      case 'TEMP_INT_MIN':
          visualMap.type = 'continuous';
          visualMap.top = 15;
          visualMap.min = this.unitService.getUserPref().unitSystem === 'METRIC' ? -10 : 50;
          visualMap.max = this.unitService.getUserPref().unitSystem === 'METRIC' ? 40 : 100;
          visualMap.inRange.color = ['#313695', '#4575b4', '#74add1',
          '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
          break;
      case 'TEMP_EXT_MAX':
          visualMap.type = 'continuous';
          visualMap.top = 15;
          visualMap.min = this.unitService.getUserPref().unitSystem === 'METRIC' ? -10 : 50;
          visualMap.max = this.unitService.getUserPref().unitSystem === 'METRIC' ? 40 : 100;
          visualMap.inRange.color = ['#313695', '#4575b4', '#74add1',
          '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
          break;
      case 'TEMP_EXT_MIN':
          visualMap.type = 'continuous';
          visualMap.top = 15;
          visualMap.min = this.unitService.getUserPref().unitSystem === 'METRIC' ? -10 : 50;
          visualMap.max = this.unitService.getUserPref().unitSystem === 'METRIC' ? 30 : 90;
          visualMap.inRange.color = ['#313695', '#4575b4', '#74add1',
          '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
      default:
      break;
    }
    return visualMap;
  }

  /**
   *
   *
   * @param {string} serieLabel
   * @returns {*}
   * @memberof DailyManagerService
   */
  getTooltipBySerie(serieLabel: string): any {
    const tooltip = Object.assign({}, BASE_OPTIONS.tooltip);

    switch(serieLabel) {
      case 'WEATHER':
          tooltip.formatter =  (params) => {
            console.log(params.data[3]);
            return params.marker  + this.unitService.getDailyDate(params.data[0]) +
            ': <b>' + this.graphGlobal.getNumberFormat(params.data[1]) + '</br>'
            + params.data[3]['maxHumidityDay'] + '</b>';
          }
          break;
      default:
          tooltip.formatter =  (params) => {
            return params.marker  + this.unitService.getDailyDate(params.data[0]) +
            ': <b>' + this.graphGlobal.getNumberFormat(params.data[1]) + ' '
             + this.graphGlobal.getUnitBySerieName(params.seriesName) + '</b>';
          }
    }
    return tooltip;
  }

  /**
   *
   *
   * @param {Date[]} range
   * @returns {boolean}
   * @memberof DailyManagerService
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
    * @param {Date} date
    * @returns {string}
    * @memberof DailyManagerService
    */
   getColorCalendarByValue(date: Date, optionValue?: any): string {
    let dateToday = new Date();
    let dateCalendar = new Date(date);
    dateToday.setHours(2);
    dateToday.setMinutes(0);
    dateToday.setSeconds(0);
    dateToday.setMilliseconds(0);
    if (dateCalendar.getTime() === dateToday.getTime()) {
      return '#FF2E2C';
    } else if (optionValue === 1) {
      return '#ABC0C5';
    } else {
      return '#EBEBEB';
    }
  }
}

