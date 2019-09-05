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

import { Component, OnInit, Renderer2, AfterViewChecked, AfterViewInit, ViewChild } from '@angular/core';
import { MelliChartsDateService } from '../service/melli-charts-date.service';
import { MelliChartsHiveService } from '../service/melli-charts-hive.service';
import { DailyManagerService } from './service/daily-manager.service';
import { HourlyManagerService } from './service/hourly-manager.service';
import { DailyComponent } from './daily/daily.component';
import { HourlyComponent } from './hourly/hourly.component';


@Component({
  selector: 'app-hive',
  templateUrl: './hive.component.html',
  styleUrls: ['./hive.component.css']
})
export class HiveComponent implements OnInit {

  @ViewChild(DailyComponent) dailyComponent: DailyComponent;
  @ViewChild(HourlyComponent) hourlyComponent: HourlyComponent;
  constructor(private melliDate: MelliChartsDateService,
    private render: Renderer2) {

  }

  ngOnInit() {
  }

  /**
   *
   *
   * @memberof HiveComponent
   */
  loadDataFromHive(): void {
    // this.hourlyComponent.cleanSerie();
    // this.hourlyComponent.cleanSerie();
    this.dailyComponent.loadDailyDeviceData(false);
    this.dailyComponent.loadDailyOtherData(false);
    this.dailyComponent.loadDailyEnvData(false);
    console.log(this.dailyComponent.melliHive.getDailyDeviceChartInstance().getHeight());
    // this.hourlyComponent.loadHourlyData(true, '', false);
  }

  
   setRangeChart() {
    this.setHeightCalendar(() => {
      this.dailyComponent.loadDailyDeviceData(true);
      this.dailyComponent.loadDailyOtherData(true);
      this.dailyComponent.loadDailyEnvData(true);
    });


    
     // this.hourlyComponent.loadHourlyData(true, '', true);
   }

   getHeightCalendar(): number {
     console.log(this.melliDate.getRangeForReqest()[1].getMonth() - this.melliDate.getRangeForReqest()[0].getMonth());
    return 230 * (this.melliDate.getRangeForReqest()[1].getMonth() - this.melliDate.getRangeForReqest()[0].getMonth());
  }

  setHeightCalendar(loadCalendar: Function) {
    for(let i = 0; i < this.dailyComponent.calendarElements.length; i++ ) {
      this.render.setStyle(this.dailyComponent.calendarElements[i], 'height', this.getHeightCalendar() + 'px');
    }
    this.dailyComponent.melliHive.getDailyDeviceChartInstance().dispose();
    this.dailyComponent.melliHive.getDailyEnvChartInstance().dispose();
    this.dailyComponent.melliHive.getDailyOtherChartInstance().dispose();
    this.dailyComponent.initCalendar();
    loadCalendar();
  }


}
