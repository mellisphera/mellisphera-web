import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import * as jsPDF from 'jspdf';
import { AlertsService } from '../../service/api/alerts.service';
import { RucherService } from '../../service/api/rucher.service';
import { AlertInterface } from '../../../_model/alert';
import { UserloggedService } from '../../../userlogged.service';
import { NotifierService } from 'angular-notifier';
import * as html2canvas from 'html2canvas'; 
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';
import { UnitService } from '../../service/unit.service';
import { MyDate } from '../../../class/MyDate';
import { ObservationService } from '../../apiary/ruche-rucher/ruche-detail/observation/service/observation.service';
import { RucheService } from '../../service/api/ruche.service';
import { DailyRecordService } from '../../service/api/dailyRecordService';
import { DailyRecordsWService } from '../../apiary/ruche-rucher/ruche-detail/service/daily-records-w.service';
import { CapteurService } from '../../capteur/capteur.service';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css']
})
export class StatesComponent implements OnInit {

  private readonly notifier: NotifierService;
  private eltOnClickId: EventTarget;
  username: string;
  date : Date;

  option: any;
  private echartInstance: any;
  // tabPos[Nombre d'alertes dans le jour][x ou y][rang de la prochaine alerte a traiter]
  private tabPos : number[][][];
  // map repertoriant le nombre d'alerts par jour
  // Sous la forme date => [Les nombres d'alertes correspondants][Le rang de la prochaine alerte a placer dans le tableau]
  private mapDateNbAlerts : Map<number,number[]>;

  private elementCounter : number;

  private nbDaysNotesForm : number;
  private nbDaysHivesForm : number;
  private noAlert : boolean;

  @ViewChild('content') content : ElementRef;

  constructor(private alertsService: AlertsService,
    public rucherService: RucherService,
    private userService: UserloggedService,
    public notifierService: NotifierService,
    private renderer: Renderer2,
    public login: UserloggedService,
    public graphGlobal : GraphGlobal,
    public unitService : UnitService,
    public observationService : ObservationService,
    public rucheService: RucheService,
    public dailyRecTh: DailyRecordService,
    public dailyRecordWservice : DailyRecordsWService,
    public capteurService: CapteurService) { 

      this.notifier = this.notifierService;
      this.eltOnClickId = null;
      this.username = this.login.getUser();
      this.elementCounter = 0;
      this.nbDaysNotesForm = 30;
      this.nbDaysHivesForm = 30;

      this.echartInstance = null;
    this.mapDateNbAlerts = new Map();
    this.date = new Date();
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
  }

  getOption(){
    this.option = {
      backgroundColor: 'white',
      title: {
        top: 5,
        text: this.graphGlobal.getTitle("AlertsApiary") + ' ' + this.rucherService.rucher.name,
        left: 'center',
        textStyle: {
          color: 'black'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          return params.marker + (params.data[3] === 'Daily' ?  this.unitService.getDailyDate(params.data[0]) : this.unitService.getHourlyDate(params.data[0])) + '<br/>' + params.data[1].split('|').join('<br/>');
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
        height: '60%',
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
    // Active the alert button
    this.eltOnClickId = document.getElementById('summary');
    this.renderer.addClass(this.eltOnClickId, 'active0');

    // desactive other buttons
    this.eltOnClickId = document.getElementById('notes');
    this.renderer.removeClass(this.eltOnClickId, 'active0');
    this.eltOnClickId = document.getElementById('alert');
    this.renderer.removeClass(this.eltOnClickId, 'active0');

    // ALERTS
    this.alertsService.getAlertsByApiaryObs(this.rucherService.getCurrentApiary()).subscribe(
      _alert => {
        this.alertsService.apiaryAlerts = _alert;
        this.rucherService.rucherSubject.subscribe(() => { }, () => { }, () => {
        if(_alert.length === 0){
          this.noAlert = true;
        }else{
          this.getOption();
          this.loadCalendar();
        }
        });

      }
    );

    // NOTES
    this.observationService.setRange({ scale: 1, type: 'YEARS' });
    this.observationService.getObservationByIdApiary(this.rucherService.getCurrentApiary());

    //ALERTS BY HIVE
    this.alertsService.getAllHiveAlertsByApiary(this.rucherService.getCurrentApiary());
  }

  cleanSerie(): void {
    this.option.series.clear;
    this.option.series = new Array();
    this.echartInstance.clear();
  }

  loadCalendar() {
    // date => [Les nombres d'alertes correspondants][Le rang de la prochaine alerte a placer dans le tableau]
    this.mapDateNbAlerts = new Map();

    // On regarde combien il y a d'alertes par jour pour pouvoir bien les placer
    this.alertsService.apiaryAlerts.forEach(alerts => {
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
    this.alertsService.apiaryAlerts.forEach((_alert, index) => {
      if (type.indexOf(_alert.type) === -1) {  
        type.push(_alert.type);
        let newSerie = Object.assign({}, serieTmp);
        newSerie.name = _alert.type;
        newSerie.data = this.alertsService.apiaryAlerts.filter(_filter => _filter.type === _alert.type).map(_map => [ _map.date , _map.message, _map.picto, _map.time]);
        newSerie.itemStyle = {
          color : this.alertsService.getColor(_alert.type)
        };
        newSerie.renderItem = (params, api) => {
          try {
            let cellPoint = api.coord(api.value(0));
            let cellWidth = params.coordSys.cellWidth;
            let cellHeight = params.coordSys.cellHeight;
            // Iteration of alert rang
            let nbAlerts = this.mapDateNbAlerts.get(api.value(0));
            // if(nbAlerts[1] < nbAlerts[0]){
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
          } 
        // }
          catch {}
        },
        this.option.series.push(newSerie);
      }
    });

    this.checkChartInstance().then(status => {
      this.echartInstance.setOption(this.option,false);
    }).catch(err => {
      console.log(err);
    })
  }
  renderItem() {

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

  isValidDate(obsDate : Date, nbDays : number) : boolean{
    let dateSince = new Date();
    let currentObsDate = new Date(obsDate);
    dateSince.setDate(dateSince.getDate() - nbDays);
    this.elementCounter = 1;
    return (currentObsDate.getTime() > dateSince.getTime());
  }

  getElementsInDate(listElements : any[], nbDays : number) : any[]{
    return(listElements.filter(element => this.isValidDate(element.date,nbDays) === true));
  }

  public downloadPDF(){

    let doc = new jsPDF();

    let specialElementHandlers = {
      '#editor': function(element,renderer){
        return true;
      }
    };

    let content = this.content.nativeElement;

    doc.fromHTML(content.innerHTML,15,15,{
      'width' : 190,
      'elementHandlers' : specialElementHandlers
    });

    doc.save('test.pdf');

  }

  public captureScreen()  
  {  
    var data = document.getElementById('contentToConvert');  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('MYPdf.pdf'); // Generated PDF   
    });  
  }  

}
