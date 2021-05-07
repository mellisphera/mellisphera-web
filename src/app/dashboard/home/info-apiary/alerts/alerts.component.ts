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

import { Component, OnInit, Renderer2, Input } from '@angular/core';
import { AlertsService } from '../../../service/api/alerts.service';
import { RucherService } from '../../../service/api/rucher.service';
import { AlertInterface } from '../../../../_model/alert';
import { UserloggedService } from '../../../../userlogged.service';
import { NotifierService } from 'angular-notifier';
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';
import { MyNotifierService } from '../../../service/my-notifier.service';
import { UnitService } from '../../../service/unit.service';
import { MyDate } from '../../../../class/MyDate';
import { Observable } from 'rxjs';
import { NotifList } from '../../../../../constants/notify';
import { ObservationService } from '../../../service/api/observation.service';
import { BASE_OPTIONS } from '../../../melli-charts/charts/BASE_OPTIONS';
import { SERIES } from '../../../melli-charts/charts/SERIES';
import { GLOBAL_ICONS } from '../../../melli-charts/charts/icons/icons';
import * as echarts from 'echarts';
import { TranslateService } from '@ngx-translate/core';
import { InspectionService } from '../../../../dashboard/service/api/inspection.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  private readonly notifier: NotifierService;
  private eltOnClickId: EventTarget;
  username: string;

  private option: {
    baseOption: any,
    media: Array<any>
  };
  private echartInstance: any;
  // tabPos[Nombre d'alertes dans le jour][x ou y][rang de la prochaine alerte a traiter]
  private tabPos: number[][][];
  // map repertoriant le nombre d'alerts par jour
  // Sous la forme date => [Les nombres d'alertes correspondants][Le rang de la prochaine alerte a placer dans le tableau]
  private mapDateNbAlerts: Map<string, number[]>;

  constructor(private alertsService: AlertsService,
    public rucherService: RucherService,
    private userService: UserloggedService,
    private observationService: ObservationService,
    private translateService: TranslateService,
    public notifierService: NotifierService,
    private renderer: Renderer2,
    public login: UserloggedService,
    private graphGlobal: GraphGlobal,
    private myNotifer: MyNotifierService,
    private unitService: UnitService,
    private inspService: InspectionService) {

    this.notifier = this.notifierService;
    this.eltOnClickId = null;
    this.username = this.login.getUser();

    this.notifier = this.notifierService;
    this.echartInstance = null;
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
  }

  clearOption() {
    this.option = {
      baseOption: {},
      media: [
        {
          option: {
            calendar: {
              left: 'center',
              cellSize: [50, 50]
            }
          }
        },         {
          query: {// 这里写规则
            maxWidth: 450,
          },
          option: {// 这里写此规则满足下的option
            calendar: {
              cellSize: [35, 35]
            },
          }
        },
      ]
    };
    this.option.baseOption = JSON.parse(JSON.stringify(BASE_OPTIONS.baseOptionDailyMelliUx));
    this.option.baseOption.title.text = this.graphGlobal.getTitle('AlertsApiary') + ' ' + this.rucherService.rucher.name;
    this.option.baseOption.calendar.orient = 'vertical';
    //this.option.calendar.top = 70;
    this.option.baseOption.calendar.left = 'center';
    this.option.baseOption.calendar.cellSize = [50, 50];
    this.option.baseOption.series = new Array();
  }
  ngOnInit() {
    if (this.echartInstance == null) {
      this.echartInstance = echarts.init(<HTMLDivElement>document.getElementById('notif-celendar'));
      this.clearOption();
      this.option.baseOption.calendar.range = MyDate.getRangeForCalendarAlerts();
      this.loadCalendar();
    }
  }

  cleanSerie(): void {
    this.option.baseOption.series = new Array();
    this.echartInstance.clear();
  }

  initCalendar(isReload?: boolean){
    this.clearOption();
    this.option.baseOption.calendar.range = MyDate.getRangeForCalendarAlerts();
    this.loadCalendar();
}

  joinObservationAlert(_obs: any[], _alert: any[]): any[] {
    return _obs.concat(_alert).map(_elt => {
      return { date: _elt.opsDate, value: 0, sensorRef: _elt.description ? 'Inspections' : 'Notifications', type: _elt.type  }
    });
  }

  onResize(event) {
    this.echartInstance.resize({
      width: 'auto',
      height: 'auto'
    });
  }
  getSerieByData(data: Array<any>, nameSerie: string, serieTemplate: any, next: Function): void {
    const sensorRef: Array<string> = [];
    data.forEach((_data) => {
      if (sensorRef.indexOf(_data.sensorRef) === -1) {
        sensorRef.push(_data.sensorRef);
        let serieTmp = Object.assign({}, serieTemplate);
        serieTmp.name = _data.sensorRef;
        if (data.map(_elt => _elt.date)[0] !== undefined) {
          serieTmp.data = data.filter(_filter => _filter.sensorRef === _data.sensorRef).map(_map => {
            return [_map.date, _map.value, _map.sensorRef, _map.type];
          });
        } else {
          serieTmp.data = data;
        }
        next(serieTmp);
      }
    });
  }

  loadCalendar() {
    this.echartInstance.showLoading();
    const obs: Array<Observable<any>> = [
      this.inspService.getInspectionByApiaryIdAndOpsDateBetween(this.rucherService.rucher._id, MyDate.getRangeForCalendarAlerts()),
      this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary(), MyDate.getRangeForCalendarAlerts())
    ];
    Observable.forkJoin(obs).subscribe(
      _data => {
        const dateJoin = this.joinObservationAlert(_data[0].filter(_elt => _elt.type === 'apiary'), _data[1]);
        const joinData = _data[0].concat(_data[1]);
        let option = Object.assign({}, this.option);
        option.baseOption.series = new Array();
        option.baseOption.legend = JSON.parse(JSON.stringify(BASE_OPTIONS.legend));
        option.baseOption.legend.top = 30;
        option.baseOption.legend.selectedMode = 'multiple';
        this.getSerieByData(dateJoin, 'alert', SERIES.custom, (serieComplete: any) => {
          //serieComplete.tooltip = this.getTooltipBySerie();
          serieComplete.renderItem = (params, api) => {
            let cellPoint = api.coord(api.value(0));
            let cellWidth = params.coordSys.cellWidth;
            let cellHeight = params.coordSys.cellHeight;
            let group = {
              type: 'group',
              children: []
            };
            const dataByDate: any[] = joinData.filter(_filter => {
              return this.graphGlobal.compareToDate(_filter.opsDate, api.value(0));
            });
            if (dataByDate.length >= 1) {
              group.children.push({
                type: 'rect',
                //z2: 0,
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
              if (nbNote === dataByDate.length) {
                path = this.observationService.getPictoInspect(cellPoint);
                group.children = group.children.concat(path);
              } else if (nbNote < dataByDate.length && dataByDate.length !== 1) {
                path = {
                  type: 'path',
                  //z2: 1000,
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
                group.children = group.children.concat(this.alertsService.getPicto(dataByDate[0].icon, cellPoint));
              }
            }
            return group;

          }
          //option.calendar.dayLabel.nameMap = this.graphGlobal.getDays();
          option.baseOption.calendar.monthLabel.nameMap = this.graphGlobal.getMonth();
          option.baseOption.legend.data.push(serieComplete.name);
          option.baseOption.tooltip = this.getTooltipBySerie(joinData);
          option.baseOption.series.push(serieComplete);

        });
        option.baseOption.series.push(this.graphGlobal.getDaySerie());
        this.echartInstance.setOption(option, true);
        this.echartInstance.hideLoading();
        this.option = option;
      });
  }

  getTooltipFormater(markerSerie: string, date: string, series: Array<any>): string {
    let templateHeaderTooltip = '{*} <B>{D}</B> </br>';
    let templateValue = '{n}: <B>{v} {u}</B>';
    let tooltipGlobal;
    console.log(series);
    tooltipGlobal = templateHeaderTooltip.replace(/{\*}/g, markerSerie).replace(/{D}/g, date);
    tooltipGlobal += series.map(_serie => {
      if (/picto/g.test(_serie.name) || _serie.name === '') {
        return templateValue.replace(/:/g, '').replace(/{n}/g, _serie.name).replace(/{v}/g, _serie.value).replace(/{u}/g, _serie.unit)
      } else {
        return templateValue.replace(/{n}/g, _serie.name).replace(/{v}/g, _serie.value).replace(/{u}/g, _serie.unit);
      }}).join('</br>');

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
      if(params.data[3] !== 'OK'){
      const dataByDateTooltip = extraData.filter(_filter => {
        return this.graphGlobal.compareToDate(_filter.opsDate, params.data[0]);
      });
      return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data[0]), dataByDateTooltip.map(_singleData => {
        let type = 'Notif';
        let img = '';
        if (_singleData.description || _singleData.description === '') {
          type = 'Inspection';
          if(_singleData.type === 'apiary'){
            img = '<img style={S} src={I} />';
            img = img.replace(/{I}/g, './assets/pictos_alerts/newIcones/inspect-api.svg');
          }
          if(_singleData.type === 'hive'){
            img = '<img style={S} src={I} />';
            img = img.replace(/{I}/g, './assets/pictos_alerts/newIcones/inspect.svg');
          }
          
        } else {
          img = '<img style={S} src=./assets/pictos_alerts/newIcones/' + _singleData.icon + '.svg />';
        }
        img = img.replace(/{S}/g, 'display:inline-block;margin-right:5px;border-radius:20px;width:30px;height:30px; background-color:red;');
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
    try{
      if (text === undefined) {
        text = '';
      }
      let originString: string = text;
      let newString: string;
      while(originString.length >= 80) {
        newString += originString.slice(0, 80) + '<br/>';
        originString = originString.replace(originString.slice(0, 80), '');
      }
      return (newString + originString).replace(/undefined/g, '');
    } catch{}
  }

  
  onClickRead(alert: AlertInterface, i: number) {
    // Update in database
    this.alertsService.updateAlert(alert._id, true).subscribe(() => { }, () => { }, () => {
      // Update in apiaryAlerts table
      this.alertsService.apiaryAlerts[i].check = true;
      // update the number of actives alerts
      this.alertsService.numberApiaryAlertsActives = this.alertsService.numberApiaryAlertsActives - 1;
      if (this.translateService.currentLang === 'fr') {
        this.notifier.notify('success', 'Alerte marquée comme lue');
      } else {
        this.notifier.notify('success', 'Alert marked as read');
      }
    });
  }

  onClickReadAll(alertList: AlertInterface[]) {
    // Update in database
    let obs = [];
    obs = alertList.map((_alert) => {
      if (_alert.check === false) {
        // Update in apiaryAlerts table
        let alertIndexUpdateCheck = this.alertsService.apiaryAlerts.map(alertMap => alertMap._id).indexOf(_alert._id);
        this.alertsService.apiaryAlerts[alertIndexUpdateCheck].check = true;

        return this.alertsService.updateAlert(_alert._id, true);
      }
    });

    // update the number of actives alerts
    this.alertsService.numberApiaryAlertsActives = 0;

    obs = obs.filter(_obs => _obs !== undefined);

    if (obs.length > 0) {
      Observable.forkJoin(obs).subscribe(() => { }, () => { }, () => {
        this.myNotifer.sendSuccessNotif(NotifList.READ_ALL_ALERTS_HIVE);
      });
    }
  }

  onClickNotRead(alert: AlertInterface, i: number) {
    // Update in database
    this.alertsService.updateAlert(alert._id, false).subscribe(() => { }, () => { }, () => {
      // Update in apiaryAlerts table
      this.alertsService.apiaryAlerts[i].check = false;
      // update the number of actives alerts
      this.alertsService.numberApiaryAlertsActives = this.alertsService.numberApiaryAlertsActives + 1;
      if (this.translateService.currentLang === 'fr') {
        this.notifier.notify('success', 'Alerte marquée comme non lue');
      } else {
        this.notifier.notify('success', 'Alert marked as unread');
      }
    });
  }

  onChartInit(event: any) {
    this.echartInstance = event;
  }

  checkChartInstance(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      if (this.echartInstance === null) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }

}
