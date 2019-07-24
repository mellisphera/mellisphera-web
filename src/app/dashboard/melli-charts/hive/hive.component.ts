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
    this.dailyComponent.afterRangeChange();
    this.hourlyComponent.loadHourlyData(true, '', false);
  }

  
   setRangeChart() {
     this.dailyComponent.loadDailyDeviceData(true);
     this.dailyComponent.loadDailyOtherData(true);
     this.hourlyComponent.loadHourlyData(true, '', true);
   }

}
