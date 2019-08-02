import { Injectable } from '@angular/core';
import { DailyRecordsWService } from '../../../service/api/daily-records-w.service';
import { DailyRecordService } from '../../../service/api/dailyRecordService';
import { DailyStockHoneyService } from '../../../service/api/daily-stock-honey.service';
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
import { _localeFactory } from '@angular/core/src/application_module';
import 'rxjs/add/observable/of';



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
  public meanPeriodDevice: {
    value: Number,
    unit: String
  };
  private rangeSevenDay: Date[];
  public meanPeriodOther: {
    value: Number,
    unit: String
  };
  public meanDeviceSevenDay: {
    value: Number,
    unit: String
  };
  public meanOtherSevenDay: {
    value: Number,
    unit: String
  };
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
    this.meanPeriodDevice = {
      
      value: 0,
      unit: ''
    };
    this.meanPeriodOther = {
      value: 0,
      unit: ''
    };
    this.meanDeviceSevenDay = {
      value: 0,
      unit: ''
    }
    this.meanOtherSevenDay = {
      value: 0,
      unit: ''
    }

    this.baseOptionsInt = Object.assign({}, BASE_OPTIONS.baseOptionDaily);
    this.baseOptionExt = Object.assign({}, BASE_OPTIONS.baseOptionDaily);
    const dateNowLastSevenDay = new Date();
    dateNowLastSevenDay.setDate(new Date().getDate() - 8);
    this.rangeSevenDay = [
      dateNowLastSevenDay,
      new Date()
    ];
    console.log(this.rangeSevenDay);
  }

  /**
   *
   *
   * @param {Observable<any>} observable
   * @memberof DailyManagerService
   * @description Get mean value for melliCharts html
   */
  getLastDayForMeanValue(observable: Observable<any>, mean: boolean, type: Tools): void {
    observable.map(_serie => {
      if (type.name === 'RAIN') {
        return _serie.flat().map(_elt => _elt.value);
      } else if (type.name = 'WINCOME') {
        return _serie.weightIncomeHight.map(_elt => _elt.value).concat(_serie.weightIncomeLow.map(_elt => _elt.value));
      }
    }).subscribe(
      _data => {
        console.log(_data);
        if (type.name === 'RAIN' || type.name === 'WINCOME') {
          this.setMeanSevenDay(_data, false, type);
        } else {
          this.setMeanSevenDay(_data, true, type);
        }
      }
    )
  }


  getValueBySerie(_value: any, name: string): Array<any> {
    let value: any = {};
    if (isArray(_value)) {
      _value.forEach(elt => {
        value = Object.assign(value, elt);
      })
    } else {
      value = _value;
    }
    switch (name) {
      case 'WEATHER':
        return new Array(value.iconDay, value.maxTempDay, value.minTempDay);
        break;
      case 'RAIN':
        return new Array('' + value);
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
            return [_map.date].concat(this.getValueBySerie(_map.value, nameSerie), _map.sensorRef);
          });
        } else {

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
                    z2: 1000,
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
                    z2: 1000,
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

          option.tooltip = this.getTooltipBySerie(type);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.dayLabel.align = 'left';
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.visualMap = null;
        }
        chartInstance.clear();
        chartInstance.setOption(option, true);
        this.baseOptionExt = option;

      }
    )
  }
  getChartAstro(type: Tools, idApiary: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.astroService.getAstroByApiary(idApiary, range).subscribe(
      _astro => {
        let option = Object.assign({}, this.baseOptionExt);
        if (rangeChange) {
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
                  z2: 1000,
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
          option.tooltip = this.getTooltipBySerie(type);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.dayLabel.align = 'left';
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.visualMap = null;
          option.series.push(serie);
        }

        //chartInstance.clear();
        chartInstance.setOption(option, true);
        this.baseOptionExt = option;

      }
    )
  }
  getChartWeightincome(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.getLastDayForMeanValue(this.dailyWService.getDailyRecordsWbyHiveForMelliCharts(idHive, this.rangeSevenDay), false, type);
    this.dailyWService.getDailyRecordsWbyHiveForMelliCharts(idHive, range).subscribe(
      _daliW => {
        this.setMeanData(_daliW.weightIncomeHight.map(_elt => _elt.value).concat(_daliW.weightIncomeLow.map(_elt => _elt.value)), false, type);
        let option = Object.assign({}, this.baseOptionsInt);
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
          option.calendar.range = range;
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
          option.tooltip = this.getTooltipBySerie(type);
          option.calendar.range = range;
        }
        console.log(option);
        chartInstance.setOption(option, true);
        console.log(option);
        this.baseOptionsInt = option;
      }
    )
  }

  getRainByApiary(type: Tools, idApiary: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    const obs: Array<Observable<any>> = [
      this.weatherService.getRainCurrentDailyWeather(idApiary, range),
      this.weatherService.getRainForecastDailyWeather(idApiary, range)
    ];
    this.weatherService.getRainAllWeather(idApiary, range).map(_elt => _elt.flat()).subscribe(
      _rain => {
        this.getLastDayForMeanValue(this.weatherService.getRainAllWeather(idApiary, this.rangeSevenDay), false, type);
        console.log(_rain);
        this.setMeanData(_rain.map(_elt => _elt.value), false, type);
        let option = Object.assign({}, this.baseOptionExt);
        if (rangeChange) {
          this.getSerieByData(_rain, type.name, SERIES.effectScatter, (serieComplete: any) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            serieComplete.symbol = ICONS_WEATHER.rain,
              serieComplete.itemStyle = {
                normal: {
                  color: '#70A8B2'
                }
              };
            serieComplete.symbolSize = (val: any[]) => {
              if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                return val[1];
              } else {
                return val[1] * 25.4;
              }
            };
            option.series[index] = serieComplete;
          });
          option.calendar.range = range;
        } else {
          option.lengend = Object.assign({}, BASE_OPTIONS.legend);
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          this.getSerieByData(_rain, type.name, SERIES.effectScatter, (serieComplete) => {
            option.legend.data.push(serieComplete.name);
            serieComplete.symbol = ICONS_WEATHER.rain,
              serieComplete.itemStyle = {
                normal: {
                  color: '#70A8B2'
                }
              };
            serieComplete.symbolSize = (val: any[]) => {
              if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                return val[1];
              } else {
                return val[1] * 25.4;
              }
            };
            console.log(serieComplete);
            option.series.push(serieComplete);
          })

          option.visualMap = null;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.tooltip = this.getTooltipBySerie(type);
          option.calendar.range = range;
        }
        chartInstance.setOption(option, true);
        this.baseOptionExt = option;
      }
    )
  }

  getChartTintMax(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyHService.getTempIntMaxByHive(idHive, range).subscribe(
      _tMax => {
        this.setMeanData(_tMax.map(_elt => _elt.value), true, type);
        let option = Object.assign({}, this.baseOptionsInt);
        if (rangeChange) {
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
          option.tooltip = this.getTooltipBySerie(type);
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
        this.setMeanData(_tmpMaxExt.map(_elt => _elt.value), true, type);
        if (rangeChange) {
          option.calendar.range = range;
          option.series[0].data = _tmpMaxExt.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.name = type.name;
          serie.data = _tmpMaxExt.map(_data => new Array(_data.date, _data.value));
          option.visualMap = this.getVisualMapBySerie(type.name);
          option.tooltip = this.getTooltipBySerie(type);
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
  getChartTextMin(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyWService.getTempMinExt(idHive, range).subscribe(
      _tMinExt => {
        console.log(_tMinExt);
        this.setMeanData(_tMinExt.map(_elt => _elt.value), true, type);
        let option = Object.assign({}, this.baseOptionsInt);
        if (rangeChange) {
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
          option.tooltip = this.getTooltipBySerie(type);
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
  getChartHint(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyHService.getHintByHive(idHive, range).subscribe(
      _hInt => {
        this.setMeanData(_hInt.map(_elt => _elt.value), true, type);
        let option = Object.assign({}, this.baseOptionsInt);
        if (rangeChange) {
          option.calendar.range = range;
          option.series[0].data = _hInt.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _hInt.map(_data => new Array(_data.date, _data.value));
          option.tooltip = this.getTooltipBySerie(type);
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
  getChartBrood(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyHService.getBroodByHive(idHive, range).subscribe(
      _brood => {
        this.setMeanData(_brood.map(_elt => _elt.value), true, type);
        let option = Object.assign({}, this.baseOptionsInt);
        if (rangeChange) {
          option.calendar.range = range;
          option.series[0].data = _brood.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _brood.map(_data => new Array(_data.date, _data.value));
          option.visualMap = this.getVisualMapBySerie(type.name);
          option.tooltip = this.getTooltipBySerie(type);
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

  getChartTminInt(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyHService.getTminByHive(idHive, range).subscribe(
      _tMin => {
        console.log(_tMin);
        this.setMeanData(_tMin.map(_elt => _elt.value), true, type);
        let option = Object.assign({}, this.baseOptionsInt);
        if (rangeChange) {
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
          option.tooltip = this.getTooltipBySerie(type);
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

  getChartWeight(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyWService.getWeightByHive(idHive, range).subscribe(
      _weightMax => {
        this.setMeanData(_weightMax.map(_elt => _elt.value), true, type);
        let option = Object.assign({}, this.baseOptionsInt);
        if (rangeChange) {
          option.calendar.range = range;
          option.series[0].data = _weightMax.map(_data => new Array(_data.date, _data.value));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.data = _weightMax.map(_data => new Array(_data.date, _data.value));
          option.visualMap = this.getVisualMapBySerie(type.name);
          option.tooltip = this.getTooltipBySerie(type);
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
       // visualMap.top = 15;
        visualMap.min = this.unitService.getUserPref().unitSystem === 'METRIC' ? 10 : 25;
        visualMap.max = this.unitService.getUserPref().unitSystem === 'METRIC' ? 100 : 220;
        visualMap.inRange.color = ['#313695', '#4575b4', '#74add1',
          '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
        break;
      case 'TEMP_INT_MAX':
        visualMap.type = 'continuous';
        //visualMap.top = 15;
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
        // visualMap.top = 15;
        visualMap.inRange.color = ['#97A6C5', '#6987C5', '#3C68C5', '#05489B'];
        break;
      case 'BROOD':
        visualMap.type = 'continuous';
        visualMap.min = 0;
        visualMap.max = 100;
        visualMap.inRange.color = ['red', 'yellow', '#129001'];
       // visualMap.top = 15;
        break;
      case 'TEMP_INT_MIN':
        visualMap.type = 'continuous';
        //visualMap.top = 15;
        visualMap.min = this.unitService.getUserPref().unitSystem === 'METRIC' ? -10 : 50;
        visualMap.max = this.unitService.getUserPref().unitSystem === 'METRIC' ? 40 : 100;
        visualMap.inRange.color = ['#313695', '#4575b4', '#74add1',
          '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
        break;
      case 'TEMP_EXT_MAX':
        visualMap.type = 'continuous';
        //visualMap.top = 15;
        visualMap.min = this.unitService.getUserPref().unitSystem === 'METRIC' ? -10 : 50;
        visualMap.max = this.unitService.getUserPref().unitSystem === 'METRIC' ? 40 : 100;
        visualMap.inRange.color = ['#313695', '#4575b4', '#74add1',
          '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
        break;
      case 'TEMP_EXT_MIN':
        visualMap.type = 'continuous';
        //visualMap.top = 15;
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
  getTooltipBySerie(type: Tools): any {
    const tooltip = Object.assign({}, BASE_OPTIONS.tooltip);
    switch (type.name) {
      case 'WEATHER':
        tooltip.formatter = (params) => {
          return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data[0]), new Array(
            {
              name: 'TempMax',
              value: this.graphGlobal.getNumberFormat(params.data[2]),
              unit: this.graphGlobal.getUnitByType(type.unit)
            },
            {
              name: 'TempMin',
              value: this.graphGlobal.getNumberFormat(params.data[3]),
              unit: this.graphGlobal.getUnitByType(type.unit)
            }
          ));
        };
        break;
      case 'RAIN':
        tooltip.formatter = (params) => {
          return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data[0]), new Array(
            {
              name: 'Rain',
              value: this.graphGlobal.getNumberFormat(params.data[1]),
              unit: this.graphGlobal.getUnitByType(type.unit)
            }));
        }
        break;
      default:
        tooltip.formatter = (params) => {
          return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data[0]), new Array(
            {
              name: type.name,
              value: this.graphGlobal.getNumberFormat(params.data[1]),
              unit: this.graphGlobal.getUnitByType(type.unit)
            },
          ));
        }
    }
    return tooltip;
  }


  /**
   *
   *
   * @param {string} date
   * @param {Array<any>} series
   * @returns {string}
   * @memberof DailyManagerService
   */
  getTooltipFormater(markerSerie: string, date: string, series: Array<any>): string {
    let templateHeaderTooltip = '{*} {D} </br>';
    let templateValue = '{n} : {v} {u}';
    let tooltipGlobal;
    tooltipGlobal = templateHeaderTooltip.replace(/{\*}/g, markerSerie).replace(/{D}/g, date);
    tooltipGlobal += series.map(_serie => {
      return templateValue.replace(/{n}/g, _serie.name).replace(/{v}/g, _serie.value).replace(/{u}/g, _serie.unit);
    }).join('</br>');

    return tooltipGlobal;
  }




  /**
   *
   *
   * @param {Array<any>} _data
   * @param {boolean} mean
   * @param {Tools} type
   * @memberof DailyManagerService
   */
  setMeanData(_data: Array<any>, mean: boolean, type: Tools): void {
    let value = 0;
    _data.filter(_elt => _elt !== 'NaN').forEach(_value => {
      value = value + _value;
    })
    if (type.origin === DEVICE) {
      this.meanPeriodDevice = {
        value: this.unitService.getValRound(mean ? value / _data.length : value),
        unit: this.graphGlobal.getUnitByType(type.unit)
      };
      console.log(this.meanPeriodDevice);
    } else {
      this.meanPeriodOther = {
        value: this.unitService.getValRound(mean ? value / _data.length : value),
        unit: this.graphGlobal.getUnitByType(type.unit)
      };
    }
  }

  setMeanSevenDay(_data: Array<any>, mean: boolean, type: Tools) {
    let value = 0;
    _data.filter(_elt => _elt !== 'NaN').forEach(_value => {
      value = value + _value;
    })
    if (type.origin === DEVICE) {
      this.meanDeviceSevenDay = {
        value: mean ? value / _data.length : value,
        unit: this.graphGlobal.getUnitByType(type.unit)
      };
      console.log(this.meanDeviceSevenDay);
    } else {
      this.meanOtherSevenDay = {
        value: mean ? value / _data.length : value,
        unit: this.graphGlobal.getUnitByType(type.unit)
      };
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

