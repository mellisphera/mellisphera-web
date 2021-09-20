import { OnDestroy } from '@angular/core';
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

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DailyManagerService } from '../service/daily-manager.service';
import { MelliChartsHiveService } from '../../service/melli-charts-hive.service';
import { MelliChartsDateService } from '../../service/melli-charts-date.service';
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';
import { TranslateService } from '@ngx-translate/core';
import * as echarts from 'echarts';

const TITLE_PERIODE_CALENDAR = {
  TEXT_SUM_FR: '\nSomme sur la période: ',
  TEXT_SUM_EN: '\nSum over the period: ',
  TEXT_SUM_ES: '\nSuma durante el período: ',
  TEXT_MEAN_FR: '\nMoyenne sur la période: ',
  TEXT_MEAN_ES: '\nPromedio durante el período: ',
  TEXT_MEAN_EN: '\nPeriod average: '
};

const TITLE_LAST_DAY = {
  TEXT_SUM_FR: '\nSomme sur les 7 derniers jours: ',
  TEXT_SUM_EN: '\nSum last 7 days: ',
  TEXT_SUM_ES: '\nSomme en los últimos 7 días: ',
  TEXT_MEAN_FR: '\nMoyenne sur les 7 dernier jours: ',
  TEXT_MEAN_ES: '\nPromedio de los últimos 7 días: ',
  TEXT_MEAN_EN: '\nMean last 7 days: '
}
declare interface Tools {
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
const ENV = 'ENV';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css']
})
export class DailyComponent implements OnInit, AfterViewInit, OnDestroy {

  public currentTypeDailyDevice: Tools;
  public currentTypeDailyEnv: Tools;
  public calendarElements: HTMLCollection = null;
  public currentTypeDailyOther: Tools;
  public currentDeviceTextPeriodCalendar: string;
  public currentOtherTextPeriodCalendar: string;
  public currentDeviceTextSevenDay: string;
  public currentOtherTextSevenDay: string;
  private typeData: Tools[];
  constructor(public dailyManager: DailyManagerService,
    private translateService: TranslateService,
    public melliHive: MelliChartsHiveService,
    public graphGlobal: GraphGlobal,
    private melliDate: MelliChartsDateService) {
    this.typeData = [
      { name: 'BROOD', id: 'BROOD', unit: 'P', origin: 'DEVICE', class: 'item-type active', icons: './assets/ms-pics/ui/calendbars/brood_cb.png' },
      { name: 'WINCOME', id: 'WINCOME', unit: 'W', origin: 'DEVICE', class: 'item-type', icons: './assets/ms-pics/ui/calendbars/wipos_cb.svg' },
      { name: 'FITNESS', id: 'FITNESS', unit: '', origin: 'DEVICE', class: 'item-type', icons: './assets/ms-pics/ui/calendbars/fitness_cb.png' },
      //{ name: 'WEIGHT_MAX', id: 'WEIGHT_MAX', unit: 'W', origin: 'DEVICE', class: 'item-type', icons: './assets/pictos_alerts/charts/weight_max.png' },
      { name: 'TEMP_INT_MAX', id: 'TEMP_INT_MAX', unit: 'T', origin: 'DEVICE', class: 'item-type', icons: './assets/ms-pics/ui/calendbars/tmax_cb.png' },
      { name: 'TEMP_INT_MIN', id: 'TEMP_INT_MIN', unit: 'T', origin: 'DEVICE', class: 'item-type', icons: './assets/ms-pics/ui/calendbars/tmin_cb.png' },
      { name: 'HRIN', id: 'HRIN', unit: 'P', origin: 'DEVICE', class: 'item-type', icons: './assets/ms-pics/ui/calendbars/hint_max_cb.png' },
      { name: 'WEATHER', id: 'WHEATHER', unit: 'T', origin: 'OTHER', class: 'item-type active', icons: './assets/ms-pics/ui/calendbars/weather_cb.png' },
      { name: 'TEMP_EXT_MAX', id: 'TEMP_EXT_MAX', unit: 'T', origin: 'DEVICE', class: 'item-type', icons: './assets/ms-pics/ui/calendbars/text_max_cb.png' },
      { name: 'TEMP_EXT_MIN', id: 'TEMP_EXT_MIN', unit: 'T', origin: 'DEVICE', class: 'item-type', icons: './assets/ms-pics/ui/calendbars/text_min_cb.png' },
      { name: 'TEMP_EXT_WEATHER_MAX', id: 'TEMP_EXT_WEATHER', unit: 'T', origin: 'OTHER', class: 'item-type', icons: './assets/ms-pics/ui/calendbars/text_max_cb.png' },
      { name: 'TEMP_EXT_WEATHER_MIN', id: 'TEMP_INT_WEATHER', unit: 'T', origin: 'OTHER', class: 'item-type', icons: './assets/ms-pics/ui/calendbars/text_min_cb.png' },
      { name: 'HEXT_WEATHER_MAX', id: 'HEXT_WEATHER_MAX', unit: 'P', origin: 'OTHER', class: 'item-type', icons: './assets/ms-pics/ui/calendbars/hext_max_cb.png' },
      { name: 'HEXT_WEATHER_MIN', id: 'HEXT_WEATHER_MIN', unit: 'P', origin: 'OTHER', class: 'item-type', icons: './assets/ms-pics/ui/calendbars/hext_min_cb.png' },
      { name: 'WIND', id: 'WIND', unit: 'V', origin: 'OTHER', class: 'item-type', icons: './assets/ms-pics/alerts/meteo/wind_cb.png' },
      { name: 'RAIN', id: 'RAIN', unit: 'MM', origin: 'OTHER', class: 'item-type', icons: './assets/ms-pics/ui/calendbars/rain_cb.png' },
      { name: 'ALERT', id: 'ALERT', origin: 'ENV', class: 'item-type active', icons: './assets/ms-pics/ui/calendbars/alerts-events_cb.svg' },
      //{ name: 'EVENT-APIARY', id: 'EVENT-APIARY', origin: 'ENV', class: 'item-type', icons: './assets/ms-pics/ui/calendbars/inspect-api_cb.png' },
      //{ name: 'EVENT-HIVE', id: 'EVENT-HIVE', origin: 'ENV', class: 'item-type', icons: './assets/ms-pics/ui/calendbars/inspect_cb.png' },
      { name: 'MOON', id: 'MOON', origin: 'ENV', class: 'item-type', icons: './assets/ms-pics/ui/calendbars/moon_cb.png' },
    ];

    this.currentTypeDailyDevice = this.typeData.filter(_filter => _filter.origin === DEVICE)[0];
    this.currentTypeDailyOther = this.typeData.filter(_filter => _filter.origin === OTHER)[0];
    this.currentTypeDailyEnv = this.typeData.filter(_filter => _filter.origin === ENV)[0];

  }



