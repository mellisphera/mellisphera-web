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

import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { AlertsService } from '../../../service/api/alerts.service';
import { RucherService } from '../../../service/api/rucher.service';
import { AlertInterface } from '../../../../_model/alert';
import { UserloggedService } from '../../../../userlogged.service';
import { NotifierService } from 'angular-notifier';
import { RucheService } from '../../../service/api/ruche.service';
import { DailyRecordService } from '../../../service/api/dailyRecordService' //A suppr
import { MyDate } from '../../../../class/MyDate';
import { UnitService } from '../../../service/unit.service';
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';
import { RucheInterface } from '../../../../_model/ruche';
import { Observable } from 'rxjs';
import { MyNotifierService } from '../../../service/my-notifier.service';
import { NotifList } from '../../../../../constants/notify';
import { ObservationService } from '../../../service/api/observation.service';
import { BASE_OPTIONS } from '../../../melli-charts/charts/BASE_OPTIONS';
import { SERIES } from '../../../melli-charts/charts/SERIES';
import { GLOBAL_ICONS } from '../../../melli-charts/charts/icons/icons';
import * as echarts from 'echarts';
import { MEDIA_QUERY_MELLIUX } from '../../../../dashboard/melli-charts/charts/MEDIA';


@Component({
  selector: 'app-alerts-hive',
  templateUrl: './alerts-hive.component.html',
  styleUrls: ['./alerts-hive.component.css']
})
export class AlertsHiveComponent implements OnInit, OnDestroy {

  private option: {
    baseOption: any,
    media: Array<any>
  };
  private img: string;
  private echartInstance: any;
  private readonly notifier: NotifierService;
  // tabPos[Nombre d'alertes dans le jour][x ou y][rang de la prochaine alerte a traiter]
  private tabPos: number[][][];
  public noData: boolean;
  // map repertoriant le nombre d'alerts par jour
  // Sous la forme date => [Les nombres d'alertes correspondants][Le rang de la prochaine alerte a placer dans le tableau]
  private mapDateNbAlerts: Map<string, number[]>;

  private eltOnClickId: EventTarget;

  constructor(
    private unitService: UnitService,
    private graphGlobal: GraphGlobal,
    private dailyRecordThService: DailyRecordService,
    private alertsService: AlertsService,
    public rucherService: RucherService,
    public rucheService: RucheService,
    private userService: UserloggedService,
    public notifierService: NotifierService,
    private renderer: Renderer2,
    private myNotifer: MyNotifierService,
    private observationService: ObservationService) {
    this.echartInstance = null;
    this.noData = true;
    this.img = 'M581.176,290.588C581.176,130.087,451.09,0,290.588,0S0,130.087,0,290.588s130.087,290.588,290.588,290.588' +
      'c67.901,0,130.208-23.465,179.68-62.476L254.265,302.696h326.306C580.716,298.652,581.176,294.681,581.176,290.588z' +
      'M447.99,217.941c-26.758,0-48.431-21.697-48.431-48.431s21.673-48.431,48.431-48.431c26.758,0,48.431,21.697,48.431,48.431' +
      'S474.749,217.941,447.99,217.941z';
    this.notifier = this.notifierService;
    this.echartInstance = null;
    this.eltOnClickId = null;
    this.mapDateNbAlerts = new Map();
    this.tabPos = [
      [
        [0],
        [0]
      ],
      [
        [0.2, -0.2],
        [0, 0]
      ],
      [
        [0.3, 0.1, -0.1],
        [-0.15, 0.3, -0.15]
      ],
      [
        [0.3, 0.3, -0.1, -0.1],
        [-0.15, 0.3, -0.15, 0.3]
      ],
      [
        [0.25, -0.05, -0.2, 0.1, 0.4],
        [0.3, 0.3, -0.15, -0.15, -0.15]]
    ];
    this.cleanOption();
  }

  cleanOption() {
    this.option = {
      baseOption: {},
      media: JSON.parse(JSON.stringify(MEDIA_QUERY_MELLIUX))
    };
    this.option.baseOption = JSON.parse(JSON.stringify(BASE_OPTIONS.baseOptionDailyMelliUx));
    this.option.baseOption.title.text = this.graphGlobal.getTitle('AlertsHive');
    this.option.baseOption.title.left = 'center'
    this.option.baseOption.calendar.orient = 'vertical';
    this.option.baseOption.calendar.range = MyDate.getRangeForCalendarAlerts();
    this.option.baseOption.calendar.top = 60;
    this.option.baseOption.calendar.left = 'center';
    //this.option.calendar.bottom = '3%';
    //this.option.calendar.height = '80%';
    //this.option.calendar.width = '77%';
    this.option.baseOption.calendar.cellSize = [40, 40];
    this.option.baseOption.series = new Array();
    /*        top: 70,
        left: '15%',
        bottom: '3%',
        height: '45%',
        width: '77%',
        range: MyDate.getRangeForCalendarAlerts(),
        orient: 'horizontal',
        cellSize: ['20', '20'], */
  }

