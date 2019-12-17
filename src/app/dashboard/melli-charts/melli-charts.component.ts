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

import { Component, OnInit, Renderer2, ViewChild, AfterViewChecked, AfterViewInit, AfterContentChecked } from '@angular/core';
import { RucheService } from '../service/api/ruche.service';
import { RucherService } from '../service/api/rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { RecordService } from '../service/api/record.service';
import { AdminService } from '../admin/service/admin.service';
import { AtokenStorageService } from '../../auth/Service/atoken-storage.service';
import { UserParamsService } from '../preference-config/service/user-params.service';
import { RucheInterface } from '../../_model/ruche';
import { RucherModel } from '../../_model/rucher-model';
import { MelliChartsDateService } from './service/melli-charts-date.service';
import { DataRange } from '../../_model/data-range';
import { Router } from '@angular/router';
import { MelliChartsHiveService } from './service/melli-charts-hive.service';
import { HiveComponent } from './hive/hive.component';
import { DailyRecordsWService } from '../service/api/daily-records-w.service';
import { DailyRecordService } from '../service/api/dailyRecordService';
import { DailyStockHoneyService } from '../service/api/daily-stock-honey.service';
import { WeatherService } from '../service/api/weather.service';
import { StackMelliChartsService } from './stack/service/stack-melli-charts.service';
import { StackComponent } from './stack/stack.component';
import { VitalityComponent } from './vitality/vitality.component';
import { type } from 'os';
import { TranslateService } from '@ngx-translate/core';

const PREFIX_PATH = '/dashboard/melli-charts/';


@Component({
  selector: 'app-melli-charts',
  templateUrl: './melli-charts.component.html',
  styleUrls: ['./melli-charts.component.css']
})
export class MelliChartsComponent implements OnInit, AfterViewInit {

  public btnNav: any[];
  private btnTypeElement: HTMLElement;
  public typeNav: Array<Object>;
  public datePickerConfig: any;
  private hiveComponent: HiveComponent;
  private stackComponent: StackComponent;
  private dateDropdown: HTMLElement;
  private broodComponent: VitalityComponent;
  private eltOnClick: EventTarget;
  constructor(public rucheService: RucheService,
    public rucherService: RucherService,
    private userService: UserloggedService,
    private renderer: Renderer2,
    private router: Router,
    private dailyRecordThService: DailyRecordService,
    private dailyRecordWservice: DailyRecordsWService,
    private dailyStockHoneyService: DailyStockHoneyService,
    public melliChartDate: MelliChartsDateService,
    private stackService: StackMelliChartsService,
    public melliChartHive: MelliChartsHiveService,
    public recordService: RecordService,
    public adminService: AdminService,
    private translateService: TranslateService,
    private weatherService: WeatherService,
    public tokenService: AtokenStorageService,
    private userConfig: UserParamsService) {
    if (this.translateService.currentLang === 'fr') {
      this.btnNav = [
        { name: 'Ruche', path: 'hive' },
        { name: 'Couvain', path: 'brood' },
        { name: 'Données', path: 'stack' }
      ];
    } else if (this.translateService.currentLang === 'es') {
      this.btnNav = [
        { name: 'Colmena', path: 'hive' },
        { name: 'Cría', path: 'brood' },
        { name: 'Datos', path: 'stack' }
      ];
    }
    else {
      this.btnNav = [
        { name: 'Hive', path: 'hive' },
        { name: 'Brood', path: 'brood' },
        { name: 'Raw data', path: 'stack' }
      ];
    }

    this.datePickerConfig = {

    }
  }

  ngOnInit() {
    this.userConfig.getSubject().subscribe(
      data => {
        this.recordService.setUnitSystem(data.unitSystem);
        this.recordService.setUnitSystem(data.unitSystem);
        this.dailyRecordThService.setUnitSystem(data.unitSystem);
        this.dailyRecordWservice.setUnitSystem(data.unitSystem);
        this.dailyStockHoneyService.setUnitSystem(data.unitSystem);
        this.weatherService.setUnitSystem(data.unitSystem);
      }
    );
    this.rucheService.hiveSubject.subscribe(
      () => { }, () => { }, () => {
        let hiveSelect = this.rucheService.ruchesAllApiary.filter(_hive => _hive._id === this.rucheService.getCurrentHive()._id)[0];
        if (hiveSelect === undefined) {
          hiveSelect = this.rucheService.ruchesAllApiary.filter(_hive => _hive.apiaryId === this.rucherService.getCurrentApiary())[0];
        }
        this.melliChartHive.setHiveSelect(hiveSelect);
        this.stackService.addHive(hiveSelect);


      }
    )


  }

  ngAfterViewInit(): void {
    this.rucheService.hiveSubject.subscribe(() => { }, () => { }, () => {
      this.hiveComponent.loadDataFromHive();
    });
    this.eltOnClick = document.getElementById('hive');
    this.dateDropdown = document.getElementById('date-dropdown');
    this.renderer.addClass(this.eltOnClick, 'nav-active');

  }


