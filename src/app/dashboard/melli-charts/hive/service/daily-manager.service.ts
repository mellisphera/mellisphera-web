/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

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
import { isUndefined, isArray, isObject, isString } from 'util';
import { WeatherService } from '../../../service/api/weather.service';
import { WEATHER } from '../../charts/icons/icons_weather';
import { Observable } from 'rxjs';
import { AstroService } from '../../service/astro.service';
import { _localeFactory } from '@angular/core/src/application_module';
import 'rxjs/add/observable/of';
import { AlertsService } from '../../../service/api/alerts.service';
import { ObservationService } from '../../../service/api/observation.service';
import { Observation } from '../../../../_model/observation';
import { AlertInterface } from '../../../../_model/alert';
import { GLOBAL_ICONS } from '../../charts/icons/icons';
import { MyDate } from '../../../../class/MyDate';
import { UserParamsService } from '../../../preference-config/service/user-params.service';



export interface Tools {
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
  public baseOptionEnv: any;
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
    private userPref: UserParamsService,
    private alertService: AlertsService,
    private weatherService: WeatherService,
    private observationService: ObservationService,
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
    };
    this.meanOtherSevenDay = {
      value: 0,
      unit: ''
    };

    this.baseOptionsInt = Object.assign({}, BASE_OPTIONS.baseOptionDailyMelliCharts);
    this.baseOptionEnv = Object.assign({}, BASE_OPTIONS.baseOptionDailyMelliCharts);
    this.baseOptionExt = Object.assign({}, BASE_OPTIONS.baseOptionDailyMelliCharts);
    const dateNowLastSevenDay = new Date();
    dateNowLastSevenDay.setDate(new Date().getDate() - 8);
    this.rangeSevenDay = [
      dateNowLastSevenDay,
      new Date()
    ];
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
        return _serie.flat().filter(_data => _data.sensorRef === 'OpenWeatherMap').map(_elt => _elt.value);
      } else if (type.name === 'WINCOME') {
        return _serie.weightIncomeHight.map(_elt => _elt.value).concat(_serie.weightIncomeLow.map(_elt => _elt.value));
      } else if (type.name === 'TEMP_EXT_WEATHER_MAX') {
        return _serie.flat().filter(_t => _t.sensorRef === 'OpenWeatherMap').map(_elt => {
          _elt.value = parseInt(_elt.value.maxTempDay, 10);
          return _elt;
        });
      } else if (type.name === 'TEMP_EXT_WEATHER_MIN') {
        return _serie.flat().filter(_t => _t.sensorRef === 'OpenWeatherMap').map(_elt => {
          _elt.value = parseInt(_elt.value.minTempDay, 10);
          return _elt;
        });
      } else if (type.name === 'TEMP_EXT_WEATHER_MIN'){
        return _serie.flat().filter(_t => _t.sensorRef === 'OpenWeatherMap').map(_elt => {
          _elt.value = parseInt(_elt.value.minTempDay, 10);
          return _elt;
        });
      } else {
        return _serie;
      }
    }).subscribe(
      _data => {
        if (type.name === 'RAIN' || type.name === 'WINCOME') {
          this.setMeanSevenDay(_data, false, type);
        } else {
          this.setMeanSevenDay(_data.map(_data => _data.value), true, type);
        }
      }
    )
  }


  getValueBySerie(_value: any, name: string): Array<any> {
    let value: any = {};
    if (isArray(_value) && isObject(_value[0])) {
      _value.forEach(elt => {
        value = Object.assign(value, elt);
      })
    } else {
      value = _value;
    }
    console.log(name);
    switch (name) {
      case 'WEATHER':
        return new Array(value.iconDay, value.maxTempDay, value.minTempDay, value.maxHumidityDay, value.minHumidityDay, value.mainDay);
      case 'RAIN':
        return new Array(this.unitService.convertMilimetreToPouce(value.rainDay, this.unitService.getUserPref().unitSystem, true), value.snowDay, value.snowSun)
      case 'ALERT':
        return value;
      case 'TEMP_EXT_WEATHER':
        return [value.maxTempDay];
      default:
        return [value];
    }
  }


  getSerieByData(data: Array<any>, nameSerie: string, serieTemplate: any, next: Function): void {
    let sensorRef: Array<string> = [];
    data.forEach((_data) => {
      if (sensorRef.indexOf(_data.sensorRef) === -1) {
        sensorRef.push(_data.sensorRef);
        let serieTmp = Object.assign({}, serieTemplate);
        if (nameSerie === 'gain' || nameSerie === 'loss') {
          serieTmp.name = nameSerie + '|' + _data.sensorRef;

        } else {
          serieTmp.name = _data.sensorRef;
        }
        if (data.map(_elt => _elt.date)[0] !== undefined) {
          serieTmp.data = data.filter(_filter => _filter.sensorRef === _data.sensorRef).map(_map => {
            return [_map.date].concat(this.getValueBySerie(_map.value, nameSerie), _map.sensorRef);
          });
        } else {
          serieTmp.data = data.filter(_filter => _filter.sensorRef === _data.sensorRef);
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
          option.series = this.removeDataAllseries(option.series);
          this.getSerieByData(_weather, type.name, SERIES.custom, (serieComplete: any) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index].name = serieComplete.name;
            option.series[index].data = serieComplete.data;
          });
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
              let group =  {
                type: 'group',
                children: []
              };
            
              group.children.push({
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
                  fill: this.graphGlobal.getColorCalendarByValue(api.value(0)),
                  stroke: 'black'
                }
              });
              group.children = group.children.concat(this.weatherService.getPicto(api.value(1), cellPoint));
              return group;
            }
            option.legend.data.push(serieComplete.name);
            option.series.push(serieComplete);
          })

          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.dayLabel.align = 'left';
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.visualMap = null;
        }

        chartInstance.clear();
        chartInstance.setOption(option);
        chartInstance.hideLoading();
        this.baseOptionExt = option;

      }
    );
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

            let group = {
              type: 'group',
              children: []
            };

            group.children.push({
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
                fill: this.graphGlobal.getColorCalendarByValue(api.value(0), api.value(2)),
                stroke: 'black'
              }
            });
            group.children = group.children.concat(this.astroService.getPicto(this.getMoonIconByPhaseName(api.value(1)), cellPoint));
            /*             return {
              type: 'group',
              children: [
                {
                  type: 'path',
                  z2: 1000,
                  shape: {
                    pathData: this.getMoonIconByPhaseName(api.value(1)),
                    x: -11,
                    y: -11,
                    width: 25,
                    height: 25
                  },
                  style: {
                    fill: (api.value(1) === 'Nouvelle lune' || api.value(1) === 'New moon' ) ? 'white' : 'black'
                  },
                  position: [cellPoint[0], cellPoint[1]],
                },

              ]
            }; */
            return group;
          }
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.dayLabel.align = 'left';
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.visualMap = null;
          option.series.push(serie);
        }
        chartInstance.clear();
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionExt = option;

      }
    )
  }
  getChartWeightincome(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.getLastDayForMeanValue(this.dailyWService.getDailyRecordsWbyHiveForMelliCharts(idHive, this.rangeSevenDay), false, type);
    this.dailyWService.getDailyRecordsWbyHiveForMelliCharts(idHive, range).subscribe(
      _daliW => {
        let option = Object.assign({}, this.baseOptionsInt);
        if (rangeChange) {
          this.getSerieByData(_daliW.weightIncomeHight, 'gain', SERIES.effectScatter, (serieComplete: any) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            serieComplete.symbol = GLOBAL_ICONS.WINCOME;
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
            serieComplete.symbol = GLOBAL_ICONS.WINCOME;
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
          });
          option.calendar.range = range;
        } else {
          if (this.existSeries(option.series, 'gain')) {
            option.series = new Array();
          }
          option.legend = Object.assign({}, BASE_OPTIONS.legend);
          option.legend.selectedMode = 'multiple';
          this.getSerieByData(_daliW.weightIncomeHight, 'gain', SERIES.effectScatter, (serieComplete) => {
            option.legend.data.push(serieComplete.name);
            serieComplete.symbol = GLOBAL_ICONS.WINCOME;
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
            serieComplete.symbol = GLOBAL_ICONS.WINCOME;
            serieComplete.itemStyle = {
              normal: {
                color: '#FE0000'
              }
            };
            option.legend.data.push(serieComplete.name);
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
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.range = range;
        }
        option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
        this.setMeanData(option.series, false, type);
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;
      }
    )
  } 
  getChartTempMaxWeather(type: Tools, idApiary: string, chartInstance: any, range: Date[], rangeChange: boolean)  {
    this.weatherService.getAllTempWeather(idApiary, range).map(_elt => _elt.flat()).subscribe(
      _temp => {
        _temp = _temp.filter(_t => _t.sensorRef === 'OpenWeatherMap').map(_elt => {
          _elt.value.maxTempDay = this.unitService.convertTempFromUsePref(_elt.value.maxTempDay, this.unitService.getUserPref().unitSystem);
          return _elt;
        });
        this.getLastDayForMeanValue(this.weatherService.getAllTempWeather(idApiary, this.rangeSevenDay), true, type);
        let option = Object.assign({}, this.baseOptionExt);
        if (rangeChange) {
          option.calendar.range = range;
          option.series[0].data = _temp.map(_data => new Array(_data.date, _data.value.maxTempDay));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.name = type.name;
          serie.data = _temp.map(_data => new Array(_data.date, _data.value.maxTempDay));
          option.series.push(serie);
          option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        }
        this.setMeanData(option.series, true, type);
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionExt = option;
      }
    );
  }

  getHextMaxWeather(type: Tools, idApiary: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.weatherService.getAllTempWeather(idApiary, range).map(_elt => _elt.flat()).subscribe(
      _temp => {
        _temp = _temp.filter(_t => _t.sensorRef === 'OpenWeatherMap').map(_elt => {
          _elt.value.maxTempDay = this.unitService.convertTempFromUsePref(_elt.value.maxHumidityDay, this.unitService.getUserPref().unitSystem);
          return _elt;
        });
        this.getLastDayForMeanValue(this.weatherService.getAllTempWeather(idApiary, this.rangeSevenDay), true, type);
        let option = Object.assign({}, this.baseOptionExt);
        if (rangeChange) {
          option.calendar.range = range;
          option.series[0].data = _temp.map(_data => new Array(_data.date, _data.value.maxHumidityDay));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.name = type.name;
          serie.data = _temp.map(_data => new Array(_data.date, _data.value.maxHumidityDay));
          option.series.push(serie);
          option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        }
        this.setMeanData(option.series, true, type);
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionExt = option;
      }
    );
  }

  getHextMinWeather(type: Tools, idApiary: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.weatherService.getAllTempWeather(idApiary, range).map(_elt => _elt.flat()).subscribe(
      _temp => {
        _temp = _temp.filter(_t => _t.sensorRef === 'OpenWeatherMap').map(_elt => {
          _elt.value.maxTempDay = this.unitService.convertTempFromUsePref(_elt.value.minHumidityDay, this.unitService.getUserPref().unitSystem);
          return _elt;
        });
        this.getLastDayForMeanValue(this.weatherService.getAllTempWeather(idApiary, this.rangeSevenDay), true, type);
        let option = Object.assign({}, this.baseOptionExt);
        if (rangeChange) {
          option.calendar.range = range;
          option.series[0].data = _temp.map(_data => new Array(_data.date, _data.value.minHumidityDay));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.name = type.name;
          serie.data = _temp.map(_data => new Array(_data.date, _data.value.minHumidityDay));
          option.series.push(serie);
          option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        }
        this.setMeanData(option.series, true, type);
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionExt = option;
      }
    );
  }

  getChartWindMaxWeather(type: Tools, idApiary: string, chartInstance: any, range: Date[], rangeChange: boolean)  {
    this.weatherService.getWindAllWeather(idApiary, range).map(_elt => _elt.flat()).subscribe(
      _temp => {
        _temp = _temp.filter(_t => _t.sensorRef === 'OpenWeatherMap');
        this.getLastDayForMeanValue(this.weatherService.getAllTempWeather(idApiary, this.rangeSevenDay), true, type);
        let option = Object.assign({}, this.baseOptionExt);
        if (rangeChange) {
          option.calendar.range = range;
          option.series[0].data = _temp.map(_data => new Array(_data.date, _data.value.maxSpeed));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.name = type.name;
          serie.data = _temp.map(_data => new Array(_data.date, _data.value.maxSpeed));
          option.series.push(serie);
          option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        }
        this.setMeanData(option.series, true, type);
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionExt = option;
      }
    );
  }


  getChartTempMinWeather(type: Tools, idApiary: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.weatherService.getAllTempWeather(idApiary, range).map(_elt => _elt.flat()).subscribe(
      _temp => {
        _temp = _temp.filter(_t => _t.sensorRef === 'OpenWeatherMap').map(_elt => {
          _elt.value.minTempDay = this.unitService.convertTempFromUsePref(_elt.value.minTempDay, this.unitService.getUserPref().unitSystem);
          return _elt;
        });
        this.getLastDayForMeanValue(this.weatherService.getAllTempWeather(idApiary, this.rangeSevenDay), true, type);
        let option = Object.assign({}, this.baseOptionExt);
        if (rangeChange) {
          option.calendar.range = range;
          option.series[0].data = _temp.map(_data => new Array(_data.date, _data.value.minTempDay));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.name = type.name;
          serie.data = _temp.map(_data => new Array(_data.date, _data.value.minTempDay));
          option.series.push(serie);
          option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        }
        this.setMeanData(option.series, true, type);
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionExt = option;
      }
    );
  }

  getRainByApiary(type: Tools, idApiary: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.weatherService.getRainAllWeather(idApiary, range).map(_elt => _elt.flat()).subscribe(
      _rain => {
        this.getLastDayForMeanValue(this.weatherService.getRainAllWeather(idApiary, this.rangeSevenDay), false, type);
        let option = Object.assign({}, this.baseOptionExt);
        if (rangeChange) {
          this.getSerieByData(_rain, type.name, SERIES.effectScatter, (serieComplete: any) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            serieComplete.symbol = WEATHER.rain,
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
            serieComplete.symbol = WEATHER.rain;
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
            option.series.push(serieComplete);
          });

          option.visualMap = null;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.range = range;
        }
        this.setMeanData(option.series[0], false, type);
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionExt = option;
      }
    )
  }

  getChartTintMax(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    // this.getLastDayForMeanValue(this.dailyHService.getTempIntMaxByHive(idHive, this.rangeSevenDay), false, type);
    this.dailyHService.getTempIntMaxByHive(idHive, range).subscribe(
      _tMax => {
        this.getLastDayForMeanValue(this.dailyHService.getTempIntMaxByHive(idHive, this.rangeSevenDay), true, type);
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
          option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.series.push(serie);
        }
        this.setMeanData(option.series, true, type);
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;

      }
    )
  }

  getChartTextMax(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyWService.getTempMaxExt(idHive, range).subscribe(
      _tmpMaxExt => {
        this.getLastDayForMeanValue(this.dailyWService.getTempMaxExt(idHive, this.rangeSevenDay), true, type);
        let option = Object.assign({}, this.baseOptionsInt);
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
          option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
          option.legend.show = false;
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.range = range;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.series.push(serie);
        }
        this.setMeanData(option.series, true, type);
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;
      }
    )
  }
  getChartTextMin(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyWService.getTempMinExt(idHive, range).subscribe(
      _tMinExt => {
        this.getLastDayForMeanValue(this.dailyWService.getTempMinExt(idHive, this.rangeSevenDay), true, type);
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
          option.legend.show = false;
          option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.calendar.range = range;
          option.series.push(serie);
        }
        this.setMeanData(option.series, true, type);
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;
      }
    )
  }
  getChartHint(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyHService.getHintByHive(idHive, range).subscribe(
      _hInt => {
        this.getLastDayForMeanValue(this.dailyHService.getHintByHive(idHive, this.rangeSevenDay), true, type);
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
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.legend.show = false;
          option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.calendar.range = range;
          option.series.push(serie);
        }
        this.setMeanData(option.series, true, type);
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;

      }
    )
  }
  getChartBrood(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyHService.getBroodByHive(idHive, range).subscribe(
      _brood => {
        this.getLastDayForMeanValue(this.dailyHService.getBroodByHive(idHive, this.rangeSevenDay), true, type);
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
          option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.legend.show = false;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.calendar.range = range;
          option.series.push(serie);
        }
        this.setMeanData(option.series, true, type);
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;

      }
    )
  }

  getChartTminInt(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyHService.getTminByHive(idHive, range).subscribe(
      _tMin => {
        this.getLastDayForMeanValue(this.dailyHService.getTminByHive(idHive, this.rangeSevenDay), true, type);
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
          option.legend.show = false;
          option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.calendar.range = range;
          option.series.push(serie);
        }
        this.setMeanData(option.series, true, type);
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;
      }
    )
  }

  getChartWeight(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyWService.getWeightByHive(idHive, range).subscribe(
      _weightMax => {
        this.getLastDayForMeanValue(this.dailyWService.getWeightByHive(idHive, this.rangeSevenDay), true, type);
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
          option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.legend.show = false;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.calendar.range = range;
          option.series.push(serie);
        }
        this.setMeanData(option.series, true, type);
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;
      }
    )
  }

  getChartAlert(type: Tools, idHive: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    const obs: Array<Observable<any>> = [
      this.observationService.getObservationByHiveForMelliCharts(idHive, range),
      this.alertService.getAlertByHiveMelliCharts(idHive, range)
    ]
    Observable.forkJoin(obs).subscribe(
      _data => {
        const dateJoin = this.joinObservationAlert(_data[0], _data[1]);
        const joinData = _data[0].concat(_data[1]);
        let option = Object.assign({}, this.baseOptionEnv);
        if (rangeChange) {
          option.calendar.range = range;
          option.series = this.removeDataAllseries(option.series);
          this.getSerieByData(dateJoin, type.name, SERIES.custom, (serieComplete) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            serieComplete.renderItem = (params, api) => {
              let cellPoint = api.coord(api.value(0));
              let cellWidth = params.coordSys.cellWidth;
              let cellHeight = params.coordSys.cellHeight;
              let group = {
                type: 'group',
                children: []
              };
              group.children.push({
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
                  fill: this.graphGlobal.getColorCalendarByValue(api.value(0)),
                  stroke: 'black'
                }
              });
              const dataByDate: any[] = joinData.filter(_filter => this.graphGlobal.getTimeStampFromDate(MyDate.getWekitDate(<string>_filter.date)) === this.graphGlobal.getTimeStampFromDate(api.value(0)));
              if (dataByDate.length > 1) {
                 group.children.push({
                  type: 'path',
                  z2: 1000,
                  shape: {
                    pathData: GLOBAL_ICONS.THREE_DOTS,
                    x: -11,
                    y: -10,
                    width: 25,
                    height: 25
                  },
                  position: [cellPoint[0], cellPoint[1]],
                });
              } else if (dataByDate.length === 1) {
                let icon;
                if (dataByDate[0].sentence) {
                  group.children = group.children.concat(this.observationService.getPictoInspect(dataByDate[0].type, cellPoint));

                } else {
                  group.children = group.children.concat(this.alertService.getPicto(dataByDate[0].type, cellPoint));
                  // icon = this.alertService.getPicto(dataByDate[0].type);
                }
              }
              return group;

            }
            // option.legend.data.push(serieComplete.name)
            if (index !== -1) {
              option.series[index] = serieComplete;
            } else {
              option.series.push(serieComplete);

            }
          });
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          option.legend = Object.assign({}, BASE_OPTIONS.legend);
          this.getSerieByData(dateJoin, type.name, SERIES.custom, (serieComplete: any) => {
              serieComplete.renderItem = (params, api) => {
              let cellPoint = api.coord(api.value(0));
              let cellWidth = params.coordSys.cellWidth;
              let cellHeight = params.coordSys.cellHeight;
              let group = {
                type: 'group',
                children: []
              };
              group.children.push({
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
                  fill: this.graphGlobal.getColorCalendarByValue(api.value(0)),
                  stroke: 'black'
                }
              });
              const dataByDate: any[] = joinData.filter(_filter => {
                return this.graphGlobal.getTimeStampFromDate(MyDate.getWekitDate(<string>_filter.date)) === this.graphGlobal.getTimeStampFromDate(api.value(0));
              });
              if (dataByDate.length > 1) {
                group.children.push({
                  type: 'path',
                  z2: 1000,
                  shape: {
                    pathData: GLOBAL_ICONS.THREE_DOTS,
                    x: -11,
                    y: -10,
                    width: 25,
                    height: 25
                  },
                  position: [cellPoint[0], cellPoint[1]],
                });
              } else if(dataByDate.length === 1) {
                if (dataByDate !== undefined && dataByDate[0].sentence) {
                  group.children = group.children.concat(this.observationService.getPictoInspect(dataByDate[0].type, cellPoint));
                } else {
                  group.children = group.children.concat(this.alertService.getPicto(dataByDate[0].type, cellPoint));
                }
              }
              return group;

            }
            option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
            option.calendar.range = range;
            option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
            option.legend.data.push(serieComplete.name)
            option.series.push(serieComplete);
          });
        }
        option.legend.show = false;
        option.tooltip = this.graphGlobal.getTooltipBySerie(type, joinData);
        chartInstance.clear();
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionEnv = option;

      }
    );

  }


  getMoonIconByPhaseName(phaseName: string): string {
    switch(phaseName) {
      case 'Pleine lune':
      case 'Full moon':
        return 'full_moon'
      case 'Nouvelle lune':
      case 'New moon':
        return 'new_moon';
      case 'Last quarter':
      case 'Dernier quartier':
        return 'last_quarter';
      case 'First Quarter':
      case 'Premier quartier':
        return 'first_quarter';
      case 'Waxing gibbous':
      case 'Gibbeuse croissante':
        return 'wawing_gibbous';
      case 'Waning gibbous':
      case 'Gibbeuse décroissante':
        return 'waning_gibbous';
      case 'Waning crescent':
      case 'Dernier croissant':
        return 'last_crescent';
      case 'Waxing crescent':
      case 'Premier croissant':
        return 'first_crescent';
      default:
        return null;
    }
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
    if (isUndefined(serieArray) || serieArray.length < 1 || serieArray.length > 0) {
      return true;
    } else {
      return false;
    }
  }





  /**
   *
   *
   * @param {*} _series
   * @returns {any[]}
   * @memberof DailyManagerService
   */
  removeDataAllseries(_series: any): any[] {
    let series = _series.slice();
    series.forEach(_serie => {
      _serie.data = new Array();
    });
    return series;
  }




  /**
   *
   *
   * @param {Array<any>} _data
   * @param {boolean} mean
   * @param {Tools} type
   * @memberof DailyManagerService
   */
  setMeanData(series: any, mean: boolean, type: Tools): void {
    let data: any[] = new Array();
    if (isArray(series)) {
      data = series.map(_serie => _serie.data).flat();
    } else {
      data = series.data;
    }
    let value = 0;
    data.forEach(_value => {
      value = value + parseInt(_value[1], 10);
    });
    let meanValue = this.unitService.getValRound(mean ? value / data.length : value);

    if (isNaN(meanValue)) {
      meanValue = 0;
    }
    if (type.origin === DEVICE) {
      this.meanPeriodDevice = {
        value: meanValue,
        unit: this.graphGlobal.getUnitByType(type.unit)
      };
    } else {
      this.meanPeriodOther = {
        value: meanValue,
        unit: this.graphGlobal.getUnitByType(type.unit)
      };
    }
  }

  setMeanSevenDay(_data: Array<any>, mean: boolean, type: Tools) {
    let value = 0;
    _data.filter(_elt => _elt !== 'NaN').forEach(_value => {
      value = value + parseInt(_value, 10);
    });
    let meanValue = this.unitService.getValRound(mean ? value / _data.length : value);
    if (isNaN(meanValue)) {
      meanValue = 0;
    }
    if (type.origin === DEVICE) {
      this.meanDeviceSevenDay = {
        value: meanValue,
        unit: this.graphGlobal.getUnitByType(type.unit)
      };
    } else {
      this.meanOtherSevenDay = {
        value: meanValue,
        unit: this.graphGlobal.getUnitByType(type.unit)
      };
    }
  }


  /**


  /**
   *
   *
   * @param {any[]} _obs
   * @param {any[]} _alert
   * @returns {any[]}
   * @memberof DailyManagerService
   */
  joinObservationAlert(_obs: any[], _alert: any[]): any[] {
    return _obs.concat(_alert).map(_elt => {
      return { date: _elt.date, value: 0, sensorRef: _elt.sentence ? 'inspect' : 'notif' };
    });
  }


}

