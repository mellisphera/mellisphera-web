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

import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { DailyManagerService } from '../service/daily-manager.service';
import { MelliChartsHiveService } from '../../service/melli-charts-hive.service';
import { MelliChartsDateService } from '../../service/melli-charts-date.service';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import * as echarts from 'echarts';
import { UserParamsService } from '../../../preference-config/service/user-params.service';
import { WeatherService } from '../../../service/api/weather.service';

const TITLE_PERIODE_CALENDAR = {
  TEXT_SUM_FR: 'Somme sur la période:',
  TEXT_SUM_EN: 'Sum of period: ',
  TEXT_MEAN_FR: 'Moyenne sur la période: ',
  TEXT_MEAN_EN: 'Mean of periode: '
};

const TITLE_LAST_DAY = {
  TEXT_SUM_FR: 'Somme sur les 7 derniers jours:',
  TEXT_SUM_EN: 'Sum last 7 days: ',
  TEXT_MEAN_FR: 'Moyenne sur les 7 dernier jours: ',
  TEXT_MEAN_EN: 'Mean last 7 days: '
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
export class DailyComponent implements OnInit, AfterViewInit {

  private currentEltTypeDaily: HTMLElement;
  private currentTypeDailyDevice: Tools;
  private currentTypeDailyEnv: Tools;
  public currentTypeDailyOther: Tools;
  public currentDeviceTextPeriodCalendar: string;
  public currentOtherTextPeriodCalendar: string;
  public currentDeviceTextSevenDay: string;
  public currentOtherTextSevenDay: string;
  private optionCsv: Object;
  private typeData: Tools[];
  constructor(private renderer: Renderer2,
    public dailyManager: DailyManagerService,
    private userService: UserParamsService,
    private weatherService: WeatherService,
    private melliHive: MelliChartsHiveService,
    private melliDate: MelliChartsDateService) {
    this.typeData = [
      { name: 'WINCOME', id: 'WINCOME', unit: 'W', origin: 'DEVICE', class: 'item-type active', icons: './assets/picto_mellicharts/Win.png' },
      { name: 'TEMP_INT_MAX', id: 'TEMP_INT_MAX', unit: 'T', origin: 'DEVICE', class: 'item-type', icons: './assets/picto_mellicharts/Tim.png' },
      { name: 'TEMP_INT_MIN', id: 'TEMP_INT_MIN', unit: 'T', origin: 'DEVICE', class: 'item-type', icons: './assets/picto_mellicharts/Timi.png' },
      { name: 'TEMP_EXT_MAX', id: 'TEMP_EXT_MAX', unit: 'T', origin: 'DEVICE', class: 'item-type', icons: './assets/picto_mellicharts/Tema.png' },
      { name: 'TEMP_EXT_MIN', id: 'TEMP_EXT_MIN', unit: 'T', origin: 'DEVICE', class: 'item-type', icons: './assets/picto_mellicharts/Temi.png' },
      { name: 'WEATHER', id: 'WHEATHER', unit: 'T', origin: 'OTHER', class: 'item-type active', icons: './assets/picto_mellicharts/weather.png' },
      { name: 'WEIGHT_MAX', id: 'WEIGHT_MAX', unit: 'W', origin: 'DEVICE', class: 'item-type', icons: './assets/picto_mellicharts/Wma.png' },
      { name: 'HRIN', id: 'HRIN', unit: 'P', origin: 'DEVICE', class: 'item-type', icons: './assets/picto_mellicharts/He.png' },
      { name: 'BROOD', id: 'BROOD', unit: 'P', origin: 'DEVICE', class: 'item-type', icons: './assets/picto_mellicharts/Br.png' },
      { name: 'ASTRO', id: 'ASTRO', origin: 'OTHER', class: 'item-type', icons: '/assets/picto_mellicharts/moon.png' },
      { name: 'RAIN', id: 'RAIN', unit: 'MM', origin: 'OTHER', class: 'item-type', icons: './assets/picto_mellicharts/rain.png' },
      { name: 'ALERT', id: 'ALERT', origin: 'ENV', class: 'item-type active', icons: './assets/picto_mellicharts/alert.svg'}
    ];

    this.optionCsv = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Your title',
      useBom: true,
      noDownload: false,
      headers: ['Date', 'Value'],
      nullToEmptyString: false,
    };
/*     if (this.userService.getUserPref().lang === 'FR') {
      this.currentDeviceTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_MEAN_FR;
      this.currentDeviceTextSevenDay = TITLE_LAST_DAY.TEXT_MEAN_FR;
    } else {
      this.currentDeviceTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_MEAN_EN;
      this.currentDeviceTextSevenDay = TITLE_LAST_DAY.TEXT_MEAN_EN;
    } */
    this.currentTypeDailyDevice = this.typeData.filter(_filter => _filter.origin === DEVICE)[0];
    this.currentTypeDailyOther = this.typeData.filter(_filter => _filter.origin === OTHER)[0];
    this.currentTypeDailyEnv = this.typeData.filter(_filter => _filter.origin === ENV)[0];
    this.setMeanTextHtml();

  }


  ngOnInit() {
    this.melliHive.setDailyDeviceChartInstance(echarts.init(<HTMLDivElement>document.getElementById('calendar-device')));
    this.melliHive.getDailyDeviceChartInstance().setOption(this.dailyManager.baseOptionsInt);
    this.melliHive.setDailyOtherChartInstance(echarts.init(<HTMLDivElement>document.getElementById('calendar-other')));
    this.melliHive.getDailyOtherChartInstance().setOption(this.dailyManager.baseOptionExt);
    this.melliHive.setDailyEnvChartInstance(echarts.init(<HTMLDivElement>document.getElementById('calendar-env')));
    this.melliHive.getDailyEnvChartInstance().setOption(this.dailyManager.baseOptionEnv);
  }

  /**
   *
   *
   * @memberof DailyComponent
   */
  setMeanTextHtml(): void {
    if (this.userService.getUserPref().lang === 'FR') {
      if (this.currentTypeDailyOther.name === 'RAIN'){
        this.currentOtherTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_SUM_FR
        this.currentOtherTextSevenDay = TITLE_LAST_DAY.TEXT_SUM_FR;
      } else {}
       if (this.currentTypeDailyDevice.name === 'WINCOME'){
        this.currentDeviceTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_SUM_FR;
        this.currentDeviceTextSevenDay = TITLE_LAST_DAY.TEXT_SUM_FR;
      } else {
        this.currentDeviceTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_MEAN_FR;
        this.currentDeviceTextSevenDay = TITLE_LAST_DAY.TEXT_MEAN_FR;
      }
    } else {
      if (this.currentTypeDailyOther.name === 'RAIN'){
        this.currentOtherTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_SUM_EN
        this.currentOtherTextSevenDay = TITLE_LAST_DAY.TEXT_SUM_EN;
      } 
      if (this.currentTypeDailyDevice.name === 'WINCOME'){
        this.currentDeviceTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_SUM_EN;
        this.currentDeviceTextSevenDay = TITLE_LAST_DAY.TEXT_SUM_EN;
      } else {
        this.currentDeviceTextPeriodCalendar = TITLE_PERIODE_CALENDAR.TEXT_MEAN_EN;
        this.currentDeviceTextSevenDay = TITLE_LAST_DAY.TEXT_MEAN_EN;
      }
    }

    console.error(this.currentDeviceTextPeriodCalendar);
  }

  ngAfterViewInit(): void {
    this.melliHive.getDailyOtherChartInstance().on('legendselectchanged', (params) => {
      if (params.name.indexOf('RAIN') !== -1) {
        console.log(params);
        const origin = params.name.split(':')[0].trim();
        const serieSelected = this.dailyManager.baseOptionExt.series.filter(_serie => _serie.name === params.name)[0];
        this.dailyManager.setMeanData(serieSelected, false, this.currentTypeDailyOther);
        // this.dailyManager.setMeanSevenDay(serieSelected)
        //this.weatherService.getRainAllWeather(this.melliHive.getHiveSelect().idApiary, this.melliDate.getRangeForReqest());
      }
    });
    
    this.melliHive.getDailyDeviceChartInstance().on('legendselectchanged', (params) => {
      console.log(params);
    });
  }


  /**
   *
   *
   * @param {*} event
   * @memberof DailyComponent
   */
  onResize(event: any): void {
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
    switch (this.currentTypeDailyDevice.name) {
      case 'WINCOME':
        this.dailyManager.getChartWeightincome(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'TEMP_EXT_MAX':
        this.dailyManager.getChartTextMax(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'TEMP_EXT_MIN':
        this.dailyManager.getChartTextMin(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'TEMP_INT_MAX':
        this.dailyManager.getChartTintMax(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'TEMP_INT_MIN':
        this.dailyManager.getChartTminInt(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'HRIN':
        this.dailyManager.getChartHint(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'BROOD':
        this.dailyManager.getChartBrood(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'WEIGHT_MAX':
        this.dailyManager.getChartWeight(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id,
          this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      default:
        break;
    }
    // this.dailyManager.setOriginChartOption(this.currentTypeDailyDevice.origin);


  }

  loadDailyOtherData(rangeChange: boolean) {
    switch (this.currentTypeDailyOther.name) {
      case 'WEATHER':
        this.dailyManager.getChartDailyWeather(this.currentTypeDailyOther, this.melliHive.getHiveSelect().idApiary,
          this.melliHive.getDailyOtherChartInstance(), this.melliDate.getRangeForReqest(), rangeChange)
        break;
      case 'ASTRO':
        this.dailyManager.getChartAstro(this.currentTypeDailyOther, this.melliHive.getHiveSelect().idApiary,
          this.melliHive.getDailyOtherChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'RAIN':
        this.dailyManager.getRainByApiary(this.currentTypeDailyOther, this.melliHive.getHiveSelect().idApiary,
          this.melliHive.getDailyOtherChartInstance(), this.melliDate.getRangeForReqest(), rangeChange)
        break;
      default:
        break;
    }
    // this.dailyManager.setOriginChartOption(this.currentTypeDailyOther.origin);
  }


  loadDailyEnvData(rangeChange: boolean) {
    this.dailyManager.getChartAlert(this.currentTypeDailyEnv, this.melliHive.getHiveSelect().id,
    this.melliHive.getDailyEnvChartInstance(), this.melliDate.getRangeForReqest(), rangeChange)
/*     switch (this.currentTypeDailyEnv.name) {
      case 'ALERT':
        this.dailyManager.getChartAlert(this.currentTypeDailyEnv, this.melliHive.getHiveSelect().id,
          this.melliHive.getDailyEnvChartInstance(), this.melliDate.getRangeForReqest(), rangeChange)
        break;
      default:
        break;
    } */
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
    this.setMeanTextHtml();
  }



  /**
   *
   *
   * @memberof DailyComponent
   */
  exportToCsv(origin: string): void {
    if (origin === DEVICE) {
      const data = this.melliHive.getDailyDeviceChartInstance().getOption().series.map(_series => _series.data).flat();
      let csv = new Angular5Csv(data, this.currentTypeDailyDevice.name, this.optionCsv);
    } else {
      const data = this.melliHive.getDailyOtherChartInstance().getOption().series.map(_series => _series.data).flat();
      let csv = new Angular5Csv(data, this.currentTypeDailyOther.name, this.optionCsv);
    }
  }
}
