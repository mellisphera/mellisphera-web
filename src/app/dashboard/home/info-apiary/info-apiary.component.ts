import { Component, OnInit, AfterViewChecked,HostListener, Renderer2 } from '@angular/core';
import { RucherService } from '../../service/api/rucher.service';

@Component({
  selector: 'app-info-apiary',
  templateUrl: './info-apiary.component.html',
  styleUrls: ['./info-apiary.component.css']
})
export class InfoApiaryComponent implements OnInit, AfterViewChecked {

  screenHeight:any;
  screenWidth:any;
  private eltOnClickId: EventTarget;

  constructor(public rucherService: RucherService,
    private renderer: Renderer2) {

    this.getScreenSize();
    this.eltOnClickId = null;
   }

  ngOnInit() {

    // Active the alert button
    this.eltOnClickId = document.getElementById('infoApiaryButton');
    this.renderer.addClass(this.eltOnClickId, 'active0');

  }

  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.screenHeight = window.innerHeight;
          this.screenWidth = window.innerWidth;
    }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    if(this.screenWidth > 990){
      const height = document.getElementById('cadre').offsetHeight;
      document.getElementById('apiaryLeft').style.top = '' + (0 + height) + 'px';
      const heightGraph= document.getElementById('graph').offsetHeight;
      const heightNotes = document.getElementById('apiarynotes').offsetHeight;
      document.getElementById('states').style.marginTop = '' + (0 + heightNotes + height - heightGraph)+ 'px';
    }
  }

}