  ifActiveApiary(apiaryId: string): string {
    const index = this.rucherService.allApiaryAccount.findIndex(_apiary => _apiary._id === apiaryId);
    if (document.getElementById('' + index).classList.contains('in')) {
      return 'caret-up';
    } else {
      return '';
    }
  }

  ifCurrentApiary(apiaryId: string): string {
    try {
      return apiaryId === this.melliChartHive.getHiveSelect().apiaryId ? 'in' : '';
    } catch{ }
  }
  onCloseDatePicker(): void {
    this.dateDropdown.classList.add('open');
  }
  /**
   *
   *
   * @memberof MelliChartsComponent
   */
  nextDate(): void {
    const start: Date = new Date(this.melliChartDate.start);
    const end: Date = new Date(this.melliChartDate.end);

    this.melliChartDate.start = new Date(end.getTime());
    this.melliChartDate.end = new Date(end.getTime() + (this.melliChartDate.end.getTime() - start.getTime()));
    this.setDateFromInput();

  }

  /**
   *
   *
   * @memberof MelliChartsComponent
   */
  previousDate(): void {
    // this.melliChartDate.start.setTime(this.melliChartDate.start.getTime() - this.melliChartDate.end.getTime());
    const start: Date = new Date(this.melliChartDate.start);
    const end: Date = new Date(this.melliChartDate.end);
    this.melliChartDate.start = new Date(start.getTime() - (end.getTime() - start.getTime()));
    this.melliChartDate.end = new Date(start.getTime());
    this.setDateFromInput();
  }


  /**
   *
   *
   * @param {DataRange} rangeSelect
   * @memberof MelliChartsComponent
   */
  setRangeSelect(rangeSelect: DataRange): void {
    this.melliChartDate.setRange(rangeSelect);
    if (this.router.url === PREFIX_PATH + 'hive') {
      this.hiveComponent.setRangeChart();
    } else if (this.router.url === PREFIX_PATH + 'stack') {
      this.stackComponent.loadAfterRangeChanged((options: any) => {
        this.stackService.getEchartInstance().setOption(options, true);
        this.stackService.getEchartInstance().hideLoading();
      });
    } else if (this.router.url === PREFIX_PATH + 'brood') {
      this.broodComponent.loadAllHiveAfterRangeChange((options: any) => {
        options.xAxis[0].min = this.melliChartDate.getRangeForReqest()[0];
        options.xAxis[0].max = this.melliChartDate.getRangeForReqest()[1];
        this.stackService.getBroodChartInstance().setOption(options, true);
        this.stackService.getBroodChartInstance().hideLoading();
      });
    }
  }