  ngOnInit() {
    if (this.echartInstance == null) {
      this.echartInstance = echarts.init(<HTMLDivElement>document.getElementById('graph'));
      this.loadCalendar();
    }
  }

  hideCalendar() {
    this.eltOnClickId = document.getElementById('graph');
    this.renderer.addClass(this.eltOnClickId, 'hideCalendar');
    this.eltOnClickId = document.getElementById('message');
    this.renderer.removeClass(this.eltOnClickId, 'hideMessage');
  }

  showCalendar() {
    this.eltOnClickId = document.getElementById('graph');
    this.renderer.removeClass(this.eltOnClickId, 'hideCalendar');
    this.eltOnClickId = document.getElementById('message');
    this.renderer.addClass(this.eltOnClickId, 'hideMessage');
  }

  cleanSerie(): void {
    this.option.baseOption.series.clear;
    this.option.baseOption.series = new Array();
    this.echartInstance.clear();
  }

  initCalendar(hive?: RucheInterface) {
    this.echartInstance.clear();
    this.cleanOption();
    this.loadCalendar();
  }

  joinObservationAlert(_obs: any[], _alert: any[]): any[] {
    return _obs.concat(_alert).map(_elt => {
      return { date: _elt.opsDate, value: 0, sensorRef: _elt.description ? 'Inspections' : 'Notifications' }
    });
  }

  getSerieByData(data: Array<any>, nameSerie: string, serieTemplate: any, next: Function): void {
    const sensorRef: Array<string> = [];
    data.forEach((_data) => {
      if (sensorRef.indexOf(_data.sensorRef) === -1) {
        sensorRef.push(_data.sensorRef);
        const serieTmp = Object.assign({}, serieTemplate);
        serieTmp.name = _data.sensorRef;
        if (data.map(_elt => _elt.date)[0] !== undefined) {
          serieTmp.data = data.filter(_filter => _filter.sensorRef === _data.sensorRef).map(_map => {
            return [_map.date, _map.value, _map.sensorRef];
          });
        } else {

          serieTmp.data = data;
        }
        next(serieTmp);
      }
    });
  }

