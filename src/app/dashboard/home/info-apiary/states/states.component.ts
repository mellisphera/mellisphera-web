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

import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import * as jsPDF from 'jspdf';
import { AlertsService } from '../../../service/api/alerts.service';
import { RucherService } from '../../../service/api/rucher.service';
import { UserloggedService } from '../../../../userlogged.service';
import { NotifierService } from 'angular-notifier';
import * as html2canvas from 'html2canvas';
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';
import { UnitService } from '../../../service/unit.service';
import { MyDate } from '../../../../class/MyDate';
import { RucheService } from '../../../service/api/ruche.service';
import { DailyRecordService } from '../../../service/api/dailyRecordService';
import { DailyRecordsWService } from '../../../service/api/daily-records-w.service';
import { CapteurService } from '../../../service/api/capteur.service';
import { RucheInterface } from '../../../../_model/ruche';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css'],
})
export class StatesComponent implements OnInit {

  username: string;
  date : Date;


  public nbDaysNotesForm : number;
  public nbDaysHivesForm : number;

  @ViewChild('content') content : ElementRef;

  constructor(public rucherService: RucherService,
    public notifierService: NotifierService,
    private translateService: TranslateService,
    public login: UserloggedService,
    public graphGlobal : GraphGlobal,
    public unitService : UnitService,
    public rucheService: RucheService,
    public dailyRecTh: DailyRecordService,
    public dailyRecordWservice : DailyRecordsWService,
    public capteurService: CapteurService) {

      this.username = this.login.getUser();
      this.nbDaysHivesForm = 15;

      this.date = new Date();
  }

  ngOnInit() {
    this.dailyRecTh.getRecThByApiaryByDateD3D7(this.rucherService.getCurrentApiary(),(new Date()));
  }

  isValidDate(obsDate : Date, nbDays : number) : boolean{
    let dateSince = new Date();
    let currentObsDate = MyDate.getWekitDate(obsDate.toString());
    dateSince.setDate(dateSince.getDate() - nbDays);
    return (currentObsDate.getTime() > dateSince.getTime());
  }

  // Sort a hive list in alphabetic sort
  alphaSort(hiveList : RucheInterface[]) : RucheInterface[]{
    hiveList.sort((a, b) => {
      if(a.name < b.name){
        return -1;
      }else{
        return 1;
      }
    });
    return hiveList;
  }

  getElementsInDate(listElements : any[], nbDays : number) : any[]{
    return(listElements.filter(element => this.isValidDate(element.date,nbDays) === true));
  }

  public downloadPDF(){

    let doc = new jsPDF();

    let specialElementHandlers = {
      '#editor': function(){
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
      var imgWidth = 297;
      var imgHeight = canvas.height * imgWidth / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('l', 'mm', '[297, 210]'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      if (this.translateService.currentLang === 'fr') {
        pdf.save('Résumé_rucher.pdf'); // Generated PDF
      } else {
        pdf.save('Apiary_summary.pdf'); // Generated PDF
      }
    });
  }

}
