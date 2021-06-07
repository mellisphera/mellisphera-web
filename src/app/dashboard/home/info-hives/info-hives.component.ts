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

import { Component, OnInit, OnDestroy, ViewChild, AfterViewChecked, HostListener } from '@angular/core';
import { ObservationService } from '../../service/api/observation.service';
import { RucheService } from '../../service/api/ruche.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DailyRecordService } from '../../service/api/dailyRecordService';
import { DailyRecordsWService } from '../../service/api/daily-records-w.service';
import { RucheInterface } from '../../../_model/ruche';
import { CapteurService } from '../../service/api/capteur.service';
import { AlertsService } from '../../service/api/alerts.service';
import { AlertsHiveComponent } from './alerts-hive/alerts-hive.component';
import { UserloggedService } from '../../../userlogged.service';
import { MyDate } from '../../../class/MyDate';
import { HealthHiveComponent } from './health-hive/health-hive.component';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';
import { WeightHivesComponent } from './weight-hives/weight-hives.component';
import { NotesHivesComponent } from './notes-hives/notes-hives.component';

import { HIVE_POS } from '../../../../constants/hivePositions';
import { TranslateService } from '@ngx-translate/core';

import { isUndefined, isArray, isObject, isString } from 'util';
import { SERIES } from '../../melli-charts/charts/SERIES';
import { UnitService } from '../../service/unit.service';

export interface Tools {
  name?: string;
  id?: string;
  origin?: string;
  type?: string;
  unit?: string;
  class?: string;
  icons?: string;
}

@Component({
  selector: 'app-info-hives',
  templateUrl: './info-hives.component.html',
  styleUrls: ['./info-hives.component.css']
})
export class InfoHivesComponent implements OnInit, OnDestroy, AfterViewChecked {

  private subscription: Subscription;
  screenHeight: any;
  screenWidth: any;
  @ViewChild(AlertsHiveComponent) alertsHiveComponent: AlertsHiveComponent;
  @ViewChild(HealthHiveComponent) healthHiveComponent: HealthHiveComponent;
  @ViewChild(WeightHivesComponent) weightHiveComponent: WeightHivesComponent;
  @ViewChild(NotesHivesComponent) notesHiveComponent: NotesHivesComponent

  constructor(private observationService: ObservationService,
    public rucheService: RucheService,
    private userService: UserloggedService,
    private route: ActivatedRoute,
    public dailyRecordThService: DailyRecordService,
    public capteurService: CapteurService,
    private graphGlobal: GraphGlobal,
    public dailyRecordWservice: DailyRecordsWService,
    private alertsService: AlertsService,
    private translateService: TranslateService,
    private unitService: UnitService) {

    this.getScreenSize();

  }