  ngOnInit() {
    this.setMeanTextHtml();
    this.calendarElements = document.getElementsByClassName('calendar');
    this.currentTypeDailyDevice = this.typeData.filter(_filter => _filter.origin === DEVICE)[0];
    this.currentTypeDailyOther = this.typeData.filter(_filter => _filter.origin === OTHER)[0];
    this.currentTypeDailyEnv = this.typeData.filter(_filter => _filter.origin === ENV)[0];
  /*this.dailyManager.setMeanAnnotation = (_type: Tools, clear?: boolean) => {
      if (!clear) {
        this.setMeanTextHtml();
        if (_type.origin === DEVICE) {
          const annotationDevice: string = [
            this.currentDeviceTextPeriodCalendar + this.dailyManager.meanPeriodDevice.value + ' ' + this.dailyManager.meanPeriodDevice.unit,
            this.currentDeviceTextSevenDay + this.dailyManager.meanDeviceSevenDay.value + ' ' + this.dailyManager.meanDeviceSevenDay.unit
          ].join('\n');
          this.dailyManager.baseOptionsInt.graphic[0].children[1].style.text = annotationDevice;
          this.melliHive.getDailyDeviceChartInstance().setOption(this.dailyManager.baseOptionsInt);
        } else if (_type.origin === OTHER) {
          const annotationOther: string = [
            this.currentOtherTextPeriodCalendar + this.dailyManager.meanPeriodOther.value + ' ' + this.dailyManager.meanPeriodOther.unit,
            this.currentOtherTextSevenDay + this.dailyManager.meanOtherSevenDay.value + ' ' + this.dailyManager.meanOtherSevenDay.unit
          ].join('\n');
          this.dailyManager.baseOptionExt.graphic[0].children[1].style.text = annotationOther;
          this.melliHive.getDailyOtherChartInstance().setOption(this.dailyManager.baseOptionExt);
        }
      } else {
        if (_type.origin === DEVICE) {
          this.dailyManager.baseOptionsInt.graphic[0].children[1].style.text = '';
        } else if (_type.origin === OTHER) {
          this.dailyManager.baseOptionExt.graphic[0].children[1].style.text = '';
        }
      }
    }; */
    this.initCalendar();
  }

