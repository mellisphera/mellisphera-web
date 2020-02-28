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
  name?: string;
  id?: string;
  origin?: string;
  type?: string;
  unit?: string;
  class?: string;
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
  public setMeanAnnotation: Function;
  public setMeanSevenDayAnnotation: Function;
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

    this.baseOptionsInt = JSON.parse(JSON.stringify(BASE_OPTIONS.baseOptionDailyMelliCharts));
    //this.baseOptionsInt.graphic.push(JSON.parse(JSON.stringify(BASE_OPTIONS.graphic)));
    this.baseOptionEnv = JSON.parse(JSON.stringify(BASE_OPTIONS.baseOptionDailyMelliCharts));
    this.baseOptionExt = JSON.parse(JSON.stringify(BASE_OPTIONS.baseOptionDailyMelliCharts));
    //this.baseOptionExt.graphic.push(JSON.parse(JSON.stringify(BASE_OPTIONS.graphic)));
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
        return _serie.flat().map(_elt => {
          let value = _elt.value.map(_elt => _elt.rainDay).filter(_elt => _elt !== undefined);
          return this.unitService.convertMilimetreToPouce(value, this.unitService.getUserPref().unitSystem, false);
        });
      } else if (type.name === 'WINCOME') {
        return _serie.weightIncomeHight.map(_elt => _elt.value).concat(_serie.weightIncomeLow.map(_elt => {
          return this.unitService.convertWeightFromuserPref(_elt.value, this.unitService.getUserPref().unitSystem, false);
        }));
      } else if (type.name === 'TEMP_EXT_WEATHER_MAX') {
        return _serie.flat().map(_elt => {
          _elt.value = parseInt(_elt.value.maxTempDay, 10);
          _elt.value = this.unitService.convertTempFromUsePref(_elt.value, this.unitService.getUserPref().unitSystem, false);
          return _elt;
        });
      } else if (type.name === 'TEMP_EXT_WEATHER_MIN') {
        return _serie.flat().map(_elt => {
          _elt.value = parseInt(_elt.value.minTempDay, 10);
          _elt.value = this.unitService.convertTempFromUsePref(_elt.value, this.unitService.getUserPref().unitSystem, false);
          return _elt;
        });
      } else if (type.name === 'HEXT_WEATHER_MAX') {
        return _serie.flat().map(_elt => {
          _elt.value = parseInt(_elt.value.maxHumidityDay, 10);
          return _elt;
        });
      } else if (type.name === 'HEXT_WEATHER_MIN') {
        return _serie.flat().map(_elt => {
          _elt.value = parseInt(_elt.value.minHumidityDay, 10);
          return _elt;
        });
      } else if (type.name === 'WIND') {
        return _serie.flat().map(_elt => {
          _elt.value = parseInt(_elt.value.maxSpeed, 10);
          _elt.value = this.unitService.convertWindFromUserPref(_elt.value, this.unitService.getUserPref().unitSystem, false);

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
      });
    } else {
      value = _value;
    }
    switch (name) {
      case 'WEATHER':
        return new Array(value.iconDay, value.maxTempDay, value.minTempDay, value.maxHumidityDay, value.minHumidityDay, value.mainDay, value.maxPressureDay, value.minPressureDay);
      case 'RAIN':
        return new Array(this.unitService.convertMilimetreToPouce(value.rainDay, this.unitService.getUserPref().unitSystem, true),
          this.unitService.convertMilimetreToPouce(value.snowDay, this.unitService.getUserPref().unitSystem, true), value.snowSun)
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
          serieTmp.name = nameSerie + ' | ' + _data.sensorRef;
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

  getChartDailyWeather(type: Tools, apiaryId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    const weatherObs: Array<Observable<any>> = [this.weatherService.getCurrentDailyWeather(apiaryId, range), this.weatherService.getForecastDailyWeather(apiaryId, range)];
    Observable.forkJoin(weatherObs).map(_elt => _elt.flat()).subscribe(
      _weather => {
        const data = _weather.filter(_elt => _elt.value[0].mainDay !== 'Undefined').map(_map => [_map.date].concat(this.getValueBySerie(_map.value, type.name), _map.sensorRef));
        let option = JSON.parse(JSON.stringify(this.baseOptionExt));
        if (data.length > 0) {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          option.legend.selectedMode = 'single';
          let serie = JSON.parse(JSON.stringify(SERIES.custom));
          serie.data = data;
          console.log(serie.data);
          serie.name = data[0][9];
          serie.renderItem = (params, api) => {
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
            group.children = group.children.concat(this.weatherService.getPicto(api.value(1), cellPoint));
            return group;
          };
          option.legend.data = [data[0][9]];
          option.series.push(serie);
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.dayLabel.align = 'left';
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.series.push(this.graphGlobal.getDaySerie());
          option.visualMap = null;
        }
        option.calendar.range = range;
        chartInstance.clear();
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionExt = option;

      }
    );
  }
  getChartAstro(type: Tools, apiaryId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.astroService.getAstroByApiary(apiaryId, range).subscribe(
      _astro => {
        let option = Object.assign({}, this.baseOptionEnv);
        if (rangeChange) {
          option.series[0].data = _astro.map(_data => new Array<any>(_data.date, _data.moon['phase_code'],
            _data.moon['ascendant'], _data.sys['sunrise'], _data.sys['sunset']));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.custom);
          serie.name = type.name;
          serie.data = _astro.map(_data => new Array<any>(_data.date, _data.moon['phase_code'],
            _data.moon['ascendant'], _data.sys['sunrise'], _data.sys['sunset']));
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
            group.children = group.children.concat(this.astroService.getPicto(this.astroService.codeToPhaseName[api.value(1)], cellPoint));
            return group;
          }
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.dayLabel.align = 'left';
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.visualMap = null;
          option.series.push(serie);
        }
        option.calendar.range = range;
        option.series.push(this.graphGlobal.getDaySerie());
        chartInstance.clear();
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionEnv = option;

      }
    )
  }
  getChartWeightincome(type: Tools, hiveId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    //his.getLastDayForMeanValue(this.dailyWService.getDailyRecordsWbyHiveForMelliCharts(hiveId, this.rangeSevenDay), false, type);
    this.dailyWService.getDailyRecordsWbyHiveForMelliCharts(hiveId, range).subscribe(
      _daliW => {
        let option = Object.assign({}, this.baseOptionsInt);
        if (rangeChange) {
          this.getSerieByData(_daliW.weightIncomeHight, 'gain', SERIES.effectScatter, (serieComplete: any) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index].data = serieComplete.data;
          });
          this.getSerieByData(_daliW.weightIncomeLow, 'loss', SERIES.effectScatter, (serieComplete: any) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            option.series[index].data = serieComplete.data;
          });
        } else {
          if (this.existSeries(option.series, 'gain')) {
            option.series = new Array();
          }
          option.legend.selectedMode = 'multiple';
          this.getSerieByData(_daliW.weightIncomeHight, 'gain', SERIES.effectScatter, (serieComplete) => {
            option.legend.data.push(serieComplete.name);
/*             serieComplete.symbol = GLOBAL_ICONS.WINCOME;
 */            serieComplete.itemStyle = {
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
        }
        option.calendar.range = range;
        option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
        option.series.push(this.graphGlobal.getDaySerie());
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;
      }
    )
  }
  getChartTempMaxWeather(type: Tools, apiaryId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.weatherService.getAllTempWeather(apiaryId, range).map(_elt => _elt.flat()).subscribe(
      _temp => {
        _temp = _temp.map(_elt => {
          _elt.value.maxTempDay = this.unitService.convertTempFromUsePref(_elt.value.maxTempDay, this.unitService.getUserPref().unitSystem);
          return _elt;
        });
        //this.getLastDayForMeanValue(this.weatherService.getAllTempWeather(apiaryId, this.rangeSevenDay), true, type);
        let option = Object.assign({}, this.baseOptionExt);
        if (rangeChange) {
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
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        }
        option.calendar.range = range;
        option.series.push(this.graphGlobal.getDaySerie());
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionExt = option;
      }
    );
  }

  getHextMaxWeather(type: Tools, apiaryId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.weatherService.getAllTempWeather(apiaryId, range).map(_elt => _elt.flat()).subscribe(
      _temp => {
        _temp = _temp.map(_elt => {
          _elt.value.maxTempDay = this.unitService.convertTempFromUsePref(_elt.value.maxHumidityDay, this.unitService.getUserPref().unitSystem);
          return _elt;
        });
        //this.getLastDayForMeanValue(this.weatherService.getAllTempWeather(apiaryId, this.rangeSevenDay), true, type);
        let option = Object.assign({}, this.baseOptionExt);
        if (rangeChange) {
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
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        }
        option.calendar.range = range;
        chartInstance.setOption(option, true);
        option.series.push(this.graphGlobal.getDaySerie());
        chartInstance.hideLoading();
        this.baseOptionExt = option;
      }
    );
  }

  getHextMinWeather(type: Tools, apiaryId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.weatherService.getAllTempWeather(apiaryId, range).map(_elt => _elt.flat()).subscribe(
      _temp => {
        _temp = _temp.map(_elt => {
          _elt.value.maxTempDay = this.unitService.convertTempFromUsePref(_elt.value.minHumidityDay, this.unitService.getUserPref().unitSystem);
          return _elt;
        });
        //this.getLastDayForMeanValue(this.weatherService.getAllTempWeather(apiaryId, this.rangeSevenDay), true, type);
        let option = Object.assign({}, this.baseOptionExt);
        if (rangeChange) {
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
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        }
        option.calendar.range = range;
        chartInstance.setOption(option, true);
        option.series.push(this.graphGlobal.getDaySerie());
        chartInstance.hideLoading();
        this.baseOptionExt = option;
      }
    );
  }

  getChartWindMaxWeather(type: Tools, apiaryId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.weatherService.getWindAllWeather(apiaryId, range).map(_elt => _elt.flat()).subscribe(
      _temp => {
        // this.getLastDayForMeanValue(this.weatherService.getAllTempWeather(apiaryId, this.rangeSevenDay), true, type);
        let option = Object.assign({}, this.baseOptionExt);
        //this.getLastDayForMeanValue(this.weatherService.getWindAllWeather(apiaryId, this.rangeSevenDay), true, type);
        if (rangeChange) {
          option.series[0].data = _temp.map(_data => new Array(_data.date, this.unitService.convertWindFromUserPref(_data.value.maxSpeed, this.unitService.getUserPref().unitSystem)));
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = Object.assign({}, SERIES.heatmap);
          serie.name = type.name;
          serie.data = _temp.map(_data => new Array(_data.date, this.unitService.convertWindFromUserPref(_data.value.maxSpeed, this.unitService.getUserPref().unitSystem)));
          option.series.push(serie);
          option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        }
        option.calendar.range = range;
        option.series.push(this.graphGlobal.getDaySerie());
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionExt = option;
      }
    );
  }


  getChartTempMinWeather(type: Tools, apiaryId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.weatherService.getAllTempWeather(apiaryId, range).map(_elt => _elt.flat()).subscribe(
      _temp => {
        _temp = _temp.map(_elt => {
          _elt.value.minTempDay = this.unitService.convertTempFromUsePref(_elt.value.minTempDay, this.unitService.getUserPref().unitSystem);
          return _elt;
        });
        //this.getLastDayForMeanValue(this.weatherService.getAllTempWeather(apiaryId, this.rangeSevenDay), true, type);
        let option = Object.assign({}, this.baseOptionExt);
        if (rangeChange) {
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
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        }
        option.calendar.range = range;
        option.series.push(this.graphGlobal.getDaySerie());
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionExt = option;
      }
    );
  }

  gatPrecipitationByApiary(type: Tools, apiaryId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.weatherService.getRainAllWeather(apiaryId, range).map(_elt => _elt.flat()).subscribe(
      _rain => {
        //this.getLastDayForMeanValue(this.weatherService.getRainAllWeather(apiaryId, this.rangeSevenDay), false, type);
        let option = Object.assign({}, this.baseOptionExt);
        if (rangeChange) {
          this.getSerieByData(_rain, type.name, SERIES.effectScatter, (serieComplete: any) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);

            option.series[index].data = serieComplete.data;
          });
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
              let value: number;
              if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                if ((val[1] + val[2]) > 100) {
                  return 35;
                } else {
                  value = val[1] + val[2];
                }
                return 4 * Math.sqrt(value);
              } else {
                if ((val[1] + val[2]) * 25.4 > 100) {
                  return 35;
                } else {
                  value = val[1] + val[2];
                }
                return (4 * Math.sqrt(value * 25.4));
              }
            };
            option.series.push(serieComplete);
          });

          option.visualMap = null;
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
        }
        option.calendar.range = range;
        option.series.push(this.graphGlobal.getDaySerie());
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionExt = option;
      }
    )
  }

  getChartTintMax(type: Tools, hiveId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    // this.getLastDayForMeanValue(this.dailyHService.getTempIntMaxByHive(hiveId, this.rangeSevenDay), false, type);
    this.dailyHService.getTempIntMaxByHive(hiveId, range, this.unitService.getUserPref().unitSystem).subscribe(
      _tMax => {
        let option = JSON.parse(JSON.stringify(this.baseOptionsInt));
        if (this.existSeries(option.series, type.name)) {
          option.series = new Array();
        }
        option.calendar.range = range;
        option.legend.selectedMode = 'single';
        option.legend.data = _tMax.map(_val => _val._id);
        option.legend.show = true;
        _tMax.forEach(elt => {
          let serie = {
            type: 'heatmap',
            name: elt.values[0].sensorRef,
            coordinateSystem: 'calendar',
            data: elt.values.map(_val => [_val.recordDate, _val.temp_int_max])
          };
          option.series.push(serie);
        });
        option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
        option.tooltip = this.graphGlobal.getTooltipBySerie(type);
        option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
        option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;

      }
    )
  }

  getChartTextMax(type: Tools, hiveId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyWService.getTempMaxExt(hiveId, range, this.unitService.getUserPref().unitSystem).subscribe(
      _tmpMaxExt => {
        let option = JSON.parse(JSON.stringify(this.baseOptionsInt));
        if (this.existSeries(option.series, type.name)) {
          option.series = new Array();
        }
        option.calendar.range = range;
        option.legend.selectedMode = 'single';
        option.legend.data = _tmpMaxExt.map(_val => _val._id);
        option.legend.show = true;
        _tmpMaxExt.forEach(elt => {
          let serie = {
            type: 'heatmap',
            name: elt.values[0].sensorRef,
            coordinateSystem: 'calendar',
            data: elt.values.map(_val => [_val.recordDate, _val.temp_ext_max])
          };
          option.series.push(serie);
        });
        option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
        option.tooltip = this.graphGlobal.getTooltipBySerie(type);
        option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
        option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;
      }
    )
  }
  getChartTextMin(type: Tools, hiveId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyWService.getTempMinExt(hiveId, range, this.unitService.getUserPref().unitSystem).subscribe(
      _tMinExt => {
        let option = JSON.parse(JSON.stringify(this.baseOptionsInt));
        if (this.existSeries(option.series, type.name)) {
          option.series = new Array();
        }
        option.calendar.range = range;
        option.legend.selectedMode = 'single';
        option.legend.data = _tMinExt.map(_val => _val._id);
        option.legend.show = true;
        _tMinExt.forEach(elt => {
          let serie = {
            type: 'heatmap',
            name: elt.values[0].sensorRef,
            coordinateSystem: 'calendar',
            data: elt.values.map(_val => [_val.recordDate, _val.temp_ext_min])
          };
          option.series.push(serie);
        });
        option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
        option.tooltip = this.graphGlobal.getTooltipBySerie(type);
        option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
        option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;
      }
    )
  }
  getChartHint(type: Tools, hiveId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyHService.getHintByHive(hiveId, range).subscribe(
      _hInt => {
        let option = JSON.parse(JSON.stringify(this.baseOptionsInt));
        if (this.existSeries(option.series, type.name)) {
          option.series = new Array();
        }
        option.calendar.range = range;
        option.legend.selectedMode = 'single';
        option.legend.data = _hInt.map(_val => _val._id);
        option.legend.show = true;
        _hInt.forEach(elt => {
          let serie = {
            type: 'heatmap',
            name: elt.values[0].sensorRef,
            coordinateSystem: 'calendar',
            data: elt.values.map(_val => [_val.recordDate, _val.humidity_int_max])
          };
          option.series.push(serie);
        });
        option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
        option.tooltip = this.graphGlobal.getTooltipBySerie(type);
        option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
        option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;
      }
    )
  }
  getChartBrood(type: Tools, hiveId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyHService.getBroodByHive(hiveId, range).subscribe(
      _brood => {
        let option = JSON.parse(JSON.stringify(this.baseOptionsInt));
        if (this.existSeries(option.series, type.name)) {
          option.series = new Array();
        }
        option.calendar.range = range;
        option.legend.selectedMode = 'single';
        option.legend.data = _brood.map(_val => _val._id);
        option.legend.show = true;
        _brood.forEach(elt => {
          let serie = {
            type: 'heatmap',
            name: elt.values[0].sensorRef,
            coordinateSystem: 'calendar',
            data: elt.values.map(_val => [_val.recordDate, _val.brood])
          };
          option.series.push(serie);
        });
        option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
        option.tooltip = this.graphGlobal.getTooltipBySerie(type);
        option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
        option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;

      }
    )
  }

  getChartTminInt(type: Tools, hiveId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyHService.getTminByHive(hiveId, range, this.unitService.getUserPref().unitSystem).subscribe(
      _tMin => {
        let option = JSON.parse(JSON.stringify(this.baseOptionsInt));
        if (this.existSeries(option.series, type.name)) {
          option.series = new Array();
        }
        option.calendar.range = range;
        option.legend.selectedMode = 'single';
        option.legend.data = _tMin.map(_val => _val._id);
        option.legend.show = true;
        _tMin.forEach(elt => {
          let serie = {
            type: 'heatmap',
            name: elt.values[0].sensorRef,
            coordinateSystem: 'calendar',
            data: elt.values.map(_val => [_val.recordDate, _val.temp_int_min])
          };
          option.series.push(serie);
        });
        option.visualMap = this.graphGlobal.getVisualMapBySerie(type.name);
        option.tooltip = this.graphGlobal.getTooltipBySerie(type);
        option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
        option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;
      }
    )
  }

  getChartWeight(type: Tools, hiveId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    this.dailyWService.getWeightByHive(hiveId, range).subscribe(
      _weightMax => {
        //this.getLastDayForMeanValue(this.dailyWService.getWeightByHive(hiveId, this.rangeSevenDay), true, type);
        let option = this.baseOptionsInt;
        if (rangeChange) {
          let serie = JSON.parse(JSON.stringify(SERIES.effectScatter));
          let legend = JSON.parse(JSON.stringify(BASE_OPTIONS.legend));
          this.getSerieByData(_weightMax, type.name, serie, (serieComplete) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            legend.data.push(serieComplete.name);
            option.series[index].data = serieComplete.data;
          });
        } else {
          if (this.existSeries(option.series, type.name)) {
            option.series = new Array();
          }
          let serie = JSON.parse(JSON.stringify(SERIES.effectScatter));
          this.getSerieByData(_weightMax, type.name, serie, (serieComplete) => {
            option.legend.data.push(serieComplete.name);
            serieComplete.itemStyle = {
              normal: {
                color: '#00FE0C'
              }
            };
            serieComplete.symbolSize = (val: Array<any>) => {
              return (0.5 * Math.sqrt(Math.abs(50 * val[1])));
            }
            option.series.push(serieComplete);
          });
          // serie.data = _weightMax.map(_data => new Array(_data.date, _data.value));
          option.visualMap = null;
          option.tooltip = this.graphGlobal.getTooltipBySerie(type);
          option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
        }
        option.calendar.range = range;
        option.series.push(this.graphGlobal.getDaySerie());
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionsInt = option;
      }
    )
  }

  getChartAlert(type: Tools, hiveId: string, chartInstance: any, range: Date[], rangeChange: boolean) {
    const obs: Array<Observable<any>> = [
      this.observationService.getObservationByHiveForMelliCharts(hiveId, range),
      this.alertService.getAlertByHive(hiveId, range)
    ]
    Observable.forkJoin(obs).subscribe(
      _data => {
        const dateJoin = this.joinObservationAlert(_data[0], _data[1]);
        const joinData = _data[0].concat(_data[1]);
        let option = Object.assign({}, this.baseOptionEnv);
        if (rangeChange) {
          option.series = this.removeDataAllseries(option.series);
          this.getSerieByData(dateJoin, type.name, SERIES.custom, (serieComplete) => {
            const index = option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            serieComplete.renderItem = (params, api) => {
              const cellPoint = api.coord(api.value(0));
              const cellWidth = params.coordSys.cellWidth;
              const cellHeight = params.coordSys.cellHeight;
              const group = {
                type: 'group',
                children: []
              };
              const dataByDate: any[] = joinData.filter(_filter => this.graphGlobal.compareToDate(_filter.opsDate, api.value(0)));
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
              if (dataByDate.length > 1) {
                let path: any;
                const nbNote = dataByDate.filter(_elt => _elt.description).length;
                //console.log(nbNote + '===' + dataByDate.length)
                if (nbNote === dataByDate.length) {
                  path = this.observationService.getPictoInspect(cellPoint);
                  group.children = group.children.concat(path);
                } else if (nbNote < dataByDate.length && dataByDate.length !== 1) {
                  path = {
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
                  };
                  group.children.push(path);
                }
              } else if (dataByDate.length === 1) {
                let icon;
                if (dataByDate[0].description) {
                  group.children = group.children.concat(this.observationService.getPictoInspect(cellPoint));
                } else {
                  group.children = group.children.concat(this.alertService.getPicto(dataByDate[0].icon, cellPoint));
                  // icon = this.alertService.getPicto(dataByDate[0].type);
                }
              }
              return group;

            }
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
                return this.graphGlobal.compareToDate(_filter.opsDate, api.value(0));
              });
              if (dataByDate.length > 1) {
                let path: any;
                const nbNote = dataByDate.filter(_elt => _elt.description).length;
                //console.log(nbNote + '===' + dataByDate.length)
                if (nbNote === dataByDate.length) {
                  path = this.observationService.getPictoInspect(cellPoint);
                  group.children = group.children.concat(path);
                } else if (nbNote < dataByDate.length && dataByDate.length !== 1) {
                  path = {
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
                  };
                  group.children.push(path);
                }
              } else if (dataByDate.length === 1) {
                if (dataByDate !== undefined && dataByDate[0].description) {
                  group.children = group.children.concat(this.observationService.getPictoInspect(cellPoint));
                } else {
                  group.children = group.children.concat(this.alertService.getPicto(dataByDate[0].icon, cellPoint));
                }
              }
              return group;

            }
            option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();

            option.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
            option.series.push(serieComplete);
          });
        }
        option.calendar.range = range;
        option.legend.show = true;
        option.series.push(this.graphGlobal.getDaySerie());
        option.tooltip = this.graphGlobal.getTooltipBySerie(type, joinData);
        chartInstance.clear();
        chartInstance.setOption(option, true);
        chartInstance.hideLoading();
        this.baseOptionEnv = option;

      }
    );

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
    if (_series !== undefined) {
      let series = _series.slice();
      series.forEach(_serie => {
        _serie.data = new Array();
      });
      return series;
    }
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
    /*     switch(type.name) {
          case 'RAIN':
            meanValue = this.unitService.convertMilimetreToPouce(meanValue, this.unitService.getUserPref().unitSystem, false);
            break;
          case 'WINCOME':
            meanValue = this.unitService.convertWeightFromuserPref(meanValue, this.unitService.getUserPref().unitSystem, false);
            break;
          case 'TEMP_EXT_WEATHER_MAX':
          case 'TEMP_EXT_WEATHER_MIN':
            meanValue = this.unitService.convertTempFromUsePref(meanValue, this.unitService.getUserPref().unitSystem, false);
            break;
          default:
        } */
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
      return { date: _elt.opsDate, value: 0, sensorRef: _elt.description ? 'inspect' : 'notif' };
    });
  }


}

