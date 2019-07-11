import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import * as jsPDF from 'jspdf';
import { AlertsService } from '../../service/api/alerts.service';
import { RucherService } from '../../service/api/rucher.service';
import { AlertInterface } from '../../../_model/alert';
import { UserloggedService } from '../../../userlogged.service';
import { NotifierService } from 'angular-notifier';
import * as html2canvas from 'html2canvas'; 

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css']
})
export class StatesComponent implements OnInit {

  private readonly notifier: NotifierService;
  private eltOnClickId: EventTarget;
  username: string;
  @ViewChild('content') content : ElementRef;

  constructor(private alertsService: AlertsService,
    public rucherService: RucherService,
    private userService: UserloggedService,
    public notifierService: NotifierService,
    private renderer: Renderer2,
    public login: UserloggedService) { 

      this.notifier = this.notifierService;
      this.eltOnClickId = null;
      this.username = this.login.getUser();
  }

  ngOnInit() {
    this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary());

    // Active the alert button
    this.eltOnClickId = document.getElementById('summary');
    this.renderer.addClass(this.eltOnClickId, 'active0');

    // desactive other buttons
    this.eltOnClickId = document.getElementById('notes');
    this.renderer.removeClass(this.eltOnClickId, 'active0');
    this.eltOnClickId = document.getElementById('alert');
    this.renderer.removeClass(this.eltOnClickId, 'active0');
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
