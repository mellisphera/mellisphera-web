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

import { Component, OnInit, OnDestroy, ViewChild, AfterViewChecked, HostListener } from '@angular/core';
import { ObservationService } from '../../service/api/observation.service';
import { RucheService } from '../../service/api/ruche.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DailyRecordService } from '../../service/api/dailyRecordService';
import { DailyRecordsWService } from '../../service/api/daily-records-w.service';
import { RucheInterface } from '../../../_model/ruche';
import { CapteurService } from '../../service/api/capteur.service';
import { AlertsService } from '../../service/api/alerts.service';
import { AlertsHiveComponent } from './alerts-hive/alerts-hive.component';
import { UserloggedService } from '../../../userlogged.service';
import { MyDate } from '../../../class/MyDate';
import { HealthHiveComponent } from './health-hive/health-hive.component';
import { isUndefined } from 'util';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';

@Component({
  selector: 'app-info-hives',
  templateUrl: './info-hives.component.html',
  styleUrls: ['./info-hives.component.css']
})
export class InfoHivesComponent implements OnInit, OnDestroy, AfterViewChecked {

  private subscription: Subscription;
  screenHeight: any;
  screenWidth: any;
  @ViewChild(AlertsHiveComponent) alertsHiveComponent: AlertsHiveComponent;
  @ViewChild(HealthHiveComponent) healthHiveComponent: HealthHiveComponent;

  constructor(private observationService: ObservationService,
    public rucheService: RucheService,
    private userService: UserloggedService,
    private route: ActivatedRoute,
    public dailyRecordThService: DailyRecordService,
    public capteurService: CapteurService,
    private graphGlobal: GraphGlobal,
    public dailyRecordWservice: DailyRecordsWService,
    private alertsService: AlertsService) {

    this.getScreenSize();

  }


  ngOnInit() {
    // this.observationService.getObservationByhiveId(this.userService.getIdUserLoged());
    // this.observationService.obsHiveSubject.subscribe();
    this.dailyRecordWservice.getDailyRecordsWbyhiveId(this.rucheService.getCurrentHive()._id);
    this.loadHealthCalendar();
    // this.capteurService.getUserCapteurs();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }
  existSeries(serieArray): boolean {
    if (isUndefined(serieArray) || serieArray.length < 1 || serieArray.length > 0) {
      return true;
    } else {
      return false;
    }
  }


  loadHealthCalendar() {
    if (this.healthHiveComponent.chartInstance !== null) {
      this.healthHiveComponent.chartInstance.showLoading();
    }
    let option = JSON.parse(JSON.stringify(this.healthHiveComponent.option));
    option.baseOption.series = new Array();
    this.dailyRecordThService.getBroodByHive(this.rucheService.getCurrentHive()._id, MyDate.getRangeForCalendarAlerts()).subscribe(
      _brood => {
        option.baseOption.legend.data = _brood.map(_val => _val._id);
        _brood.forEach(elt => {
          let serie = {
            type: 'heatmap',
            name: elt.values[0].sensorRef,
            coordinateSystem: 'calendar',
            data: elt.values.map(_val => [_val.recordDate, _val.brood])
          };
         option.baseOption.series.push(serie);
        });
        console.log(option.baseOption.series);
        option.baseOption.tooltip = this.graphGlobal.getTooltipBySerie({type: 'BROOD', name: 'BROOD', unit: 'P'});
        option.baseOption.series.push(this.graphGlobal.getDaySerie());
        
       // this.healthHiveComponent.option.baseOption.serie = this.dailyRecordThService.mergeOptionCalendarHealth.series;
        this.healthHiveComponent.chartInstance.clear();
        this.healthHiveComponent.chartInstance.setOption(option, true);
        this.healthHiveComponent.option = option;
        if (this.healthHiveComponent.chartInstance !== null) {
          this.healthHiveComponent.chartInstance.hideLoading();
        }
      }
    );
  }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    if (this.screenWidth > 990) {
      const height = document.getElementById('cadre').offsetHeight;
      document.getElementById('left').style.top = '' + (0 + height) + 'px';
    }
  }

  onChangeNote(event: any): void {
    this.alertsHiveComponent.initCalendar();
  }


  ngOnDestroy() {
    // this.observationService.obsHiveSubject.unsubscribe();
  }

}
