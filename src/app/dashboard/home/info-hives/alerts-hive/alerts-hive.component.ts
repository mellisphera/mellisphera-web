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

import { Component, OnInit, Renderer2 } from '@angular/core';
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
import { isUndefined } from 'util';
import { type } from 'os';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import { reduce } from 'rxjs-compat/operator/reduce';
import { RucheInterface } from '../../../../_model/ruche';
import { PassThrough } from 'stream';
import { Observable } from 'rxjs';
import { MyNotifierService } from '../../../service/my-notifier.service';
import { NotifList } from '../../../../../constants/notify';

@Component({
  selector: 'app-alerts-hive',
  templateUrl: './alerts-hive.component.html',
  styleUrls: ['./alerts-hive.component.css']
})
export class AlertsHiveComponent implements OnInit {

  option: any;
  private img: string;
  private echartInstance: any;
  private readonly notifier: NotifierService;
  // tabPos[Nombre d'alertes dans le jour][x ou y][rang de la prochaine alerte a traiter]
  private tabPos : number[][][];
  // map repertoriant le nombre d'alerts par jour
  // Sous la forme date => [Les nombres d'alertes correspondants][Le rang de la prochaine alerte a placer dans le tableau]
  private mapDateNbAlerts : Map<string,number[]>;

  private eltOnClickId: EventTarget;