  initCalendar() {
    this.melliHive.setDailyDeviceChartInstance(echarts.init(<HTMLDivElement>document.getElementById('calendar-device')));
    this.melliHive.getDailyDeviceChartInstance().setOption(this.dailyManager.baseOptionsInt);
    this.melliHive.setDailyOtherChartInstance(echarts.init(<HTMLDivElement>document.getElementById('calendar-other')));
    this.melliHive.getDailyOtherChartInstance().setOption(this.dailyManager.baseOptionExt);
    this.melliHive.setDailyEnvChartInstance(echarts.init(<HTMLDivElement>document.getElementById('calendar-env')));
    this.melliHive.getDailyEnvChartInstance().setOption(this.dailyManager.baseOptionEnv);
  }

  checkIfCalendarLoad(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.calendarElements !== null) {
        resolve(true);
      } else {
        reject(false)
      }
    });
  }

  /**
   *
   *
   * @memberof DailyComponent
   */
  setMeanTextHtml(): void {
    if (this.translateService.currentLang === 'fr') {
      if (this.currentTypeDailyOther.name === 'RAIN') {
        this.currentOtherTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_SUM_FR;
        this.currentOtherTextSevenDay = TITLE_LAST_DAY.TEXT_SUM_FR;
      }  else {
        this.currentOtherTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_MEAN_FR;
        this.currentOtherTextSevenDay = TITLE_LAST_DAY.TEXT_MEAN_FR;
      }
      if (this.currentTypeDailyDevice.name === 'WINCOME') {
        this.currentDeviceTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_SUM_FR;
        this.currentDeviceTextSevenDay = TITLE_LAST_DAY.TEXT_SUM_FR;
      } else {
        this.currentDeviceTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_MEAN_FR;
        this.currentDeviceTextSevenDay = TITLE_LAST_DAY.TEXT_MEAN_FR;
      }

    }  else if (this.translateService.currentLang === 'es') {
      if (this.currentTypeDailyOther.name === 'RAIN') {
        this.currentOtherTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_SUM_ES;
        this.currentOtherTextSevenDay = TITLE_LAST_DAY.TEXT_SUM_ES;
      } else {
        this.currentOtherTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_MEAN_ES;
        this.currentOtherTextSevenDay = TITLE_LAST_DAY.TEXT_MEAN_ES;
      }
      if (this.currentTypeDailyDevice.name === 'WINCOME') {
        this.currentDeviceTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_SUM_ES;
        this.currentDeviceTextSevenDay = TITLE_LAST_DAY.TEXT_SUM_ES;
      } else {
        this.currentDeviceTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_MEAN_ES;
        this.currentDeviceTextSevenDay = TITLE_LAST_DAY.TEXT_MEAN_ES;
      }
    } else {
      if (this.currentTypeDailyOther.name === 'RAIN') {
        this.currentOtherTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_SUM_EN;
        this.currentOtherTextSevenDay = TITLE_LAST_DAY.TEXT_SUM_EN;
      } else {
        this.currentOtherTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_MEAN_EN;
        this.currentOtherTextSevenDay = TITLE_LAST_DAY.TEXT_MEAN_EN;
      }
      if (this.currentTypeDailyDevice.name === 'WINCOME') {
        this.currentDeviceTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_SUM_EN;
        this.currentDeviceTextSevenDay = TITLE_LAST_DAY.TEXT_SUM_EN;
      } else {
        this.currentDeviceTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_MEAN_EN;
        this.currentDeviceTextSevenDay = TITLE_LAST_DAY.TEXT_MEAN_EN;
      }
    }
  }

  ngAfterViewInit(): void {
/*     this.melliHive.getDailyOtherChartInstance().on('legendselectchanged', (params) => {
      if (params.name.indexOf('RAIN') !== -1) {
        const origin = params.name.split(':')[0].trim();
        const serieSelected = this.dailyManager.baseOptionExt.series.filter(_serie => _serie.name === params.name)[0];
        this.dailyManager.setMeanData(serieSelected, false, this.currentTypeDailyOther);
      }
    });

    this.melliHive.getDailyDeviceChartInstance().on('legendselectchanged', (params) => {
      //console.log(params);
    }); */
  }


  /**
   *
   *
   * @param {*} event
   * @memberof DailyComponent
   */
  onResize(): void {
    this.melliHive.getDailyDeviceChartInstance().resize({
      width: 'auto',
      height: 'auto'
    });
    this.melliHive.getDailyOtherChartInstance().resize({
      width: 'auto',
      height: 'auto'
    });
    this.melliHive.getDailyEnvChartInstance().resize({
      width: 'auto',
      height: 'auto'
    });
  }



  loadDailyDeviceData(rangeChange: boolean): void {
    this.melliHive.getDailyDeviceChartInstance().showLoading();
    switch (this.currentTypeDailyDevice.name) {
      case 'WINCOME':
        this.dailyManager.getChartWeightincome(this.currentTypeDailyDevice, this.melliHive.getHiveSelect()._id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'TEMP_EXT_MAX':
        this.dailyManager.getChartTextMax(this.currentTypeDailyDevice, this.melliHive.getHiveSelect()._id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'TEMP_EXT_MIN':
        this.dailyManager.getChartTextMin(this.currentTypeDailyDevice, this.melliHive.getHiveSelect()._id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'TEMP_INT_MAX':
        this.dailyManager.getChartTintMax(this.currentTypeDailyDevice, this.melliHive.getHiveSelect()._id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'TEMP_INT_MIN':
        this.dailyManager.getChartTminInt(this.currentTypeDailyDevice, this.melliHive.getHiveSelect()._id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'HRIN':
        this.dailyManager.getChartHint(this.currentTypeDailyDevice, this.melliHive.getHiveSelect()._id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'BROOD':
        this.dailyManager.getChartBrood(this.currentTypeDailyDevice, this.melliHive.getHiveSelect()._id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'WEIGHT_MAX':
        this.dailyManager.getChartWeight(this.currentTypeDailyDevice, this.melliHive.getHiveSelect()._id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'FITNESS':
        this.dailyManager.getChartFitness(this.currentTypeDailyDevice, this.melliHive.getHiveSelect()._id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange)
      default:
        break;
    }
    // this.dailyManager.setOriginChartOption(this.currentTypeDailyDevice.origin);
  }

/*   cleanMeanAnnotation() {
    const annotationOther: string = [
      this.currentOtherTextPeriodCalendar + '',
      this.currentOtherTextSevenDay + ''
    ].join('\n');
    this.dailyManager.baseOptionExt.graphic[0].children[1].style.text = annotationOther;
    this.melliHive.getDailyOtherChartInstance().setOption(this.dailyManager.baseOptionExt);
  } */

  loadDailyOtherData(rangeChange: boolean) {
    this.melliHive.getDailyOtherChartInstance().showLoading();
    switch (this.currentTypeDailyOther.name) {
      case 'WEATHER':
        this.dailyManager.getChartDailyWeather(this.currentTypeDailyOther, this.melliHive.getHiveSelect().apiaryId,
          this.melliHive.getDailyOtherChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'MOON':
        this.dailyManager.getChartAstro(this.currentTypeDailyOther, this.melliHive.getHiveSelect().apiaryId,
          this.melliHive.getDailyOtherChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'RAIN':
        this.dailyManager.gatPrecipitationByApiary(this.currentTypeDailyOther, this.melliHive.getHiveSelect().apiaryId,
          this.melliHive.getDailyOtherChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'TEMP_EXT_WEATHER_MAX':
        this.dailyManager.getChartTempMaxWeather(this.currentTypeDailyOther, this.melliHive.getHiveSelect().apiaryId,
          this.melliHive.getDailyOtherChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'TEMP_EXT_WEATHER_MIN':
        this.dailyManager.getChartTempMinWeather(this.currentTypeDailyOther, this.melliHive.getHiveSelect().apiaryId,
          this.melliHive.getDailyOtherChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'WIND':
        this.dailyManager.getChartWindMaxWeather(this.currentTypeDailyOther, this.melliHive.getHiveSelect().apiaryId,
          this.melliHive.getDailyOtherChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'HEXT_WEATHER_MAX':
        this.dailyManager.getHextMaxWeather(this.currentTypeDailyOther, this.melliHive.getHiveSelect().apiaryId,
          this.melliHive.getDailyOtherChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'HEXT_WEATHER_MIN':
        this.dailyManager.getHextMinWeather(this.currentTypeDailyOther, this.melliHive.getHiveSelect().apiaryId,
          this.melliHive.getDailyOtherChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      default:
        break;
    }
    // this.dailyManager.setOriginChartOption(this.currentTypeDailyOther.origin);
  }


  /**
   *
   *
   * @returns {boolean}
   * @memberof DailyComponent
   */
  displayMeanOtherCalendarIf(): boolean {
    switch (this.currentTypeDailyOther.name) {
      case 'RAIN':
      case 'TEMP_EXT_WEATHER_MAX':
      case 'TEMP_EXT_WEATHER_MIN':
      case 'HEXT_WEATHER_MIN':
      case 'HEXT_WEATHER_MAX':
      case 'HEXT_WEATHER_MAX':
      case 'HEXT_WEATHER_MIN':
      case 'WIND':
        return true;
      default:
        return false;
    }
  }


  loadDailyEnvData(rangeChange: boolean) {
    switch(this.currentTypeDailyEnv.name){
      case 'EVENT-APIARY':
        this.melliHive.getDailyEnvChartInstance().showLoading();
        this.dailyManager.getChartEventApi(this.currentTypeDailyEnv, this.melliHive.getHiveSelect()._id,
          this.melliHive.getDailyEnvChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'EVENT-HIVE':
        this.melliHive.getDailyEnvChartInstance().showLoading();
        this.dailyManager.getChartEvent(this.currentTypeDailyEnv, this.melliHive.getHiveSelect()._id,
          this.melliHive.getDailyEnvChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'ALERT':
        this.melliHive.getDailyEnvChartInstance().showLoading();
        this.dailyManager.getChartAlert(this.currentTypeDailyEnv, this.melliHive.getHiveSelect()._id, 
        this.melliHive.getHiveSelect().apiaryId, this.melliHive.getDailyEnvChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'MOON':
        this.melliHive.getDailyEnvChartInstance().showLoading();
        this.dailyManager.getChartAstro(this.currentTypeDailyEnv, this.melliHive.getHiveSelect().apiaryId,
          this.melliHive.getDailyEnvChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      default:
        break;
    }
    /*if (this.currentTypeDailyEnv.name === 'MOON') {
      this.melliHive.getDailyEnvChartInstance().showLoading();
      this.dailyManager.getChartAstro(this.currentTypeDailyEnv, this.melliHive.getHiveSelect().apiaryId,
        this.melliHive.getDailyEnvChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);

    } else {
      this.melliHive.getDailyEnvChartInstance().showLoading();
      this.dailyManager.getChartAlert(this.currentTypeDailyEnv, this.melliHive.getHiveSelect()._id,
        this.melliHive.getDailyEnvChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
    }*/
  }


  /**
   *
   *
   * @returns {Array<any>}
   * @memberof DailyComponent
   */
  getlabelByType(type: string): Array<any> {
    return this.typeData.filter(_filter => _filter.origin === type);
  }

  /**
   *
   *
   * @param {Tools} type
   * @memberof DailyComponent
   */
  setType(type: Tools): void {
    if (type.origin === DEVICE) {
      let oldIndex: number = this.typeData.map(_type => _type.id).indexOf(this.currentTypeDailyDevice.id);
      if (type.id !== this.currentTypeDailyDevice.id) {
        this.typeData[oldIndex].class = this.typeData[oldIndex].class.replace(/active/g, '');
        let newIndex: number = this.typeData.map(_type => _type.id).indexOf(type.id);
        this.typeData[newIndex].class += ' active';
        this.currentTypeDailyDevice = type;
        this.loadDailyDeviceData(false);
      }
    } else if (type.origin === OTHER) {
      if (type.id !== this.currentTypeDailyOther.id) {
        let oldIndex: number = this.typeData.map(_type => _type.id).indexOf(this.currentTypeDailyOther.id);
        if (type.id !== this.currentTypeDailyDevice.id) {
          this.typeData[oldIndex].class = this.typeData[oldIndex].class.replace(/active/g, '');
          let newIndex: number = this.typeData.map(_type => _type.id).indexOf(type.id);
          this.typeData[newIndex].class += ' active';
          this.currentTypeDailyOther = type;
          this.loadDailyOtherData(false);
        }
      }
    } else if (type.origin === ENV) {
      let oldIndex: number = this.typeData.map(_type => _type.id).indexOf(this.currentTypeDailyEnv.id);
      if (type.id !== this.currentTypeDailyDevice.id) {
        this.typeData[oldIndex].class = this.typeData[oldIndex].class.replace(/active/g, '');
        let newIndex: number = this.typeData.map(_type => _type.id).indexOf(type.id);
        this.typeData[newIndex].class += ' active';
        this.currentTypeDailyEnv = type;
        this.loadDailyEnvData(false);
      }
    }
  }



  /**
   *
   *
   * @memberof DailyComponent
   */
  exportToCsv(origin: string): void {
    if (origin === DEVICE) {
    } else {
    }
  }

  ngOnDestroy():void {
    this.melliHive.dailyDeviceEchartInstances.dispose();
    this.melliHive.dailyEnvChartInstance.dispose();
    this.melliHive.dailyOtherChartIstances.dispose();
  }
}
