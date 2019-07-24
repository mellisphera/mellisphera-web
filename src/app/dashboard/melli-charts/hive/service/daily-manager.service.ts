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
import { isUndefined, isArray } from 'util';
import { WeatherService } from '../../../service/api/weather.service';
import { ICONS_WEATHER } from '../../charts/icons/icons_weather';
import { Observable } from 'rxjs';
import { AstroService } from '../../service/astro.service';
import { ICONS_ASTRO } from '../../charts/icons/icons_astro';


interface Tools {
  name: string;
  id: string;
  origin: string;
  type?: string;
  unit?: string;
  class: string;
  icons?: string;
}

const DEVICE = 'DEVICE';
const OTHER = 'OTHER';

@Injectable({
  providedIn: 'root'
})
export class DailyManagerService {

  public baseOptionsInt: any;
  public baseOptionExt: any;
  private optionForCurentChart: any;
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
    this.baseOptionsInt = Object.assign({}, BASE_OPTIONS.baseOptionDaily);
    this.baseOptionExt = Object.assign({}, BASE_OPTIONS.baseOptionDaily);
  }




  getValueBySerie(_value :any, name: string): Array<any> {
    let value: any = {};
    if (isArray(_value)) {
      _value.forEach(elt => {
        value = Object.assign(value, elt);
      })
    } else {
      value = _value;
    }
    switch(name) {
      case 'WEATHER':
        return new Array(value.iconDay, value.maxTempDay, value.minTempDay);
        break;
      case 'RAIN':
        return new Array('' + value.rainDay);
        break;
      default:
        return [value];
        break;
    }
  }


  getSerieByData(data: Array<any>, nameSerie: string, serieTemplate: any, next: Function): void {
    let sensorRef: Array<string> = [];
    data.forEach((_data) => {
      if (sensorRef.indexOf(_data.sensorRef) === -1) {
        sensorRef.push(_data.sensorRef);
        let serieTmp = Object.assign({}, serieTemplate);
        serieTmp.name = nameSerie + ' | ' + _data.sensorRef;
        if (data.map(_elt => _elt.date)[0] !== undefined) {
          serieTmp.data = data.filter(_filter => _filter.sensorRef === _data.sensorRef).map(_map => {
            return [_map.date].concat(this.getValueBySerie(_map.value, nameSerie),  _map.sensorRef);
          });
        } else {
          console.log('not object');
          serieTmp.data = data;
        }
        next(serieTmp);
      }
    });
  }

  getChartDailyWeather(type: Tools, idApiary: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    const weatherObs: Array<Observable<any>> = [this.weatherService.getCurrentDailyWeather(idApiary, range), this.weatherService.getForecastDailyWeather(idApiary, range)];
    Observable.forkJoin(weatherObs).map(_elt => _elt.flat()).subscribe(
      _weather => {
        let option = Object.assign({}, this.baseOptionExt);
        if (rangeChange) {
          console.error('RANGE CHANGED');
          this.getSerieByData(_weather, type.name, SERIES.custom, (serieComplete: any) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            serieComplete.renderItem = (params, api) => {
              let cellPoint = api.coord(api.value(0));
              let cellWidth = params.coordSys.cellWidth;
              let cellHeight = params.coordSys.cellHeight;
              return {
                  type: 'group',
                  children: [
                    {
                      type: 'path',
                      z2: 1000 ,
                      shape: {
                        pathData: ICONS_WEATHER[api.value(1)],
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
            option.series[index] = serieComplete;
          })
          option.calendar.range = range;
          // option.series[0].data = _weather.map(_data => new Array<any>(_data.date, _data.weather['mainDay'], _data.weather['iconDay'],  _data.main));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          option.legend = Object.assign({}, BASE_OPTIONS.legend);
          option.legend.selectedMode = 'single';
          // option.legend.selectedMode = 'single';
          this.getSerieByData(_weather, type.name, SERIES.custom, (serieComplete) => {
            serieComplete.renderItem = (params, api) => {
              let cellPoint = api.coord(api.value(0));
              let cellWidth = params.coordSys.cellWidth;
              let cellHeight = params.coordSys.cellHeight;
              return {
                  type: 'group',
                  children: [
                    {
                      type: 'path',
                      z2: 1000 ,
                      shape: {
                        pathData: ICONS_WEATHER[api.value(1)],
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
            option.legend.data.push(serieComplete.name)
            option.series.push(serieComplete);
          })

          option.tooltip = this.getTooltipBySerie(type.name);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.dayLabel.align = 'left';
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.visualMap = null;
        }
        console.log(option);
        chartInstance.clear();
        chartInstance.setOption(option, true);
        this.baseOptionExt = option;

      }
    )
  }
  getChartAstro(type: Tools, idApiary: string, chartInstance: any, range: Date[], changeRange: boolean) {
    this.astroService.getAstroByApiary(idApiary, range).subscribe(
      _astro => {
        let option = Object.assign({}, this.baseOptionExt);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
          option.series[0].data = _astro.map(_data => new Array<any>(_data.date, _data.moon['phase_name'], _data.moon['ascendant']));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.custom);
          serie.name = type.name;
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
          option.tooltip = this.getTooltipBySerie(type.name);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.dayLabel.align = 'left';
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.visualMap = null;
          option.series.push(serie);
        }
        
        chartInstance.clear();
        chartInstance.setOption(option, true);
        this.baseOptionExt = option;
        // this.setOriginChartOption(type.origin);

      }
    )
  }
  getChartWeightincome(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyWService.getDailyRecordsWbyHiveForMelliCharts(idHive).subscribe(
      _daliW => {
        let option = Object.assign({}, this.baseOptionsInt);
        console.log(_daliW);
        if (rangeChange) {
          this.getSerieByData(_daliW.weightIncomeHight, 'gain', SERIES.effectScatter, (serieComplete: any) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            serieComplete.itemStyle = {
              normal: {
                color: '#00FE0C'
              }
            };
            serieComplete.symbolSize = (val: Array<any>) => {
              if (val[1] >= 0) {
                if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                  return (0.5 * Math.sqrt((1000 * val[1])));
                } else {
                  return (0.5 * Math.sqrt((1000 * val[1] * 0.45)));
                }
              }
              return 0;
            }
            option.series[index] = serieComplete;
            
          });
          this.getSerieByData(_daliW.weightIncomeLow, 'loss', SERIES.effectScatter, (serieComplete: any) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            serieComplete.itemStyle = {
              normal: {
                color: '#FE0000'
              }
            };
            serieComplete.symbolSize = (val: Array<any>) => {
              if (val[1] < 0) {
                if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                  return (0.5 * Math.sqrt(Math.abs(1000 * val[1])));
                } else {
                  return (0.5 * Math.sqrt(Math.abs(1000 * val[1] * 0.45)));
                }
              }
              return 0;
            };
            option.series[index] = serieComplete;
          })
          option.calendar.range  = range;
        } else {
          if (this.existSeries(option.series, 'gain')) {
            option.series = new Array();
          }
          option.legend = Object.assign({}, BASE_OPTIONS.legend);
          option.legend.selectedMode = 'multiple';
          this.getSerieByData(_daliW.weightIncomeHight, 'gain', SERIES.effectScatter, (serieComplete) => {
            option.legend.data.push(serieComplete.name);
            serieComplete.itemStyle = {
              normal: {
                color: '#00FE0C'
              }
            };
            serieComplete.symbolSize = (val: Array<any>) => {
              if (val[1] >= 0) {
                if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                  return (0.5 * Math.sqrt((1000 * val[1])));
                } else {
                  return (0.5 * Math.sqrt((1000 * val[1] * 0.45)));
                }
              }
              return 0;
            }
            option.series.push(serieComplete);
          });

          this.getSerieByData(_daliW.weightIncomeLow, 'loss', SERIES.effectScatter, (serieComplete) => {
            option.legend.data.push(serieComplete.name);
            serieComplete.itemStyle = {
              normal: {
                color: '#FE0000'
              }
            };
            serieComplete.symbolSize = (val: Array<any>) => {
              if (val[1] < 0) {
                if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                  return (0.5 * Math.sqrt(Math.abs(1000 * val[1])));
                } else {
                  return (0.5 * Math.sqrt(Math.abs(1000 * val[1] * 0.45)));
                }
              }
              return 0;
            };
            option.series.push(serieComplete);
          });
          option.visualMap = null;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.tooltip = this.getTooltipBySerie('Weight');
          option.calendar.range = range;
        }
        console.log(option);
        chartInstance.setOption(option, true);
        this.baseOptionsInt = option;
      }
    )
  }

  getRainByApiary(type: Tools, idApiary: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    const obs: Array<Observable<any>> = [
      this.weatherService.getRainCurrentDailyWeather(idApiary, range),
      this.weatherService.getRainForecastDailyWeather(idApiary, range)
    ];
    Observable.forkJoin(obs).map(_elt => _elt.flat()).subscribe(
      _rain => {
        let option = Object.assign({}, this.baseOptionExt);
        if (rangeChange) {
          console.error('RANGE CHANGED');
          this.getSerieByData(_rain, type.name, SERIES.effectScatter, (serieComplete: any) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            serieComplete.itemStyle = {
              normal: {
                color: '#00FE0C'
              }
            };
            serieComplete.symbolSize = (val: any[]) => {
              return val[1];
            };
            option.series[index] = serieComplete;
          });
          option.calendar.range  = range;
        } else {
          option.lengend = Object.assign({}, BASE_OPTIONS.legend);
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          this.getSerieByData(_rain, type.name, SERIES.effectScatter, (serieComplete) => {
            option.legend.data.push(serieComplete.name);
            serieComplete.itemStyle = {
              normal: {
                color: '#00FE0C'
              }
            };
            serieComplete.symbolSize = (val: any[]) => {
              return val[1];
            };
            option.series.push(serieComplete);
          })
    
          option.visualMap = null;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          // option.tooltip = this.getTooltipBySerie(type.name);
          option.calendar.range = range;
        }
        
        chartInstance.setOption(option, true);
        this.baseOptionExt = option;
      }
    )
  }

  getChartTintMax(type: Tools, idHive: string, chartInstance: any, range: Date[]) {
    this.dailyHService.getTempIntMaxByHive(idHive, range).subscribe(
      _tMax => {
        let option = Object.assign({}, this.baseOptionsInt);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
          option.series[0].data = _tMax.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.name = type.name;
          serie.data = _tMax.map(_data => new Array(_data.date, _data.value));
          option.visualMap = this.getVisualMapBySerie(type.name);
          option.tooltip = this.getTooltipBySerie(type.name);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.series.push(serie);
        }
        
        chartInstance.setOption(option, true);
        this.baseOptionsInt = option;

      }
    )
  }

  getChartTextMax(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyWService.getTempMaxExt(idHive, range).subscribe(
      _tmpMaxExt => {
        let option = Object.assign({}, this.baseOptionsInt);
        if(rangeChange) {
          console.error('RANGE CHANGED');
          this.getSerieByData(_tmpMaxExt, type.name, SERIES.heatmap, (serieComplete: any) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index] = serieComplete;
          })
          option.calendar.range = range;
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          this.getSerieByData(_tmpMaxExt, type.name, SERIES.heatmap, (serieComplete) => {
            option.series.push(serieComplete);
            console.log(serieComplete);
          })
          option.visualMap = this.getVisualMapBySerie(type.name);
          option.tooltip = this.getTooltipBySerie(type.name);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        }
        
        chartInstance.setOption(option, true);
        this.baseOptionsInt = option;

      }
    )
  }
  getChartTextMin(type: Tools, idHive: string, chartInstance: any, range: Date[]) {
    this.dailyWService.getTempMinExt(idHive, range).subscribe(
      _tMinExt => {
        let option = Object.assign({}, this.baseOptionsInt);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
          option.series[0].data = _tMinExt.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, '52')) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _tMinExt.map(_data => new Array(_data.date, _data.value));
          serie.name = type.name;
          option.visualMap = this.getVisualMapBySerie(type.name);
          option.tooltip = this.getTooltipBySerie(type.name);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.calendar.range = range;
          option.series.push(serie);
        }
        
        chartInstance.setOption(option, true);
        this.baseOptionsInt = option;
      }
    )
  }
  getChartHint(type: Tools, idHive: string, chartInstance: any, range: Date[]) {
    this.dailyHService.getHintByHive(idHive, range).subscribe(
      _hInt => {
        let option = Object.assign({}, this.baseOptionsInt);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
          option.series[0].data = _hInt.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _hInt.map(_data => new Array(_data.date, _data.value));
          option.tooltip = this.getTooltipBySerie(type.name);
          option.visualMap = this.getVisualMapBySerie(type.name);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.calendar.range = range;
          option.series.push(serie);
        }
        
        chartInstance.setOption(option, true);
        this.baseOptionsInt = option;

      }
    )
  }
  getChartBrood(type: Tools, idHive: string, chartInstance: any, range: Date[]) {
    this.dailyHService.getBroodByHive(idHive, range).subscribe(
      _brood => {
        let option = Object.assign({}, this.baseOptionsInt);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
          option.series[0].data = _brood.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _brood.map(_data => new Array(_data.date, _data.value));
          option.visualMap = this.getVisualMapBySerie(type.name);
          option.tooltip = this.getTooltipBySerie(type.name);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.calendar.range = range;
          option.series.push(serie);
        }
        
        chartInstance.setOption(option, true);
        this.baseOptionsInt = option;

      }
    )
  }

  getChartTminInt(type: Tools, idHive: string, chartInstance: any, range: Date[]) {
    this.dailyHService.getTminByHive(idHive, range).subscribe(
      _tMin => {
        let option = Object.assign({}, this.baseOptionsInt);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
          option.series[0].data = _tMin.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _tMin.map(_data => new Array(_data.date, _data.value));
          serie.name = type.name;
          option.visualMap = this.getVisualMapBySerie(type.name);
          option.tooltip = this.getTooltipBySerie(type.name);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.calendar.range = range;
          option.series.push(serie);
        }
        chartInstance.setOption(option, true);
        this.baseOptionsInt = option;
      }
    )
  }

  getChartWeight(type: Tools, idHive: string, chartInstance: any, range: Date[]){
    this.dailyWService.getWeightByHive(idHive, range).subscribe(
      _weightMax => {
        let option = Object.assign({}, this.baseOptionsInt);
        if(this.ifRangeChanged(range)) {
          option.calendar.range = range;
        option.series[0].data = _weightMax.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _weightMax.map(_data => new Array(_data.date, _data.value));
          option.visualMap = this.getVisualMapBySerie(type.name);
          option.tooltip = this.getTooltipBySerie(type.name);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.calendar.range = range;
          option.series.push(serie);
        }
        
        chartInstance.setOption(option, true);
        this.baseOptionsInt = option;
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
    }
    if (isUndefined(serieArray) || serieArray.length < 1 || serieArray.length > 0) {
      return true;
    } else {
      return false;
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
            return params.marker  + this.unitService.getDailyDate(params.data[0]) +
            ': </br>' +
            ' TempMax: ' +this.graphGlobal.getNumberFormat(params.data[2]) + '</br>' +
            ' TempMin: ' +this.graphGlobal.getNumberFormat(params.data[3]);
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

  getRenderItemFunction(data: any[]): Function {
    return (params, api) => {
      let cellPoint = api.coord(api.value(0));
      let cellWidth = params.coordSys.cellWidth;
      let cellHeight = params.coordSys.cellHeight;
      return {
          type: 'group',
          children: [
            {
              type: 'path',
              z2: 1000 ,
              shape: {
                pathData: ICONS_WEATHER[api.value(1)],
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
  }
  /**
   *
   *
   * @param {Date[]} range
   * @memberof DailyManagerService
   */
  setCurrentRange(range: Date[]): void {
    
  }
}

