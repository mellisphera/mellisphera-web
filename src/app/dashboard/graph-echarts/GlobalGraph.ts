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

const BROOD = 'BROOD';
const WINCOME = 'WINCOME';
const WEIGHT_MAX = 'WEIGHT_MAX';
const TEMP_INT_MAX = 'TEMP_INT_MAX';
const TEMP_INT_MIN = 'TEMP_INT_MIN';
const HRIN = 'HRIN';
const WEATHER = 'WEATHER';
const TEMP_EXT_MAX = 'TEMP_EXT_MAX';
const TEMP_EXT_MIN = 'TEMP_EXT_MIN';
const TEMP_EXT_WEATHER_MAX = 'TEMP_EXT_WEATHER_MAX';
const TEMP_EXT_WEATHER_MIN = 'TEMP_EXT_WEATHER_MIN';
const TEMP_INT_WEATHER = 'TEMP_INT_WEATHER';
const WIND = 'WIND';

import { Injectable } from '@angular/core';
import { UserParamsService } from '../preference-config/service/user-params.service';
import { stringify } from 'querystring';
import { UserloggedService } from '../../userlogged.service';
import { UnitService } from '../service/unit.service';
import { isString } from 'util';
import { MyDate } from '../../class/MyDate';
import { BASE_OPTIONS } from '../melli-charts/charts/BASE_OPTIONS';
import { Tools } from '../melli-charts/hive/service/daily-manager.service';
import { CALENDAR } from '../melli-charts/charts/CALENDAR';
import { WeatherService } from '../service/api/weather.service';
import { SERIES } from '../melli-charts/charts/SERIES';
import { NOTIF_CODE } from '../../../constants/notif_code';
import { AlertsService } from '../service/api/alerts.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class GraphGlobal {
  public weight: {
    name: string,
    min: number,
    max: number,
    interval: number,
    unitW: string
  };
  public moon: {
    phase: string,
    period: string
  }
  public snow: {
    name: string,
    min: number,
    max: number,
    unitT: string,
  }
  public temp: {
    name: string,
    min: number,
    max: number,
    unitT: string,
  };
  public humidity: {
    name: string,
    min: number,
    max: number,
    unitT: string,
  };
  public rain: {
    name: string,
    min: number,
    max: number,
    unitT: string,
  };
  public brood: {
    name: string,
    min: number,
    max: number,
    unitT: string,
  };
  public wind: {
    name: string,
    min: number,
    max: number,
    unitT: string,
  };
  public weightIncome: {
    gain: string,
    loss: string
  };
  public titresFR: Array<any>;
  public titresEN: Array<any>;

  constructor(private userConfig: UserParamsService,
    private unitService: UnitService,
    public userService: UserloggedService,
    private alertService: AlertsService,
    private translateService: TranslateService,
    private weatherService: WeatherService,
    private userPref: UserParamsService) {
    this.weight = {
      name: '',
      min: null,
      max: 0,
      interval: 0,
      unitW: 'Kg'
    };
    this.weightIncome = {
      gain: '',
      loss: ''
    };
    this.temp = {
      name: '',
      min: null,
      max: 0,
      unitT: '°C',
    };
    this.moon = {
      phase: '',
      period: ''
    }
    this.snow = {
      name: '',
      min: null,
      max: 0,
      unitT: 'mm',
    }
    this.wind = {
      name: '',
      min: null,
      max: 0,
      unitT: 'm/s',
    };
    this.humidity = {
      name: '',
      min: null,
      max: 0,
      unitT: '%',
    };
    this.brood = {
      name: '',
      min: null,
      max: 0,
      unitT: '%',
    };
    this.rain = {
      name: '',
      min: null,
      max: 0,
      unitT: '',
    }
    if (this.userConfig.getUserPref().unitSystem === 'IMPERIAL') { // US
      this.setImperial();
    } else { // FR
      this.setMetric();
    }

    //Table of titles : 
    //FR
    this.titresFR = [
      { 'graph': 'reserveMiel', 'titre': 'Stock de miel' },
      { 'graph': 'DailyWeightIncomes', 'titre': 'Productivité' },
      { 'graph': 'BroodDynamics', 'titre': 'Niveau de couvain' },
      { 'graph': 'InternalRelativeHumidity', 'titre': 'Humidité interne relative (max)' },
      { 'graph': 'InternalTemperature', 'titre': 'Température interne' },
      { 'graph': 'ExternalTemperature', 'titre': 'Température externe' },
      { 'graph': 'WeightTemperature', 'titre': 'Poids & Température' },
      { 'graph': 'Humidity', 'titre': 'Humidité (%)' },
      { 'graph': 'loss', 'titre': 'perte' },
      { 'graph': 'Weight', 'titre': 'Poids' },
      { 'graph': 'AlertsHive', 'titre': 'Evénements' },
      { 'graph': 'AlertsApiary', 'titre': 'Evénements du rucher' },
      { 'graph': 'Blooming', 'titre': 'Calendrier de floraison du rucher' },
      { graph: 'Weather', titre: 'Méteo' },
      { graph: 'Moon', titre: 'Calendrier lunaire' },
      { graph: 'Rain', titre: 'Pluie' },
      { graph: 'Wind', titre: 'Vent' },

    ];

    // EN
    this.titresEN = [
      { 'graph': 'reserveMiel', 'titre': 'Honey Stock' },
      { 'graph': 'DailyWeightIncomes', 'titre': 'Productivity' },
      { 'graph': 'BroodDynamics', 'titre': 'Brood level' },
      { 'graph': 'InternalRelativeHumidity', 'titre': 'Internal Relative Humidity (max)' },
      { 'graph': 'InternalTemperature', 'titre': 'Internal Temperature' },
      { 'graph': 'ExternalTemperature', 'titre': 'External Temperature' },
      { 'graph': 'WeightTemperature', 'titre': 'Weight & Temperature' },
      { 'graph': 'Humidity', 'titre': 'Humidity (%)' },
      { 'graph': 'loss', 'titre': 'loss' },
      { 'graph': 'Weight', 'titre': 'Weight' },
      { 'graph': 'AlertsHive', 'titre': 'Events' },
      { 'graph': 'AlertsApiary', 'titre': 'Events for the apiary' },
      { 'graph': 'Blooming', 'titre': 'Apiary Blooming calendar' },
      { graph: 'Weather', titre: 'Weather' },
      { graph: 'Moon', titre: 'Moon calendar' },
      { graph: 'Rain', titre: 'Rain' },
      { graph: 'Wind', titre: 'Wind' },
    ];
  }


  setImperial() {
    // If he is French
    if (this.translateService.currentLang === 'fr') {
      this.weight.name = 'Poids (lbs)';
      this.humidity.name = 'Humidité (%)';
      this.rain.name = 'Pluie';
      this.weightIncome.gain = 'Gain';
      this.weightIncome.loss = 'Perte';
      this.moon.phase = 'Phase';
      this.moon.period = 'Période';
      this.brood.name = 'Couvain (%)';
      this.snow.name = 'Neige';
      this.temp.name = 'Température (°F)';
      this.wind.name = 'Vent';
      // EN
    } else {
      this.weight.name = 'Weight (lbs)';
      this.humidity.name = 'Humidity (%)';
      this.weightIncome.gain = 'Gain';
      this.weightIncome.loss = 'Loss';
      this.rain.name = 'Rain';
      this.moon.phase = 'Phase';
      this.moon.period = 'Period';
      this.snow.name = 'Snow';
      this.temp.name = 'Temperature (°F)';
      this.wind.name = 'Wind';
      this.brood.name = 'Brood (%)';
    }
    this.snow.unitT = '″';
    this.humidity.min = 0;
    this.rain.unitT = '″';
    this.wind.unitT = 'mph';
    this.humidity.max = 100;
    this.weight.min = 40;
    this.weight.max = null;
    this.humidity.unitT = '%';
    this.weight.unitW = 'lbs';
    this.weight.interval = 5;
    // If he is French
    this.temp.min = 0;
    this.temp.unitT = '° F';
    this.temp.max = null;
  }

  setMetric() {
    // If he is French
    if (this.translateService.currentLang === 'fr') {
      this.weight.name = 'Poids (Kg)';
      this.humidity.name = 'Humidité (%)';
      this.rain.name = 'Pluie';
      this.snow.name = 'Neige';
      this.moon.phase = 'Phase';
      this.weightIncome.gain = 'Gain';
      this.weightIncome.loss = 'Perte';
      this.moon.period = 'Période';
      this.wind.name = 'Vent';
      this.brood.name = 'Couvain (%)';

      // EN
    } else {
      this.weight.name = 'Weight (Kg)';
      this.humidity.name = 'Humidity (%)';
      this.wind.name = 'Wind';
      this.weightIncome.gain = 'Gain';
      this.weightIncome.loss = 'Loss';
      this.moon.phase = 'Phase';
      this.moon.period = 'Period';
      this.rain.name = 'Rain';
      this.snow.name = 'Snow';
      this.brood.name = 'Brood (%)';
    }
    this.rain.unitT = 'mm';
    this.humidity.min = 0;
    this.snow.unitT = 'mm';
    this.humidity.max = 100;
    this.weight.min = 0;
    this.wind.unitT = 'km/h';
    this.humidity.unitT = '%';
    this.weight.unitW = 'Kg';
    this.weight.interval = 10;
    this.weight.max = null;
    // If he is French
    if (this.translateService.currentLang === 'fr') {
      this.temp.name = 'Température (°C)';
      // EN
    } else {
      this.temp.name = 'Temperature (°C)';
    }
    this.temp.unitT = '° C';
    this.temp.min = 0;
    this.temp.max = null;
  }
  /**
   *
   *
   * @returns {Object}
   * @memberof GraphGlobal
   */
  getWeight(): Object {
    return this.weight;
  }

  /**
   *
   *
   * @returns {Object}
   * @memberof GraphGlobal
   */
  getTemp(): Object {
    return this.temp;
  }

  // Here there are all the graph titles
  /**
   *
   *
   * @param {String} nomGraphe
   * @returns {string}
   * @memberof GraphGlobal
   */
  getTitle(nomGraphe: String): string {
    var titre: any;

    //Found the title with the name of the graph with the right language

    // If he is French
    if (this.translateService.currentLang === 'fr') {
      titre = this.titresFR[this.titresFR.map(elt => elt.graph).indexOf(nomGraphe)];
      // EN
    } else {
      titre = this.titresEN[this.titresEN.map(elt => elt.graph).indexOf(nomGraphe)];
    }

    return titre.titre;
  }

  getTooltipByType(type: Tools): string {
    switch (type.name) {
      case 'WINCOME':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[1].titre;
        } else {
          return this.titresEN[1].titre;
        }
      case 'TEMP_EXT_MAX':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[5].titre + ' max';
        } else {
          return this.titresEN[5].titre + ' max';
        }
      case 'TEMP_EXT_MIN':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[5].titre + ' min';
        } else {
          return this.titresEN[5].titre + ' min';
        }
      case 'TEMP_INT_MAX':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[4].titre + ' max';
        } else {
          return this.titresEN[4].titre + ' max';
        }
      case 'TEMP_INT_MIN':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[4].titre + ' min';
        } else {
          return this.titresEN[4].titre + ' min';
        }
      case 'HRIN':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[3].titre;
        } else {
          return this.titresEN[3].titre;
        }
      case 'BROOD':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[2].titre;
        } else {
          return this.titresEN[2].titre;
        }
      case 'WEIGHT_MAX':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[9].titre + ' max';
        } else {
          return this.titresEN[9].titre + ' max';
        }
      case 'WEATHER':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[13].titre;
        } else {
          return this.titresEN[13].titre;
        }
      case 'MOON':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[14].titre;
        } else {
          return this.titresEN[14].titre;
        }
      case 'RAIN':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[15].titre;
        } else {
          return this.titresEN[15].titre;
        }
      case 'TEMP_EXT_WEATHER_MAX':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[5].titre + ' max';
        } else {
          return this.titresEN[5].titre + ' max';
        }
      case 'TEMP_EXT_WEATHER_MIN':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[5].titre + ' min';
        } else {
          return this.titresEN[5].titre + ' min';
        }
      case 'WIND':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[16].titre;
        } else {
          return this.titresEN[16].titre;
        }
      case 'HEXT_WEATHER_MAX':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[7].titre + ' max';
        } else {
          return this.titresEN[7].titre + ' max';
        }
      case 'HEXT_WEATHER_MIN':
          if (this.translateService.currentLang === 'fr') {
            return this.titresFR[7].titre + ' min';
          } else {
            return this.titresEN[7].titre + ' min';
          }
      case 'ALERT':
        if (this.translateService.currentLang === 'fr') {
          return this.titresFR[10].titre;
        } else {
          return this.titresEN[10].titre;
        }
      default:
        return '';
        break;
    }
  }

  /**
   *
   *
   * @returns {String[]}
   * @memberof GraphGlobal
   */
  getDays(datePicker?: boolean): String[] {
    // If he is French
    if (this.translateService.currentLang === 'fr') {
      return datePicker ? ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa','Di'] : ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
      // EN
    } else {
      return datePicker ? ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    }
  }

  /**
   *
   *
   * @returns {String[]}
   * @memberof GraphGlobal
   */
  getMonth(): String[] {
    // If he is French
    if (this.translateService.currentLang === 'fr') {
      return ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Jui', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];
      // EN
    } else {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
  }

  /**
   *
   *
   * @param {number} value
   * @returns {(string | number)}
   * @memberof GraphGlobal
   */
  getNumberFormat(value: number): string | number {
    if (this.userService.getCountry() === 'FR') {
      return value.toString().replace(/\./g, ',');
    } else {
      return value;
    }
  }

  /**
   *
   *
   * @param {string} value
   * @returns {string}
   * @memberof GraphGlobal
   */
  getStringWeightFormat(value: string): string {
    if (this.userService.getCountry() === 'FR') {
      return value.replace(/\./g, ',');
    } else {
      return value;
    }
  }
  /**
   *
   *
   * @param {string} serie
   * @returns {string}
   * @memberof GraphGlobal
   */
  getUnitBySerieName(serie: string): string {
    if (/Temp/g.test(serie) || /Weather/g.test(serie)) {
      return this.temp.unitT;
    } else if (/Weight/g.test(serie) || /Poids/g.test(serie) || /gain/g.test(serie) || /loss/g.test(serie)) {
      return this.weight.unitW;
    } else if (/Hum/g.test(serie) || /Hint/g.test(serie) || /Brood/g.test(serie)) {
      return this.humidity.unitT;
    }
  }

  /**
   * 
   * @param typeGraph 
   */
  getNameZoneByGraph(typeGraph: string): string {
    if (typeGraph === 'BROOD') {
      if (this.translateService.currentLang === 'en') {
        return 'Optimal area of ​​production';
      } else {
        return 'Zone optimale de production';
      }
    } else if (typeGraph === 'TEMP') {
      if (this.translateService.currentLang === 'fr') {
        return 'Zone optimale du couvain';
      } else {
        return 'Brood Zone';
      }
    } else if (typeGraph === 'HUM') {
      if (this.translateService.currentLang === 'en') {
        return 'Optimal area of humidity';
      } else {
        return 'Zone optimale d\'humidité';
      }
    }
  }

  /**
   *
   *
   * @param {string} unitType
   * @returns
   * @memberof GraphGlobal
   * @description For MelliCharts
   */
  getUnitByType(unitType: string) {
    switch (unitType) {
      case 'T':
        return this.temp.unitT;
      case 'W':
        return this.weight.unitW;
      case 'P':
        return this.humidity.unitT;
      case 'MM':
        return this.rain.unitT;
      case 'V':
        return this.wind.unitT;
      case 'HPA':
          return 'hPa';
      default:
        return '';
    }
  }


  /**
   *
   *
   * @param {number} status
   * @returns {string}
   * @memberof GraphGlobal
   */
  getMoonStatus(status: number): string {
    if (this.translateService.currentLang === 'fr') {
      if (status === 1) {
        return 'Ascendant';
      } else {
        return 'Descendant';
      }
    } else {
      if (status === 1) {
        return 'Ascending';
      } else {
        return 'Descending';
      }
    }

  }

  /**
   * 
   * @param date 
   * @param optionValue 
   */
  getColorCalendarByValue(date: Date, optionValue?: any): string {
    let dateToday = new Date();
    let dateCalendar = new Date(date);
    dateToday.setHours(2);
    dateToday.setMinutes(0);
    dateToday.setSeconds(0);
    dateToday.setMilliseconds(0);
/*     if (dateCalendar.getTime() === dateToday.getTime()) {
      return '#FF2E2C';
    }  */
    if (optionValue === 1) { // Pour calendrier moon
      return '#ABC0C5';
    } else {
      return '#EBEBEB';
    }
  }


  /**
   *
   *
   * @param {string} type
   * @param {*} [optionalValue]
   * @returns {string}
   * @memberof GraphGlobal
   */
  getNameCalendarByType(type: string, optionalValue?: any): string {
    let name: string;
    switch (type) {
      case BROOD:
        name = this.brood.name;
        break;
      case WINCOME:
        if (optionalValue < 0) {
          name = this.weightIncome.loss;
        } else {
          name = this.weightIncome.gain;
        }
        break;
      case HRIN:
        name = this.humidity.name;
        break;
      case WEIGHT_MAX:
        name = this.weight.name;
        break;
      case TEMP_INT_MAX:
      case TEMP_EXT_MAX:
      case TEMP_EXT_WEATHER_MAX:
        name = 'Tmax';
        break;
      case TEMP_INT_MIN:
      case TEMP_EXT_MIN:
      case TEMP_EXT_WEATHER_MIN:
        name = 'Tmin';
        break;
      case WIND:
        name = this.wind.name;
        break;
      default:
        break;
    }
    if (/\(/g.test(name)) {
      name = name.split(' ')[0];
    }
    return name;

  }

  getMessageAlertByCode(code: string): string {
    if (this.translateService.currentLang === 'fr') {
        return NOTIF_CODE[code].FR.Message;
    } else {
        return NOTIF_CODE[code].EN.Message;
    }

}

  /**
   * 
   * @param type 
   * @param extraData 
   */
  getTooltipBySerie(type: Tools, extraData?: any[]): any {
    const tooltip = Object.assign({}, BASE_OPTIONS.tooltip);
    switch (type.name) {
      case 'WEATHER':
        tooltip.formatter = (params) => {
          return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data[0]), new Array(
            {
              name: '',
              value: this.weatherService.getTranslateDescriptionMainDay(params.data[6], this.translateService.currentLang),
              unit: ''
            },
            {
              name: 'Tmax',
              value: this.getNumberFormat(this.unitService.convertTempFromUsePref(params.data[2], this.userPref.getUserPref().unitSystem, true)),
              unit: this.getUnitByType(type.unit)
            },
            {
              name: 'Tmin',
              value: this.getNumberFormat(this.unitService.convertTempFromUsePref(params.data[3], this.userPref.getUserPref().unitSystem, true)),
              unit: this.getUnitByType(type.unit)
            },
            {
              name: 'HRmax',
              value: this.getNumberFormat(params.data[4]),
              unit: this.getUnitByType('P')
            },
            {
              name: 'HRmin',
              value: this.getNumberFormat(params.data[5]),
              unit: this.getUnitByType('P')
            },
            {
               name: 'PressMax',
               value: this.getNumberFormat(params.data[7]),
               unit: this.getUnitByType('HPA')
             },
             {
               name: 'PressMin',
               value: this.getNumberFormat(params.data[8]),
               unit: this.getUnitByType('HPA')
             },
          ));
        };
        break;
      case 'HEXT_WEATHER_MAX':
        tooltip.formatter = (params) => {
          return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data[0]), new Array(
            {
              name: 'HRmax',
              value: this.getNumberFormat(this.unitService.getValRound(params.data[1])),
              unit: this.getUnitByType(type.unit)
            },
          ));
        }
        break;
      case 'HEXT_WEATHER_MIN':
        tooltip.formatter = (params) => {
          return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data[0]), new Array(
            {
              name: 'HRmin',
              value: this.getNumberFormat(this.unitService.getValRound(params.data[1])),
              unit: this.getUnitByType(type.unit)
            },
          ));
        }
        break;
      case 'RAIN':
        tooltip.formatter = (params) => {
          return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data[0]), new Array(
            {
              name: this.rain.name,
              value: this.getNumberFormat(this.unitService.getValRound(params.data[1])),
              unit: this.getUnitByType(type.unit)
            }, {
              name: this.snow.name,
              value: this.getNumberFormat(this.unitService.getValRound(params.data[2])),
              unit: this.getUnitByType(type.unit)
            }));
        }
        break;
      case 'MOON':
        tooltip.formatter = (params) => {
          return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data[0]), new Array(
            {
              name: this.moon.phase,
              value: params.data[1],
              unit: ''
            },
            {
              name: this.moon.period,
              value: this.getMoonStatus(params.data[2]),
              unit: ''
            }
          ));
        }
        break;
      case 'ALERT':
        tooltip.formatter = (params) => {
          const dataByDateTooltip = extraData.filter(_filter => {
            return MyDate.compareToDailyDate(_filter.opsDate, params.data[0]);
          });
          return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data[0]), dataByDateTooltip.map(_singleData => {
            let type = 'Notif';
            let img = '';
            if (_singleData.description) {
              type = 'Inspection';
              img = '<img style={S} src={I} />';
              img = img.replace(/{I}/g, './assets/pictos_alerts/newIcones/inspect.svg');
            } else {
              img = '<img style={S} src=./assets/pictos_alerts/newIcones/' + _singleData.icon + '.svg />';
            }
            img = img.replace(/{S}/g, 'display:inline-block;margin-right:5px;border-radius:20px;width:25px;height:25px; background-color:red;');
            return {
              name: img,
              value: type === 'Inspection' ? this.sliceTextToolip(_singleData.description) : this.alertService.getMessageAlertByCode(_singleData),
              unit: ''
            }
          }));
        }
        break;
      case WINCOME:
        tooltip.formatter = (params) => {
          return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data[0]), new Array(
            {
              name: this.getNameCalendarByType(type.name, params.data[1]),
              value: this.unitService.getValRound(params.data[1]),
              unit: this.getUnitByType(type.unit)
            },
          ));
        }
        break;
      default:
        tooltip.formatter = (params) => {
          return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data[0]), new Array(
            {
              name: this.getNameCalendarByType(type.name),
              value: isString(params.data[1]) ? params.data[1] : this.getNumberFormat(this.unitService.getValRound(params.data[1])),
              unit: this.getUnitByType(type.unit)
            },
          ));
        }
    }
    return tooltip;
  }


  /**
   *
   *
   * @param {string} text
   * @returns {string}
   * @memberof GraphGlobal
   */
  sliceTextToolip(text: string): string {
    let originString: string = text;
    if (/\n/g.test(text)) {
      return originString.replace(/\n/g, '<br/>');
    } else {
      let newString: string;
      while(originString.length >= 100) {
        newString += originString.slice(0, 100) + '<br/>';
        originString = originString.replace(originString.slice(0, 100), '');
      }
      return (newString + originString).replace(/undefined/g, '');
     }
  }
  /**
   *
   *
   * @param {string} serieLabel
   * @returns {*}
   * @memberof GraphGlobal
   */
  getVisualMapBySerie(serieLabel: string): any {
    const visualMap = Object.assign({}, CALENDAR.visualMap);
    switch (serieLabel) {
      case 'WEIGHT_MAX':
        visualMap.type = 'continuous';
        // visualMap.top = 15;
        visualMap.min = this.unitService.getUserPref().unitSystem === 'METRIC' ? 20 : 40;
        visualMap.max = this.unitService.getUserPref().unitSystem === 'METRIC' ? 80 : 180;
        visualMap.inRange.color = ['#313695', '#4575b4', '#74add1',
          '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
        break;
      case 'TEMP_INT_MAX':
        visualMap.type = 'continuous';
        //visualMap.top = 15;
        visualMap.min = this.unitService.getUserPref().unitSystem === 'METRIC' ? 0 : 30;
        visualMap.max = this.unitService.getUserPref().unitSystem === 'METRIC' ? 40 : 100;
        visualMap.inRange.color = ['#313695', '#4575b4', '#74add1',
          '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
        break;
      case 'HRIN':
      case 'HEXT_WEATHER_MAX':
      case 'HEXT_WEATHER_MIN':
        visualMap.type = 'continuous';
        //visualMap.top = 15;
        visualMap.min = 20;
        visualMap.max = 100;
        visualMap.inRange.color = ['#DBDEEA', '#6987C5', '#3563DC', '#002994'];
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
        visualMap.min = this.unitService.getUserPref().unitSystem === 'METRIC' ? 0 : 30;
        visualMap.max = this.unitService.getUserPref().unitSystem === 'METRIC' ? 40 : 100;
        visualMap.inRange.color = ['#313695', '#4575b4', '#74add1',
          '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
        break;
      case 'TEMP_EXT_MAX':
      case 'TEMP_EXT_WEATHER_MAX':
        visualMap.type = 'continuous';
        //visualMap.top = 15;
        visualMap.min = this.unitService.getUserPref().unitSystem === 'METRIC' ? -10 : 10;
        visualMap.max = this.unitService.getUserPref().unitSystem === 'METRIC' ? 40 : 110;
        visualMap.inRange.color = ['#313695', '#4575b4', '#74add1',
          '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
        break;
      case 'TEMP_EXT_MIN':
      case 'TEMP_EXT_WEATHER_MIN':
      case 'TEMP_INT_WEATHER':
        visualMap.type = 'continuous';
        //visualMap.top = 15;
        visualMap.min = this.unitService.getUserPref().unitSystem === 'METRIC' ? -10 : 10;
        visualMap.max = this.unitService.getUserPref().unitSystem === 'METRIC' ? 40 : 110;
        visualMap.inRange.color = ['#313695', '#4575b4', '#74add1',
          '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
        break;
      case 'WIND':
        visualMap.type = 'continuous';
        //visualMap.top = 15;
        visualMap.min = this.unitService.getUserPref().unitSystem === 'METRIC' ? 0 : 0;
        visualMap.max = this.unitService.getUserPref().unitSystem === 'METRIC' ? 125 : 100;
        visualMap.inRange.color = ['#129001', 'yellow', 'red'];
      default:
        break;
    }
    return visualMap;
  }


  getTimeStampFromDate(_date: Date | string): number {
    const date = new Date(_date);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
  }



  getDaySerie(): any {
    const newSerie = Object.assign({}, SERIES.custom);
    newSerie.name = 'thisDay';
    const dayDate = new Date();
    dayDate.setHours(0);
    dayDate.setMinutes(0);
    dayDate.setSeconds(0);
    newSerie.data = [ [dayDate, 0, 'OK', 'OK']];
    newSerie.renderItem = (params, api) => {
      const cellPoint = api.coord(api.value(0));
      const cellWidth = params.coordSys.cellWidth;
      const cellHeight = params.coordSys.cellHeight;
      return {
        type: 'rect',
        z2: 0 ,
        shape: {
          x: -cellWidth / 2 + 2,
          y: -cellHeight / 2 + 2,
          width: cellWidth - 4,
          height: cellHeight - 4,
        },
        position: [cellPoint[0], cellPoint[1]],
        style : {
          fill: 'none',
          stroke : 'red',
          lineWidth : 3
        }
      };
    };

    return newSerie;
  }
  getTooltipFormater(markerSerie: string, date: string, series: Array<any>): string {
    const templateHeaderTooltip = '{*} <B>{D}</B> </br>';
    const templateValue = '{n}: <B>{v} {u}</B>';
    let tooltipGlobal: string;
    tooltipGlobal = templateHeaderTooltip.replace(/{\*}/g, markerSerie).replace(/{D}/g, date);
    tooltipGlobal += series.map(_serie => {
      if (/picto/g.test(_serie.name) || _serie.name === '') {
        return templateValue.replace(/:/g, '').replace(/{n}/g, _serie.name).replace(/{v}/g, _serie.value).replace(/{u}/g, _serie.unit)
      } else {
        return templateValue.replace(/{n}/g, _serie.name).replace(/{v}/g, _serie.value).replace(/{u}/g, _serie.unit);
      }
    }).join('</br>');

    return tooltipGlobal;
  }



}