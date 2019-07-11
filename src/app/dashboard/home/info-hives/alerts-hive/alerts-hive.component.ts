import { Component, OnInit } from '@angular/core';
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
  private mapDateNbAlerts : Map<number,number[]>;

  constructor(private unitService: UnitService, private graphGlobal: GraphGlobal, private dailyRecordThService: DailyRecordService,
    private alertsService: AlertsService,
    public rucherService: RucherService,
    public rucheService: RucheService,
    private userService: UserloggedService,
    public notifierService: NotifierService) {
    this.img = 'M581.176,290.588C581.176,130.087,451.09,0,290.588,0S0,130.087,0,290.588s130.087,290.588,290.588,290.588' +
              'c67.901,0,130.208-23.465,179.68-62.476L254.265,302.696h326.306C580.716,298.652,581.176,294.681,581.176,290.588z' +
              'M447.99,217.941c-26.758,0-48.431-21.697-48.431-48.431s21.673-48.431,48.431-48.431c26.758,0,48.431,21.697,48.431,48.431' +
              'S474.749,217.941,447.99,217.941z';
    this.notifier = this.notifierService;
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
    this.option = {
      backgroundColor: 'white',
      title: {
        top: 5,
        text: this.graphGlobal.getTitle("Alerts"),
        left: 'center',
        textStyle: {
          color: 'black'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          return params.marker + unitService.getDailyDate(params.data[0]) + '<br/>' + params.data[1].split('|').join('<br/>');
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
        top: 100,
        left: '15%',
        bottom: '3%',
        height: '50%',
        width: '70%',
        range: MyDate.getRangeForCalendarHome(),
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
    this.initCalendar();
  }

  cleanSerie(): void {
    this.option.series = new Array();
  }
  initCalendar(){
    this.cleanSerie();
    this.alertsService.alertSubject.subscribe(() => { }, () => { }, () => {

      this.mapDateNbAlerts = new Map();

      // On regarde combien il y a d'alertes par jour pour pouvoir bien les placer
      this.alertsService.hiveAlerts.forEach(alerts => {
        // Si il y a deja une alerte ce jour, on incrémente
        let date = new Date(alerts.date);
        if(this.mapDateNbAlerts.has(date.getTime())){
          let nbAlerts = this.mapDateNbAlerts.get(date.getTime());
          nbAlerts[0] += 1;
          this.mapDateNbAlerts.set(date.getTime(),nbAlerts);
        // Si il n'y a pas encore d'alertes ce jour
        }else{
          this.mapDateNbAlerts.set(date.getTime(),[0,-1]);
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
          newSerie.data = this.alertsService.hiveAlerts.filter(_filter => _filter.type === _alert.type).map(_map => [ _map.date, _map.message, _map.picto]);
          newSerie.itemStyle = {
            color : this.alertsService.getColor(_alert.type)
          };
          newSerie.renderItem = (params, api) => {
            let cellPoint = api.coord(api.value(0));
            let cellWidth = params.coordSys.cellWidth;
            let cellHeight = params.coordSys.cellHeight;
            // Iteration of alert rang
            let nbAlerts = this.mapDateNbAlerts.get(api.value(0));
            nbAlerts[1] += 1;
            this.mapDateNbAlerts.set(api.value(0),nbAlerts);
            // set constants
            let nbAlertsOfThisDay = this.mapDateNbAlerts.get(api.value(0))[0];
            let rangAlertsOfThisDay = this.mapDateNbAlerts.get(api.value(0))[1];
            
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
                  pathData: this.alertsService.getPicto('Error'),
                  // tabPos[Nombre d'alertes dans le jour][x ou y][rang de la prochaine alerte a traiter]
                  x: -0.35 * cellWidth + this.tabPos[nbAlertsOfThisDay][0][rangAlertsOfThisDay]*cellWidth,
                  y: -0.35 * cellHeight + this.tabPos[nbAlertsOfThisDay][1][rangAlertsOfThisDay]*cellHeight,
                  width: cellWidth / 2,
                  height: cellHeight / 2,
                },
                position: [cellPoint[0], cellPoint[1]],
                style : {
                  fill : 'black'
                }
            }
            }
          },
          this.option.series.push(newSerie);
        }
      });
      this.echartInstance.setOption(this.option);

    });
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
    alertList.forEach(alert => {

      this.alertsService.updateAlert(alert._id, true).subscribe(() => { }, () => { }, () => {

        let alertIndexUpdateCheck = this.alertsService.hiveAlerts.map(alertMap => alertMap._id).indexOf(alert._id);
        if (this.alertsService.hiveAlerts[alertIndexUpdateCheck].check === false) {
          // Update in hiveAlerts table
          this.alertsService.hiveAlerts[alertIndexUpdateCheck].check = true;

          //  Update the list of active hives
          let alertIndexUpdate = this.alertsService.apiaryAlertsActives.map(alertMap => alertMap._id).indexOf(alert._id);
          this.alertsService.apiaryAlertsActives.splice(alertIndexUpdate, 1);

          if (this.userService.getJwtReponse().country === "FR") {
            this.notifier.notify('success', 'Alerte lue');
          } else {
            this.notifier.notify('success', 'Alert read');
          }
        }
      });
    });

  }

  onChartInit(event: any) {
    this.echartInstance = event;
  }
}