  ngOnInit() {
    // this.observationService.getObservationByhiveId(this.userService.getIdUserLoged());
    // this.observationService.obsHiveSubject.subscribe();
    this.dailyRecordWservice.getDailyRecordsWbyhiveId(this.rucheService.getCurrentHive()._id);
    this.loadHealthCalendar();
    this.loadProductivityCalendar();
    // this.capteurService.getUserCapteurs();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }
  existSeries(serieArray): boolean {
    if (isUndefined(serieArray) || serieArray.length < 1 || serieArray.length > 0) {
      return true;
    } else {
      return false;
    }
  }


  getNameSerieByPosition(elt: any): string{
    if(elt.values[0].position == null || elt.values[0].position == undefined || elt.values[0].position === "" ){
      return elt.values[0].sensorRef;
    }
    else{
      let nameSerie = elt.values[0].position;
      let hivePos = HIVE_POS.find(_hiveP => _hiveP.name === nameSerie);
      if(this.translateService.currentLang == 'fr'){
        return hivePos.translations.fr;
      }
      if(this.translateService.currentLang == 'en'){
        return hivePos.translations.en;
      }
      if(this.translateService.currentLang == 'es'){
        return hivePos.translations.es;
      }
      if(this.translateService.currentLang == 'nl'){
        return hivePos.translations.nl;
      }
    }
  }

  loadHealthCalendar() {
    if (this.healthHiveComponent.chartInstance !== null) {
      this.healthHiveComponent.chartInstance.showLoading();
    }
    this.healthHiveComponent.initGraph();
    let option = JSON.parse(JSON.stringify(this.healthHiveComponent.option));
    option.baseOption.series = new Array();
    this.dailyRecordThService.getBroodByHive(this.rucheService.getCurrentHive()._id, MyDate.getRangeForCalendarAlerts()).subscribe(
      _brood => {
        let posTab = _brood.map(_val => _val.values.map(_v => _v.position)).flat();
        posTab.map((_pos,index) => {
          let hivePos = HIVE_POS.find(_hiveP => _hiveP.name === _pos);
          if(hivePos != undefined){
            if(this.translateService.currentLang == 'fr'){
              posTab[index] = hivePos.translations.fr;
            }
            if(this.translateService.currentLang == 'en'){
              posTab[index] = hivePos.translations.en;
            }
            if(this.translateService.currentLang == 'es'){
              posTab[index] = hivePos.translations.es;
            }
            if(this.translateService.currentLang == 'nl'){
              posTab[index] = hivePos.translations.nl;
            }
          }
        });
        let posSet = new Set([...posTab].concat([..._brood.map(_val => _val.values.map(_v => _v.sensorRef)).flat()]));
        option.baseOption.legend.data = [...posSet];
        _brood.forEach(elt => {
          let nameSerie = this.getNameSerieByPosition(elt);
          let serie = {
            type: 'heatmap',
            name: nameSerie,
            coordinateSystem: 'calendar',
            data: elt.values.map(_val => [_val.recordDate, _val.brood])
          };
         option.baseOption.series.push(serie);
        });
        console.log(option.baseOption.series);
        option.baseOption.tooltip = this.graphGlobal.getTooltipBySerie({type: 'BROOD', name: 'BROOD', unit: 'P'});
        option.baseOption.series.push(this.graphGlobal.getDaySerie());

       // this.healthHiveComponent.option.baseOption.serie = this.dailyRecordThService.mergeOptionCalendarHealth.series;
        this.healthHiveComponent.chartInstance.clear();
        this.healthHiveComponent.chartInstance.setOption(option, true);
        this.healthHiveComponent.option = option;
        if (this.healthHiveComponent.chartInstance !== null) {
          this.healthHiveComponent.chartInstance.hideLoading();
        }
      }
    );
  }

  loadProductivityCalendar(){
    if (this.weightHiveComponent.echartInstance != null) {
      this.weightHiveComponent.echartInstance.showLoading();
    }
    this.weightHiveComponent.initGraph();
    let option = JSON.parse(JSON.stringify(this.weightHiveComponent.option));
    option.baseOption.series = new Array();
    this.dailyRecordWservice.getDailyRecordsWbyHiveForMelliCharts(this.rucheService.getCurrentHive()._id, MyDate.getRangeForCalendarAlerts()).subscribe(
      _dailyW => {
        option.baseOption.legend.selectedMode = 'multiple';
        this.getSerieByData(_dailyW.weightIncomeHight, 'gain', SERIES.effectScatter, (serieComplete) => {
          console.log(serieComplete.name);
          option.baseOption.legend.data.push(serieComplete.name);
          serieComplete.itemStyle = {
              normal: {
                color: '#00FE0C'
              }
          };
          serieComplete.symbolSize = (val: Array<any>) => {
            if (val[1] >= 0) {
              if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                return (0.4 * Math.sqrt((1000 * val[1])));
              } else {
                return (0.4 * Math.sqrt((1000 * val[1] * 0.45)));
              }
            }
            return 0;
          }
          option.baseOption.series.push(serieComplete);
        });
        this.getSerieByData(_dailyW.weightIncomeLow, 'loss', SERIES.effectScatter, (serieComplete) => {
          serieComplete.itemStyle = {
            normal: {
              color: '#FE0000'
            }
          };
          let type: Tools = { name: 'WINCOME', id: 'WINCOME', unit: 'W', origin: 'DEVICE', class: 'item-type', icons: './assets/ms-pics/wipos_cb.png' };
          option.baseOption.legend.data.push(serieComplete.name);
          option.baseOption.visualMap = null;
          option.baseOption.tooltip = this.graphGlobal.getTooltipBySerie(type);
          serieComplete.symbolSize = (val: Array<any>) => {
            if (val[1] < 0) {
              if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                return (0.4 * Math.sqrt(Math.abs(1000 * val[1])));
              } else {
                return (0.4 * Math.sqrt(Math.abs(1000 * val[1] * 0.45)));
              }
            }
            return 0;
          };
          option.baseOption.series.push(serieComplete);
        });
        option.baseOption.series.push(this.graphGlobal.getDaySerie());
        this.weightHiveComponent.echartInstance.clear();
        this.weightHiveComponent.echartInstance.setOption(option, true);
        this.weightHiveComponent.option = option;
        if (this.weightHiveComponent.echartInstance != null) {
          this.weightHiveComponent.echartInstance.hideLoading();
        }
      }
    );
  }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    if (this.screenWidth > 990) {
      const height = document.getElementById('cadre').offsetHeight;
      document.getElementById('left').style.top = '' + (0 + height) + 'px';
    }
  }

  onChangeNote(event: any): void {
    this.alertsHiveComponent.initCalendar();
  }

  getSerieByData(data: Array<any>, nameSerie: string, serieTemplate: any, next: Function): void {
    let sensorRef: Array<string> = [];
    data.forEach((_data) => {
      if (sensorRef.indexOf(_data.sensorRef) === -1) {
        sensorRef.push(_data.sensorRef);
        let serieTmp = Object.assign({}, serieTemplate);
        if (nameSerie === 'gain' || nameSerie === 'loss') {
          if(_data.position === "" || _data.position == null || _data.position == undefined){
            serieTmp.name = nameSerie + ' | ' + _data.sensorRef;
          }
          else{
            let hivePos = HIVE_POS.filter(_hiveP => _hiveP.name === _data.position)[0];
            if(this.translateService.currentLang == 'fr'){
              serieTmp.name = nameSerie + ' | ' + hivePos.translations.fr;
            }
            if(this.translateService.currentLang == 'en'){
              serieTmp.name = nameSerie + ' | ' + hivePos.translations.en;
            }
            if(this.translateService.currentLang == 'es'){
              serieTmp.name = nameSerie + ' | ' + hivePos.translations.es;
            }
            if(this.translateService.currentLang == 'nl'){
              serieTmp.name = nameSerie + ' | ' + hivePos.translations.nl;
            }
          }
        } else {
          if(_data.position === "" || _data.position == null || _data.position == undefined){
            serieTmp.name = nameSerie + ' | '  + _data.sensorRef;
          }
          else{
            let hivePos = HIVE_POS.filter(_hiveP => _hiveP.name === _data.position)[0];
            if(this.translateService.currentLang == 'fr'){
              serieTmp.name = nameSerie + ' | ' + hivePos.translations.fr;
            }
            if(this.translateService.currentLang == 'en'){
              serieTmp.name = nameSerie + ' | ' + hivePos.translations.en;
            }
            if(this.translateService.currentLang == 'es'){
              serieTmp.name = nameSerie + ' | ' + hivePos.translations.es;
            }
            if(this.translateService.currentLang == 'nl'){
              serieTmp.name = nameSerie + ' | ' + hivePos.translations.nl;
            }
          }
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

  getValueBySerie(_value: any, name: string): Array<any> {
    let value: any = {};
    if (isArray(_value) && isObject(_value[0])) {
      _value.forEach(elt => {
        value = Object.assign(value, elt);
      });
    } else {
      value = _value;
    }
    return [value];
  }


  ngOnDestroy() {
    // this.observationService.obsHiveSubject.unsubscribe();
  }

}