  constructor(private unitService: UnitService, private graphGlobal: GraphGlobal, private dailyRecordThService: DailyRecordService,
    private alertsService: AlertsService,
    public rucherService: RucherService,
    public rucheService: RucheService,
    private userService: UserloggedService,
    public notifierService: NotifierService,
    private renderer: Renderer2,
    private myNotifer: MyNotifierService) {
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
        [0.2,-0.2],
        [0,0]
      ],
      [
        [0.3,0.1,-0.1],
        [-0.15,0.3,-0.15]
      ],
      [
        [0.3,0.3,-0.1,-0.1],
        [-0.15,0.3,-0.15,0.3]
      ],
      [
        [0.25,-0.05,-0.2,0.1,0.4],
        [0.3,0.3,-0.15,-0.15,-0.15]      ]
    ];
    this.getOption();
  }

  getOption(){
    this.option = {
      backgroundColor: 'white',
      title: {
        text: this.graphGlobal.getTitle("AlertsHive"),
        left: 'center',
        textStyle: {
          color: 'black'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if(params.data[3] !== 'OK'){
          return params.marker + (params.data[3] === 'Daily' ?  this.unitService.getDailyDate(params.data[0]) : this.unitService.getHourlyDate(params.data[0])) + '<br/>' + params.data[1].split('|').join('<br/>');
          }
        }
      },
      toolbox: {
        orient: 'vertical',
        itemSize: 15,
        top: 'middle',
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      calendar: [{
        left: '15%',
        height: '45%',
        width: '77%',
        range: MyDate.getRangeForCalendarAlerts(),
        orient: 'horizontal',
        cellSize: ['20', '20'],
        splitLine: {
          show: true,
          lineStyle: {
            color: '#000',
            width: 2,
            type: 'solid'
          }
        },
        dayLabel: {
          nameMap: this.graphGlobal.getDays(),
          firstDay: 1, // start on Monday
        },
        monthLabel: {
          nameMap: this.graphGlobal.getMonth()
        },
        yearLabel: {
          formatter: '{start}-{end}',
          show: false,
          margin: 40,
          orient: 'horizontal',
          top: 30,
          itemWidth: 15,
          itemSymbol: 'diamond',
          left: 'center',
          textStyle: {
            color: 'black'
          }
        },
        itemStyle: {
          normal: {
            color: '#EBEBEB',
            borderWidth: 1,
            borderColor: '#111'
          }
        }
      }],
      series: []
    };
  }

  ngOnInit() {
    this.alertsService.getAlertsByHive(this.rucheService.getCurrentHive().id).subscribe(
      _alert => {
        this.alertsService.hiveAlerts = _alert;
        if(_alert.length === 0){
          this.hideCalendar();
          this.initCalendar();
        }else{
          this.showCalendar();
          this.initCalendar();
        }
      }
    );
  }

  hideCalendar(){
    this.eltOnClickId = document.getElementById('graph');
    this.renderer.addClass(this.eltOnClickId, 'hideCalendar');
    this.eltOnClickId = document.getElementById('message');
    this.renderer.removeClass(this.eltOnClickId, 'hideMessage');
  }

  showCalendar(){
    this.eltOnClickId = document.getElementById('graph');
    this.renderer.removeClass(this.eltOnClickId, 'hideCalendar');
    this.eltOnClickId = document.getElementById('message');
    this.renderer.addClass(this.eltOnClickId, 'hideMessage');
  }

  cleanSerie(): void {
    this.option.series.clear;
    this.option.series = new Array();
    this.echartInstance.clear();
  }
  initCalendar(hive?: RucheInterface){
    if (hive) {
      this.alertsService.getAlertsByHive(hive.id).subscribe(
        _alert => {
          this.alertsService.hiveAlerts = _alert;
          if(_alert.length === 0){
            this.hideCalendar();
            this.cleanSerie();
            this.getOption();
            this.loadCalendar();
          }else{
          this.showCalendar();
          this.cleanSerie();
          this.getOption();
          this.loadCalendar();
          }
        }
      );
    } else {
      this.loadCalendar();
    }

  }

  loadCalendar() {
    // date => [Les nombres d'alertes correspondants][Le rang de la prochaine alerte a placer dans le tableau]
    this.mapDateNbAlerts.clear;
    this.mapDateNbAlerts = new Map();

    // On regarde combien il y a d'alertes par jour pour pouvoir bien les placer
    this.alertsService.hiveAlerts.forEach(alerts => {
      // Si il y a deja une alerte ce jour, on incrémente
      let date = MyDate.convertDate(MyDate.getWekitDate(alerts.date.toString()));
      if(this.mapDateNbAlerts.has(date)){
        let nbAlerts = this.mapDateNbAlerts.get(date);
        nbAlerts[0] += 1;
        this.mapDateNbAlerts.set(date,nbAlerts);
      // Si il n'y a pas encore d'alertes ce jour
      }else{
        this.mapDateNbAlerts.set(date,[0,-1]);
      }
      
    });

    // On met les valeurs dans le calendrier
    let serieTmp = {
      type: 'custom',
      itemStyle : {
        color : ''
      },
      name: 'toto',
      renderItem: null,
      coordinateSystem: 'calendar',
      data: []
    }
    let type = [];
    this.alertsService.hiveAlerts.forEach((_alert, index) => {
      if (type.indexOf(_alert.type) === -1) {  
        type.push(_alert.type);
        let newSerie = Object.assign({}, serieTmp);
        newSerie.name = _alert.type;
        newSerie.data = this.alertsService.hiveAlerts.filter(_filter => _filter.type === _alert.type).map(_map => [ _map.date, _map.message, _map.picto, _map.time]);
        newSerie.itemStyle = {
          color : this.alertsService.getColor(_alert.type)
        };
        newSerie.renderItem = (params, api) => {
          try {
            let cellPoint = api.coord(api.value(0));
            let cellWidth = params.coordSys.cellWidth;
            let cellHeight = params.coordSys.cellHeight;
            // Iteration of alert rang
            let date = MyDate.convertDate(new Date(api.value(0)));
            let nbAlerts = this.mapDateNbAlerts.get(date);
            // if(nbAlerts[1] < nbAlerts[0]){
            nbAlerts[1] += 1;
            this.mapDateNbAlerts.set(MyDate.convertDate(new Date(api.value(0))),nbAlerts);
            // set constants
            let nbAlertsOfThisDay = this.mapDateNbAlerts.get(date)[0];
            let rangAlertsOfThisDay = this.mapDateNbAlerts.get(date)[1];
            
            // S'il y a moins de 3 alertes
            if(nbAlertsOfThisDay < 2){
              return {
                type: 'path',
                shape: {
                  pathData: this.alertsService.getPicto(params.seriesName),
                  // tabPos[Nombre d'alertes dans le jour][x ou y][rang de la prochaine alerte a traiter]
                  x: -0.35 * cellWidth + this.tabPos[nbAlertsOfThisDay][0][rangAlertsOfThisDay]*cellWidth,
                  y: -0.35 * cellHeight  + this.tabPos[nbAlertsOfThisDay][1][rangAlertsOfThisDay]*cellHeight,
                  width: cellWidth / 1.3,
                  height: cellHeight / 1.3
                },
                position: [cellPoint[0], cellPoint[1]],
                style : {
                  fill : this.alertsService.getColor(params.seriesName)
                }
            }
            // S'il y a trop d'alertes
            }else{
              return {
                type: 'path',
                shape: {
                  pathData: this.alertsService.getPicto(params.seriesName),
                  // tabPos[Nombre d'alertes dans le jour][x ou y][rang de la prochaine alerte a traiter]
                  x: -0.35 * cellWidth + this.tabPos[nbAlertsOfThisDay][0][rangAlertsOfThisDay]*cellWidth,
                  y: -0.35 * cellHeight + this.tabPos[nbAlertsOfThisDay][1][rangAlertsOfThisDay]*cellHeight,
                  width: cellWidth / 2,
                  height: cellHeight / 2,
                },
                position: [cellPoint[0], cellPoint[1]],
                style : {
                  fill : this.alertsService.getColor(params.seriesName)
                }
            }
            }
          } 
        // }
          catch {}
        },
        this.option.series.push(newSerie);
      }
    });

    // Mark the current day
    let newSerie = Object.assign({}, serieTmp);
        newSerie.name = 'thisDay';
        newSerie.data = [ [new Date(), 0, 'OK', 'OK']];
        newSerie.renderItem = (params, api) => {
          let cellPoint = api.coord(api.value(0));
          let cellWidth = params.coordSys.cellWidth;
          let cellHeight = params.coordSys.cellHeight;
          return {
            type: 'rect',
            z2: 0 ,
            shape: {
              x: -cellWidth / 2,
              y: -cellHeight / 2,
              width: cellWidth,
              height: cellHeight,
            },
            position: [cellPoint[0], cellPoint[1]],
            style : {
              fill: 'none',
              stroke : 'red',
              lineWidth : 4
            }
          }
        };
        this.option.series.push(newSerie);

    this.checkChartInstance().then(status => {
      this.echartInstance.setOption(this.option,false);
    }).catch(err => {
      console.log(err);
    })
  }
  renderItem() {

  }
  onClickRead(alert: AlertInterface, i: number) {
    // Update in database
    this.alertsService.updateAlert(alert._id, true).subscribe(() => { }, () => { }, () => {
      // Update in hiveAlerts table
      this.alertsService.hiveAlerts[i].check = true;

      //  Update the list of active hives
      let alertIndexUpdate = this.alertsService.apiaryAlertsActives.map(alertMap => alertMap._id).indexOf(alert._id);
      this.alertsService.apiaryAlertsActives.splice(alertIndexUpdate, 1);

      if (this.userService.getJwtReponse().country === "FR") {
        this.notifier.notify('success', 'Alerte lue');
      } else {
        this.notifier.notify('success', 'Alert read');
      }
    });
  }

  onClickNotRead(alert: AlertInterface, i: number) {
    // Update in database
    this.alertsService.updateAlert(alert._id, false).subscribe(() => { }, () => { }, () => {
      // Update in hiveAlerts table
      this.alertsService.hiveAlerts[i].check = false;

      //  Update the list of active hives
      this.alertsService.apiaryAlertsActives.push(alert);
      if (this.userService.getJwtReponse().country === "FR") {
        this.notifier.notify('success', 'Alerte non lue');
      } else {
        this.notifier.notify('success', 'Alert unread');
      }
    });
  }

  onClickReadAll(alertList: AlertInterface[]) {
    // Update in database
    
    let obs = alertList.map((_alert) => {
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

  }

  readAllHiveAlerts(hive : RucheInterface){
      this.alertsService.getAlertsByHive(hive.id).subscribe(
        _alert => {
          this.alertsService.hiveAlerts = _alert;
          this.onClickReadAll(this.alertsService.hiveAlerts);
        }
      );
  }

  onClickNotReadAll(alertList: AlertInterface[]) {
    // Update in database
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
    });
  }

  onChartInit(event: any) {
    this.echartInstance = event;
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
