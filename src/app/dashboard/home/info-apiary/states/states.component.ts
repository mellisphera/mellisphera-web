import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import * as jsPDF from 'jspdf';
import { AlertsService } from '../../../service/api/alerts.service';
import { RucherService } from '../../../service/api/rucher.service';
import { AlertInterface } from '../../../../_model/alert';
import { UserloggedService } from '../../../../userlogged.service';
import { NotifierService } from 'angular-notifier';
import * as html2canvas from 'html2canvas'; 
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';
import { UnitService } from '../../../service/unit.service';
import { MyDate } from '../../../../class/MyDate';
import { ObservationService } from '../../../apiary/ruche-rucher/ruche-detail/observation/service/observation.service';
import { RucheService } from '../../../service/api/ruche.service';
import { DailyRecordService } from '../../../service/api/dailyRecordService';
import { DailyRecordsWService } from '../../../apiary/ruche-rucher/ruche-detail/service/daily-records-w.service';
import { CapteurService } from '../../../capteur/capteur.service';

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
      this.nbDaysHivesForm = 30;

      this.date = new Date();
  }

  ngOnInit() {
  }

  isValidDate(obsDate : Date, nbDays : number) : boolean{
    let dateSince = new Date();
    let currentObsDate = MyDate.getWekitDate(obsDate.toString());
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
