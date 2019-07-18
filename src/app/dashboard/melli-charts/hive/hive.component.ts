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

  public typeData: Array<any>;
  @ViewChild(DailyComponent) dailyComponent: DailyComponent;
  @ViewChild(HourlyComponent) hourlyComponent: HourlyComponent;
  constructor(
    public dailyManager: DailyManagerService,
    public hourlyManager: HourlyManagerService) {

  }

  ngOnInit() {
  }

  /**
   *
   *
   * @memberof HiveComponent
   */
  loadDataFromHive(): void {
    this.dailyComponent.loadDailyDeviceData();
    this.dailyComponent.loadDailyOtherData();
    this.dailyComponent.afterRangeChange();
    this.hourlyComponent.loadHourlyData();
  }

  
   setRangeChart() {
     this.dailyComponent.loadDailyDeviceData();
     this.dailyComponent.loadDailyOtherData();
     this.hourlyComponent.loadHourlyData();
   }








}