  getHiveByApiary(apiaryId: string): RucheInterface[] | boolean {
    try {
      return this.rucherService.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === apiaryId).sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } catch (e) {
      return false;
    }
  }

  onActivate(componentRef: Component) {
    if (componentRef instanceof HiveComponent) {
      this.hiveComponent = componentRef;
    } else if (componentRef instanceof StackComponent) {
      this.stackComponent = componentRef;
    } else if (componentRef instanceof VitalityComponent) {
      this.broodComponent = componentRef;
    }

  }


  /**
   *
   *
   * @param {string} type
   * @returns {Array<DataRange>}
   * @memberof MelliChartsComponent
   */
  getRangeByType(type: string): Array<DataRange> {
    let arg: DataRange;
    let ranges: Array<DataRange> = this.melliChartDate.ranges.filter(elt => elt.type === type || elt.type === type + 'S');
    if (type === 'YEAR') {
      arg = this.melliChartDate.ranges[8];
      ranges = ranges.concat(arg);
    } else if (type === 'MONTH') {
      const index = ranges.findIndex(_range => _range.type === 'MONTHS' && _range.scale === 9);
      ranges.splice(index, 1);
    }
    return ranges;
  }

  /**
   *
   *
   * @param {DataRange} range
   * @returns {DataRange}
   * @memberof MelliChartsComponent
   */
  getRangeBYLang(range: DataRange): string {
    if (this.translateService.currentLang === 'fr') {
      return this.melliChartDate.ranges.filter(_range => _range.type === range.type)[0].typeFr;
    } else if (this.translateService.currentLang === 'es') {
      return this.melliChartDate.ranges.filter(_range => _range.type === range.type)[0].typeEs;
    } else {
      return range.type;
    }
  }

  setDateFromInput(): void {
    let start = this.melliChartDate.start;
    let end = this.melliChartDate.end;
    this.melliChartDate.setRangeForRequest([start, end]);
    if (this.router.url === PREFIX_PATH + 'hive') {
      this.hiveComponent.setRangeChart();
    } else if (this.router.url === PREFIX_PATH + 'stack') {
      this.stackComponent.loadAfterRangeChanged((options: any) => {
        this.stackService.getEchartInstance().setOption(options, true);
        this.stackService.getEchartInstance().hideLoading();
      });
    } else if (this.router.url === PREFIX_PATH + 'brood') {
      this.broodComponent.loadAllHiveAfterRangeChange((options: any) => {
        options.xAxis[0].min = this.melliChartDate.getRangeForReqest()[0];
        options.xAxis[0].max = this.melliChartDate.getRangeForReqest()[1];
        this.stackService.getBroodChartInstance().setOption(options, true);
        this.stackService.getBroodChartInstance().hideLoading();
      });
    }
  }


  /**
   *
   *
   * @param {string} path
   * @memberof MelliChartsComponent
   */
  navToPage(path: string, _id: string): void {
    if (this.eltOnClick === null) {
      this.eltOnClick = document.getElementById(_id);
      this.renderer.addClass(this.eltOnClick, 'nav-active');
    } else {
      this.renderer.removeClass(this.eltOnClick, 'nav-active');
      this.eltOnClick = document.getElementById(_id);
      this.renderer.addClass(this.eltOnClick, 'nav-active');
    }
    this.router.navigateByUrl(PREFIX_PATH + path);
  }


  /**
   *
   *
   * @param {RucheInterface} hive
   * @param {MouseEvent} event
   * @memberof MelliChartsComponent
   */
  selectHive(hive: RucheInterface, event: MouseEvent): void {
    switch (this.router.url) {
      case PREFIX_PATH + 'hive':
        this.melliChartHive.setHiveSelect(hive);
        if (this.stackService.getHiveSelect().length > 0) {
          this.stackService.cleanSlectedHives();
        }
        this.stackService.addHive(hive);
        this.hiveComponent.loadDataFromHive();
        break;
      case PREFIX_PATH + 'brood':
        this.melliChartHive.setHiveSelect(this.stackService.getHiveSelect()[0]);
        if (this.stackService.ifActiveAlreadySelected(hive)) {
          this.stackService.removeHive(hive);
          this.broodComponent.removeHiveSerie(hive);
        } else {
          this.stackService.addHive(hive);
          this.broodComponent.loadDataByHive(hive);
        }
        break;
      case PREFIX_PATH + 'stack':
        this.melliChartHive.setHiveSelect(this.stackService.getHiveSelect()[0]);
        if (this.stackService.ifActiveAlreadySelected(hive)) {
          this.stackService.removeHive(hive);
          this.stackComponent.removeHiveSerie(hive);
        } else {
          this.stackService.addHive(hive);
          this.stackComponent.loadDataByHive(hive);
        }
        break;
    }
  }



  /**
   *
   *
   * @returns {string}
   * @memberof MelliChartsComponent
   */
  getStartDate(): string {
    return new Date(this.melliChartDate.start).toISOString().substring(0, 10);
  }


  /**
   *
   *
   * @returns {string}
   * @memberof MelliChartsComponent
   */
  getEndDate(): string {
    return new Date(this.melliChartDate.end).toISOString().substring(0, 10);
  }

  /**
   *
   *
   * @param {RucheInterface} hive
   * @returns {string}
   * @memberof MelliChartsComponent
   */
  getColor(hive: RucheInterface): string {
    switch (this.router.url) {
      case PREFIX_PATH + 'hive':
        if (this.tokenService.checkAuthorities('ROLE_ADMIN')) {
          return this.melliChartHive.getColorByIndex(this.adminService.allHives.map(elt => elt._id).indexOf(hive._id), hive);
        } else {
          return this.melliChartHive.getColorByIndex(this.rucherService.rucheService.ruchesAllApiary.map(elt => elt._id).indexOf(hive._id), hive);
        }
        break;
      case PREFIX_PATH + 'brood':
      case PREFIX_PATH + 'stack':
        if (this.tokenService.checkAuthorities('ROLE_ADMIN')) {
          return this.stackService.getColorByIndex(this.adminService.allHives.map(elt => elt._id).indexOf(hive._id), hive);
        } else {
          return this.stackService.getColorByIndex(this.rucherService.rucheService.ruchesAllApiary.map(elt => elt._id).indexOf(hive._id), hive);
        }
        break;
    }
  }
  /**
   *
   *
   * @param {string} apiaryId
   * @returns {string}
   * @memberof MelliChartsComponent
   */
  checkApiaryIfAcive(apiaryId: string): string {
    switch (this.router.url) {
      case PREFIX_PATH + 'hive':
        try {
          if (this.melliChartHive.getHiveSelect().apiaryId === apiaryId) {
            return 'apiary-active';
          } else {
            return 'not-active';
          }
        } catch (TypeError) {
        }
        break;
      case PREFIX_PATH + 'stack':
      case PREFIX_PATH + 'brood':
        try {
          if (this.stackService.getHiveSelect().findIndex(_hive => _hive.apiaryId === apiaryId) !== -1 /* ||
          this.apiryActive.findIndex(_apiary => _apiary === apiaryId) !== -1 */) {
            return 'apiary-active';
          } else {
            return 'not-active';
          }
        } catch (TypeError) {}
        // return this.stackService.
        break;
    }
  }


  checkLoadindingIsComplete(): string {
    switch (this.router.url) {
      case PREFIX_PATH + 'hive':
        return 'complete';
      // return this.hiveComponent.hourlyComponent.chartLoading ? 'loading' : 'complete';
      case PREFIX_PATH + 'brood':
      case PREFIX_PATH + 'stack':
        //return this.stackService.
        break;
    }
  }

}
