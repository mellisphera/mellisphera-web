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
  constructor() {

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
    this.hourlyComponent.cleanSerie();
    this.dailyComponent.loadDailyDeviceData(false);
    this.dailyComponent.loadDailyOtherData(false);
    this.hourlyComponent.loadHourlyData(true, '', false);
  }

  
   setRangeChart() {
     this.dailyComponent.loadDailyDeviceData(true);
     this.dailyComponent.loadDailyOtherData(true);
     this.hourlyComponent.loadHourlyData(true, '', true);
   }

}
