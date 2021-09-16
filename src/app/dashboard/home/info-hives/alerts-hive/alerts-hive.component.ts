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
import { NotifierService } from 'angular-notifier';
import { RucheService } from '../../../service/api/ruche.service';
import { MyDate } from '../../../../class/MyDate';
import { UnitService } from '../../../service/unit.service';
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';
import { Observable } from 'rxjs';
import { BASE_OPTIONS } from '../../../explore/charts/BASE_OPTIONS';
import { SERIES } from '../../../explore/charts/SERIES';
import { GLOBAL_ICONS } from '../../../explore/charts/icons/icons';
import * as echarts from 'echarts';
import { MEDIA_QUERY_MELLIUX } from '../../../explore/charts/MEDIA';
import { InspectionService } from '../../../../dashboard/service/api/inspection.service';


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
  private echartInstance: any;
  public noData: boolean;

  private eltOnClickId: EventTarget;

  constructor(
    private unitService: UnitService,
    private graphGlobal: GraphGlobal,
    private alertsService: AlertsService,
    public rucherService: RucherService,
    public rucheService: RucheService,
    public notifierService: NotifierService,
    private renderer: Renderer2,
    private inspService: InspectionService) {
    this.echartInstance = null;
    this.noData = true;
    this.echartInstance = null;
    this.eltOnClickId = null;
    this.cleanOption();
  }

  cleanOption() {
    this.option = {
      baseOption: {},
      media: JSON.parse(JSON.stringify(MEDIA_QUERY_MELLIUX))
    };
    this.option.baseOption = JSON.parse(JSON.stringify(BASE_OPTIONS.baseOptionDailyMelliUx));
    this.option.baseOption.title.text = this.graphGlobal.getTitle('ALERTSHIVE');
    this.option.baseOption.title.left = 'center'
    this.option.baseOption.calendar.orient = 'vertical';
    this.option.baseOption.calendar.range = MyDate.getRangeForCalendarAlerts();
    this.option.baseOption.calendar.top = 60;
    this.option.baseOption.calendar.left = 'center';
    //this.option.baseOption.calendar.cellSize = [40, 40];
    this.option.baseOption.series = new Array();
  }

  ngOnInit() {
    if (this.echartInstance == null) {
      this.echartInstance = echarts.init(<HTMLDivElement>document.getElementById('graph'));
      this.option.baseOption.calendar.range = MyDate.getRangeForCalendarAlerts();
      this.echartInstance.showLoading();
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

  initCalendar() {
    this.echartInstance.clear();
    this.cleanOption();
    this.option.baseOption.calendar.range = MyDate.getRangeForCalendarAlerts();
    this.loadCalendar();
  }

  joinObservationAlert(_obs: any[], _alert: any[]): any[] {
    return _obs.concat(_alert).map(_elt => {
      return { date: _elt.opsDate, value: 0, sensorRef: _elt.description ? 'Inspections' : 'Notifications' }
    });
  }

  getSerieByData(data: Array<any>, serieTemplate: any, next: Function): void {
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
      this.inspService.getInspectionByHiveIdAndOpsDateBetween(this.rucheService.getCurrentHive()._id, MyDate.getRangeForCalendarAlerts()),
      this.alertsService.getAlertByHive(this.rucheService.getCurrentHive()._id, MyDate.getRangeForCalendarAlerts())
    ];
    Observable.forkJoin(obs).subscribe(
      _data => {
        const dateJoin = this.joinObservationAlert(_data[0].filter(_note => _note.type === 'hive'), _data[1]);
        const joinData = _data[0].filter(_note => _note.type === 'hive').concat(_data[1]);
        this.noData = !(joinData.length > 0);
        const option = Object.assign({}, this.option);
        option.baseOption.legend = JSON.parse(JSON.stringify(BASE_OPTIONS.legend));
        option.baseOption.legend.top = 30;
        option.baseOption.legend.left = 'center';
        option.baseOption.legend.selectedMode = 'multiple';
        this.getSerieByData(dateJoin, SERIES.custom, (serieComplete: any) => {
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
              if (nbNote === dataByDate.length) {
                path = this.inspService.getPictoEvent(cellPoint);
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
                group.children = group.children.concat(this.inspService.getPictoEvent(cellPoint));
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
        option.baseOption.series.push(this.graphGlobal.getYesterdaySerie());
        this.echartInstance.setOption(option, true);
        this.option = option;
      },
      () => {},
      () => {
        this.echartInstance.hideLoading();
      }
    );
  }
  renderItem() {

  }

  onResize() {
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
          if (_singleData.type) {
            type = 'Inspection';
            img = '<img style={S} src={I} />';
            img = img.replace(/{I}/g, './assets/ms-pics/ui/calendbars/inspect_cw.png');
          } else {
            img = '<img style={S} src=./assets/ms-pics/alerts/ruche/' + _singleData.icon.toLowerCase() + '_cw.png />';
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
    if(text != undefined && text != null){
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
    else{
      return '';
    }
  }


  getTimeStampFromDate(_date: Date | string): number {
    const date = new Date(_date);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
  }

  onClickRead() {
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

  onClickNotRead() {
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

  onClickReadAll() {
    // Update in database

    /*     let obs = alertList.map((_alert) => {
          if (_alert.check === false) {
            // Upin hiveAlerts table
            let alertIndexUpdateCheck = this.alertsService.hiveAlerts.map(alertMap => alertMap._id).indexOf(_alert._id);
            alertsService.hiveAlerts[alertIndexUpdateCheck].check = true;

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

  readAllHiveAlerts() {
    /*       this.alertsService.getAlertsByHive(hive._id).subscribe(
            _alert => {
              this.alertsService.hiveAlerts = _alert;
              this.onClickReadAll(this.alertsService.hiveAlerts);
            }
          ); */
  }

  onClickNotReadAll() {
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
    this.echartInstance.dispose();
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