  loadCalendar() {
    const obs: Array<Observable<any>> = [
      this.observationService.getObservationByHiveForMelliCharts(this.rucheService.getCurrentHive()._id, MyDate.getRangeForCalendarAlerts()),
      this.alertsService.getAlertByHive(this.rucheService.getCurrentHive()._id, MyDate.getRangeForCalendarAlerts())
    ];
    Observable.forkJoin(obs).subscribe(
      _data => {
        const dateJoin = this.joinObservationAlert(_data[0].filter(_note => _note.type === 'hive'), _data[1]);
        const joinData = _data[0].concat(_data[1]);
        this.noData = !(joinData.length > 0);
        const option = Object.assign({}, this.option);
        option.baseOption.legend = JSON.parse(JSON.stringify(BASE_OPTIONS.legend));
        option.baseOption.legend.top = 30;
        option.baseOption.legend.left = 'center';
        option.baseOption.legend.selectedMode = 'multiple';
        this.getSerieByData(dateJoin, 'alert', SERIES.custom, (serieComplete: any) => {
          serieComplete.renderItem = (params, api) => {
            const cellPoint = api.coord(api.value(0));
            const cellWidth = params.coordSys.cellWidth;
            const cellHeight = params.coordSys.cellHeight;
            const group = {
              type: 'group',
              width: cellWidth,
              height: cellHeight,
              children: []
            };
            const dataByDate: any[] = joinData.filter((_filter: AlertInterface) => {
              return this.graphGlobal.compareToDate(_filter.opsDate, api.value(0));
            });
            if (dataByDate.length >= 1) {
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
                  fill: this.getColorCalendarByValue(api.value(0)),
                  stroke: 'black'
                }
              });
            }
            if (dataByDate.length > 1) {
              let path: any;
              const nbNote = dataByDate.filter(_elt => _elt.description).length;
              //console.log(nbNote + '===' + dataByDate.length)
              console.log(nbNote);
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
                group.children = group.children.concat(this.alertsService.getPicto(dataByDate[0].icon, cellPoint, params.coordSys));
              }
            }
            return group;
          };
          option.baseOption.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          //option.calendar.range = MyDate.getRangeForCalendarAlerts();
          option.baseOption.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.baseOption.legend.data.push(serieComplete.name);
          option.baseOption.tooltip = this.getTooltipBySerie(joinData);
          option.baseOption.series.push(serieComplete);

        });
        option.baseOption.series.push(this.graphGlobal.getDaySerie());
        this.echartInstance.setOption(option, true);
        this.option = option;
      });
  }
  renderItem() {

  }

  onResize(event) {
    this.echartInstance.resize({
      width: 'auto',
      height: 'auto'
    });
  }


  getTooltipFormater(markerSerie: string, date: string, series: Array<any>): string {
    let templateHeaderTooltip = '{*} <B>{D}</B> </br>';
    let templateValue = '{n}: <B>{v} {u}</B>';
    let tooltipGlobal;
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

  getColorCalendarByValue(date: Date, optionValue?: any): string {
    let dateToday = new Date();
    let dateCalendar = new Date(date);
    dateToday.setHours(2);
    dateToday.setMinutes(0);
    dateToday.setSeconds(0);
    dateToday.setMilliseconds(0);
    dateCalendar.setMilliseconds(0);
    if (dateCalendar.getTime() === dateToday.getTime()) {
      return '#FF2E2C';
    } else if (optionValue === 1) { // Pour calendrier moon
      return '#ABC0C5';
    } else {
      return '#EBEBEB';
    }
  }

  getTooltipBySerie(extraData?: any[]): any {
    const tooltip = Object.assign({}, BASE_OPTIONS.tooltip);
    tooltip.formatter = (params) => {
      if (params.data[3] !== 'OK') {
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
            value: type === 'Inspection' ? this.sliceTextToolip(_singleData.description) : this.alertsService.getMessageAlertByCode(_singleData),
            unit: ''
          }
        }));
      }
    }
    return tooltip;
  }
  sliceTextToolip(text: string): string {
    try {
      let originString = '';
      originString = text;
      let newString: string;
      while (originString.length >= 70) {
        newString += originString.slice(0, 70) + '<br/>';
        originString = originString.replace(originString.slice(0, 70), '');
      }
      return (newString + originString).replace(/undefined/g, '');
    } catch{ }
  }


  getTimeStampFromDate(_date: Date | string): number {
    const date = new Date(_date);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
  }

  onClickRead(alert: AlertInterface, i: number) {
    /*     this.alertsService.updateAlert(alert._id, true).subscribe(() => { }, () => { }, () => {
          this.alertsService.hiveAlerts[i].check = true;
    
          let alertIndexUpdate = this.alertsService.apiaryAlertsActives.map(alertMap => alertMap._id).indexOf(alert._id);
          this.alertsService.apiaryAlertsActives.splice(alertIndexUpdate, 1);
    
          if (this.userService.getJwtReponse().country === "FR") {
            this.notifier.notify('success', 'Alerte lue');
          } else {
            this.notifier.notify('success', 'Alert read');
          }
        }); */
  }

  onClickNotRead(alert: AlertInterface, i: number) {
    /*     this.alertsService.updateAlert(alert._id, false).subscribe(() => { }, () => { }, () => {
          this.alertsService.hiveAlerts[i].check = false;
    
          this.alertsService.apiaryAlertsActives.push(alert);
          if (this.userService.getJwtReponse().country === "FR") {
            this.notifier.notify('success', 'Alerte non lue');
          } else {
            this.notifier.notify('success', 'Alert unread');
          }
        }); */
  }

  onClickReadAll(alertList: AlertInterface[]) {
    // Update in database

    /*     let obs = alertList.map((_alert) => {
          if (_alert.check === false) {
            // Update in hiveAlerts table
            let alertIndexUpdateCheck = this.alertsService.hiveAlerts.map(alertMap => alertMap._id).indexOf(_alert._id);
            this.alertsService.hiveAlerts[alertIndexUpdateCheck].check = true;
    
            //  Update the list of active hives
            let alertIndexUpdate = this.alertsService.apiaryAlertsActives.map(alertMap => alertMap._id).indexOf(_alert._id);
            this.alertsService.apiaryAlertsActives.splice(alertIndexUpdate, 1);
    
            return  this.alertsService.updateAlert(_alert._id, true);
          }
        });
    
        obs = obs.filter(_obs => _obs !== undefined);
    
        if(obs.length > 0){
          Observable.forkJoin(obs).subscribe(() => { }, () => { }, () => {
            this.myNotifer.sendSuccessNotif(NotifList.READ_ALL_ALERTS_HIVE);
          });
        }
     */
  }

  readAllHiveAlerts(hive: RucheInterface) {
    /*       this.alertsService.getAlertsByHive(hive._id).subscribe(
            _alert => {
              this.alertsService.hiveAlerts = _alert;
              this.onClickReadAll(this.alertsService.hiveAlerts);
            }
          ); */
  }

  onClickNotReadAll(alertList: AlertInterface[]) {
    /*     // Update in database
        alertList.forEach(alert => {
    
          this.alertsService.updateAlert(alert._id, false).subscribe(() => { }, () => { }, () => {
    
            let alertIndexUpdateCheck = this.alertsService.hiveAlerts.map(alertMap => alertMap._id).indexOf(alert._id);
            if (this.alertsService.hiveAlerts[alertIndexUpdateCheck].check === true) {
              // Update in hiveAlerts table
              this.alertsService.hiveAlerts[alertIndexUpdateCheck].check = false;
    
              //  Update the list of active hives
              this.alertsService.apiaryAlertsActives.push(alert);
    
              if (this.userService.getJwtReponse().country === "FR") {
                this.notifier.notify('success', 'Alerte non lue');
              } else {
                this.notifier.notify('success', 'Alert not read');
              }
            }
          });
        }); */
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('DESTROY');
  }

  checkChartInstance(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      if (this.echartInstance === null) {
        reject(false);
      }
      else {
        resolve(true);
      }
    })
  }
}
