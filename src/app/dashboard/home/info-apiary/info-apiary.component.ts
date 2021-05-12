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

import { Component, OnInit, AfterViewChecked,HostListener,ViewChild, Renderer2 } from '@angular/core';
import { RucherService } from '../../service/api/rucher.service';
import { AlertsComponent } from './alerts/alerts.component';
import { Observation } from '../../../_model/observation';
import { NotesComponent } from './notes/notes.component';

@Component({
  selector: 'app-info-apiary',
  templateUrl: './info-apiary.component.html',
  styleUrls: ['./info-apiary.component.css']
})
export class InfoApiaryComponent implements OnInit, AfterViewChecked {

  screenHeight:any;
  screenWidth:any;
  private eltOnClickId: EventTarget;
  @ViewChild(AlertsComponent) alertsComponent: AlertsComponent;
  @ViewChild(NotesComponent) notesComponent: NotesComponent;

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

  onChangeNote(event: any): void {
    this.alertsComponent.initCalendar();
  }

}
