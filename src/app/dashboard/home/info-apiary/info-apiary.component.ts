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

import { Component, OnInit, AfterViewChecked,HostListener,ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RucherService } from '../../service/api/rucher.service';
import { AlertsComponent } from './alerts/alerts.component';
import { NotesComponent } from './notes/notes.component';

@Component({
  selector: 'app-info-apiary',
  templateUrl: './info-apiary.component.html',
  styleUrls: ['./info-apiary.component.css']
})
export class InfoApiaryComponent implements OnInit, OnDestroy,AfterViewChecked {

  screenHeight:any;
  screenWidth:any;
  private eltOnClickId: EventTarget;
  @ViewChild(AlertsComponent) alertsComponent: AlertsComponent;
  @ViewChild(NotesComponent) notesComponent: NotesComponent;

  constructor(public rucherService: RucherService,
    private renderer: Renderer2,
    private translate: TranslateService) {

    this.getScreenSize();
    this.eltOnClickId = null;
   }

  ngOnInit() {
    if(this.screenWidth < 990){
      document.getElementById('content-home').appendChild(document.getElementById('graph'));
    }
    document.getElementById('content-home').appendChild(document.getElementById('apiaryLeft'));
  }

  ngOnDestroy() {
    document.getElementById('content-home').removeChild(document.getElementById('apiaryLeft'));
    if(this.screenWidth < 990){
      document.getElementById('content-home').removeChild(document.getElementById('graph'));
    }
  }

  @HostListener('window:resize', ['$event'])
    getScreenSize() {
          this.screenHeight = window.innerHeight;
          this.screenWidth = window.innerWidth;
    }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
  }

  onChangeNote(): void {
    this.alertsComponent.initCalendar();
  }

}
