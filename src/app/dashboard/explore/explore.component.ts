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

import { Component, OnInit, Renderer2, ViewChild, AfterViewChecked, AfterViewInit, AfterContentChecked, Input, ViewEncapsulation } from '@angular/core';
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
import { TranslateService } from '@ngx-translate/core';
import { WeightComponent } from './weight/weight.component';
import { UnitService } from '../service/unit.service';
import * as moment from 'moment';
import { UserPref } from '../../_model/user-pref';
import { InspHive } from '../../_model/inspHive';
import { InspHiveService } from '../service/api/insp-hive.service';
import { AlertInterface } from '../../_model/alert';
import { AlertsService } from '../service/api/alerts.service';
import { MelliChartsFilterService } from './service/melli-charts-filter.service';
import { InspectionService } from '../service/api/inspection.service';
import { Inspection } from '../../_model/inspection';
import { arrayBufferToBase64 } from 'angular-file/file-upload/fileTools';
import { MatChipInputEvent } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { EventsComponent } from './events/events.component';

import { MORE_ICON } from '../../../constants/pictos';

import { DomSanitizer} from '@angular/platform-browser';
import { SafeHtmlPipe } from './safe-html.pipe';

import { DeviceDetectorService } from 'ngx-device-detector';

import { InspCatService } from '../service/api/insp-cat.service';
import { InspCat } from '../../_model/inspCat';
import { from, Observable } from 'rxjs';
import { b } from '@angular/core/src/render3';
import { SeasonsService } from '../inspect/service/seasons.service';

const PREFIX_PATH = '/dashboard/explore/';

@Component({
  selector: 'app-melli-charts',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css',
              '../shared/navbar/navbar.component.scss',
              '../dashboard.component.css',
              '../../../pictos.scss'
              ],
  encapsulation: ViewEncapsulation.None,
})
export class ExploreComponent implements OnInit, AfterViewInit {

  public xPosContextMenu = 0;
  public yPosContextMenu = 0;

  public PICTOS_HIVES_OBS: any[] = [];

  public more_icon: string = MORE_ICON;

  public newEventDate: Date;
  public hiveEvent: RucheInterface;
  public apiaryEvent: RucherModel;
  public typeEvent: string;

  public hiveEventList: Inspection[];
  public hiveAlertList: AlertInterface[];
  public hiveEventToDelete: Inspection[] | null;
  public hiveAlertToDelete: AlertInterface[] | null;

  public new_event: Inspection = {
    _id: null,
    apiaryInspId: null,
    apiaryId: null,
    hiveId: null,
    userId: null,
    createDate: null,
    opsDate: null,
    type: null,
    description: null,
    tags: [],
    tasks: [],
    obs: [],
    todo: null
  };

  public tags: string[] = [];

  public user_pref: UserPref;

  public isDesktop: boolean = true;

  public btnNav: any[];
  private btnTypeElement: HTMLElement;
  public typeNav: Array<Object>;
  public datePickerConfig: any;
  private hiveComponent: HiveComponent;
  private stackComponent: StackComponent;
  private dateDropdown: HTMLElement;
  private broodComponent: VitalityComponent;
  private weightComponent: WeightComponent;
  private eventsComponent: EventsComponent;
  private eltOnClick: EventTarget;

  public apiaryColor: RucherModel = null;

  private inspCats: InspCat[];

  constructor(private deviceService: DeviceDetectorService,
    public rucheService: RucheService,
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
    private userConfig: UserParamsService,
    private userPrefsService: UserParamsService,
    private unitService: UnitService,
    private inspHiveService: InspHiveService,
    private alertService: AlertsService,
    public melliFilters: MelliChartsFilterService,
    private inspService: InspectionService,
    private notify: NotifierService,
    public sanitizer: DomSanitizer,
    public safeHtml: SafeHtmlPipe,
    private inspCat: InspCatService,
    private season: SeasonsService
    ) {
    if (this.translateService.currentLang === 'fr') {
      this.btnNav = [
        { name: 'Ruche', path: 'hive' },
        { name: 'Couvain', path: 'brood' },
        { name: 'Données', path: 'stack' },
        { name: 'Poids', path: 'weight'},
        { name: 'Evenements', path: 'events'},
      ];
    } else if (this.translateService.currentLang === 'es') {
      this.btnNav = [
        { name: 'Colmena', path: 'hive' },
        { name: 'Cría', path: 'brood' },
        { name: 'Datos', path: 'stack' },
        { name: 'Peso', path: 'weight'},
        { name: 'Eventos', path: 'events'},
      ];
    } else {
      this.btnNav = [
        { name: 'Hive', path: 'hive' },
        { name: 'Brood', path: 'brood' },
        { name: 'Raw data', path: 'stack' },
        { name: 'Weight', path: 'weight'},
        { name: 'Events', path: 'events'},
      ];
    }

    this.datePickerConfig = {

    };
  }

  ngOnInit() {
    this.userPrefsService.getUserPrefs().subscribe(
      _userPrefs => {
        this.user_pref = _userPrefs;
      },
      () => {},
      () => {}
    );
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
        /*let hiveSelect = this.rucheService.ruchesAllApiary.filter(_hive => _hive._id === this.rucheService.getCurrentHive()._id)[0];
        if (hiveSelect === undefined) {
          hiveSelect = this.rucheService.ruchesAllApiary.filter(_hive => _hive.apiaryId === this.rucherService.getCurrentApiary())[0];
        }
        this.melliChartHive.setHiveSelect(hiveSelect);
        this.stackService.addHive(hiveSelect);
        console.log(this.rucheService.ruchesAllApiary);
        console.log(this.rucherService.allApiaryAccount);*/
        console.log(this.melliChartHive.getHiveSelect());
        loopRuchers:
        for(let i=0; i<this.rucherService.allApiaryAccount.length; i++){
          let arr = [];
          loopRcuhes:
          for(let j=0; j<this.rucheService.ruchesAllApiary.length; j++){
            if(this.rucheService.ruchesAllApiary[j].apiaryId === this.rucherService.allApiaryAccount[i]._id){
              arr.push(this.rucheService.ruchesAllApiary[j]);
            }
          }
          arr.sort(this.compare);
          console.log( arr );
          if(arr.length > 0){
            let hiveSelect = arr[0];
            this.melliChartHive.setHiveSelect(hiveSelect);
            this.stackService.addHive(hiveSelect);
            break loopRuchers;
          }
        }
      }
    );

    

    let ua = navigator.userAgent;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|FxiOS/i.test(ua)){
      this.isDesktop = false;
      //console.log("mobile");
      //alert("mobile")
    }
    else{
      this.isDesktop = true;
      //console.log("desktop");
      //alert("desktop")
    }
     
    /*console.log(document.documentElement.clientWidth);
    alert(document.documentElement.clientWidth);
    if (document.documentElement.clientWidth < 1025) {
      this.isDesktop = false;
    }
    else this.isDesktop = true;*/
    


    this.inspCat.getInspCat().subscribe(
      _inspCat => {
        this.inspCats = [..._inspCat].sort((a:InspCat, b:InspCat) => { return a.code - b.code });
        let arr = [..._inspCat].sort((a:InspCat, b:InspCat) => { return a.code - b.code });
        arr.sort((a:InspCat, b:InspCat) => { return a.code - b.code }).forEach(_cat => {
          if(_cat.img !== "Default" && this.notConstant(_cat) && _cat.seasons.findIndex(_s => _s === this.season.getSeason()) !== -1){
            this.PICTOS_HIVES_OBS.push({
              name:_cat.name.toLowerCase(), 
              img: _cat.img.toLowerCase() + '_b.svg',
              img_active: _cat.img.toLowerCase() + '_cb.svg',
              class: 'hives-' + _cat.name.toLowerCase() + '-img',
              type: _cat.type
            })
          }
        })
        this.PICTOS_HIVES_OBS.push({
          name:'default', 
          img: 'default_b.svg',
          img_active:'default_cb.svg',
          class: 'hives-default-img',
          type: 'obs'
        })
      }
    )   
  }

  compare(a, b) {

    const apiA = a.name.toLowerCase();
    const apiB = b.name.toLowerCase();

    let comparison = 0;
    if (apiA > apiB) {
      comparison = 1;
    } else if (apiA < apiB) {
      comparison = -1;
    }
    return comparison;
  }

  notConstant(cat: InspCat): boolean{
    if(cat.name === 'Nobrood' || cat.name === 'Lowbrood' || cat.name === 'Normbrood' || cat.name === 'Highbrood' 
      || cat.name === 'Nobees' || cat.name === 'Lowbees' || cat.name === 'Normbees' || cat.name === 'Highbees'
      || cat.name === 'Nores' || cat.name === 'Lowres' || cat.name === 'Normres' || cat.name === 'Highres'){
      return false;
    }
    else return true;
  }

  ngAfterViewInit(): void {
    if (this.hiveComponent != undefined) {
      this.rucheService.hiveSubject.subscribe(() => { }, () => { }, () => {
        this.hiveComponent.loadDataFromHive();
      });
    }
    if(this.router.url.includes("hive")){
      this.eltOnClick = document.getElementById('hive');
    }
    else if(this.router.url.includes("brood")){
      this.eltOnClick = document.getElementById('brood');
    }
    else if(this.router.url.includes("weight")){
      this.eltOnClick = document.getElementById('weight');
    }
    else if(this.router.url.includes("stack")){
      this.eltOnClick = document.getElementById('stack');
    }
    else if(this.router.url.includes("events")){
      this.eltOnClick = document.getElementById('events');
    }
    this.dateDropdown = document.getElementById('date-dropdown');
    this.renderer.addClass(this.eltOnClick, 'nav-active');
  }

  ifActiveApiary(idLink: string, apiaryId: string): void {
    let link = (<HTMLLinkElement>document.getElementById(idLink));
    let divId = (<HTMLDivElement>document.getElementById(apiaryId));
    let icon = (<HTMLElement>link.getElementsByTagName('i')[0]);
    try {
      const index = this.rucherService.allApiaryAccount.findIndex(_apiary => _apiary._id === apiaryId);
      if (document.getElementById('' + index).classList.contains('in')) {
        divId.classList.remove('apiary-active');
        icon.classList.add('fa-rotate-90');
        return;
      }
      divId.classList.add('apiary-active');
      icon.classList.remove('fa-rotate-90');
      return;
    } catch {
      return;
    }
  }

  ifActiveIcon(apiaryId: string): string {
    try {
      const index = this.rucherService.allApiaryAccount.findIndex(_apiary => _apiary._id === apiaryId);
      if (document.getElementById('' + index).classList.contains('in')) {
        return 'fa-rotate-90';
      }
      return '';
    } catch {
      return '';
    }
  }

  ifCurrentApiary(apiaryId: string): string {
    try {
      return apiaryId === this.melliChartHive.getHiveSelect().apiaryId ? 'in' : '';
    } catch { }
  }

  onCloseDatePicker(): void {
    (<HTMLInputElement>document.getElementById('calendar-begin')).value = this.unitService.getDailyDate(this.melliChartDate.start);
    (<HTMLInputElement>document.getElementById('calendar-end')).value = this.unitService.getDailyDate(this.melliChartDate.end);
    this.dateDropdown.classList.add('open');
  }

  /**
   *
   *
   * @memberof ExploreComponent
   */
  nextDate(): void {
    const start: Date = new Date(this.melliChartDate.start);
    const end: Date = new Date(this.melliChartDate.end);

    this.melliChartDate.start = new Date(end.getTime());
    this.melliChartDate.end = new Date(end.getTime() + (this.melliChartDate.end.getTime() - start.getTime()));
    this.melliChartDate.start = this.melliChartDate.getDateBeginMonday(this.melliChartDate.start);
    this.setDateFromInput();

  }

  /**
   *
   *
   * @memberof ExploreComponent
   */
  previousDate(): void {
    // this.melliChartDate.start.setTime(this.melliChartDate.start.getTime() - this.melliChartDate.end.getTime());
    const start: Date = new Date(this.melliChartDate.start);
    const end: Date = new Date(this.melliChartDate.end);
    this.melliChartDate.start = new Date(start.getTime() - (end.getTime() - start.getTime()));
    this.melliChartDate.end = new Date(start.getTime());
    this.melliChartDate.start = this.melliChartDate.getDateBeginMonday(this.melliChartDate.start);
    this.setDateFromInput();
  }

  /**
   *
   *
   * @param {DataRange} rangeSelect
   * @memberof ExploreComponent
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
    } else if (this.router.url === PREFIX_PATH + 'brood' ) {
      this.broodComponent.loadAllHiveAfterRangeChange((options: any) => {
        options.baseOption.xAxis[0].min = this.melliChartDate.getRangeForReqest()[0];
        options.baseOption.xAxis[0].max = this.melliChartDate.getRangeForReqest()[1];
        this.stackService.getBroodChartInstance().setOption(options, true);
        this.stackService.getBroodChartInstance().hideLoading();
      });
    } else if (this.router.url === PREFIX_PATH + 'weight') {
      this.weightComponent.loadAllHiveAfterRangeChange((options: any) => {
        options.baseOption.xAxis[0].min = this.melliChartDate.getRangeForReqest()[0];
        options.baseOption.xAxis[0].max = this.melliChartDate.getRangeForReqest()[1];
        this.stackService.getWeightChartInstance().setOption(options, true);
        this.stackService.getWeightChartInstance().hideLoading();
      });
    } else if (this.router.url === PREFIX_PATH + 'events'){
      this.eventsComponent.loadAll();
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
    } else if (componentRef instanceof WeightComponent) {
      this.weightComponent = componentRef;
    } else if (componentRef instanceof EventsComponent){
      this.eventsComponent = componentRef;
    }

  }


  /**
   *
   *
   * @param {string} type
   * @returns {Array<DataRange>}
   * @memberof ExploreComponent
   */
  getRangeByType(type: string): Array<DataRange> {
    let arg: DataRange;
    const ranges: Array<DataRange> = this.melliChartDate.ranges.filter(elt => elt.type === type || elt.type === type + 'S');
    if (type === 'YEAR') {
      arg = this.melliChartDate.ranges[10];
      ranges.unshift(arg);
      arg = this.melliChartDate.ranges[9];
      ranges.unshift(arg);
    } else if (type === 'MONTH') {
      let index = ranges.findIndex(_range => _range.type === 'MONTHS' && _range.scale === 9);
      ranges.splice(index, 1);
      index = ranges.findIndex(_range => _range.type === 'MONTHS' && _range.scale === 6);
      ranges.splice(index, 1);
    }
    return ranges;
  }

  /**
   *
   *
   * @param {DataRange} range
   * @returns {DataRange}
   * @memberof ExploreComponent
   */
  getRangeBYLang(range: DataRange): string {
    return this.translateService.instant("MELLICHARTS.DATE."+range.type);
    if (this.translateService.currentLang === 'fr') {
      return this.melliChartDate.ranges.filter(_range => _range.type === range.type)[0].typeFr;
    } else if (this.translateService.currentLang === 'es') {
      return this.melliChartDate.ranges.filter(_range => _range.type === range.type)[0].typeEs;
    } else {
      return range.type;
    }
  }

  setDateFromInput(): void {
    const start = this.melliChartDate.start;
    const end = this.melliChartDate.end;
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
        options.baseOption.xAxis[0].min = this.melliChartDate.getRangeForReqest()[0];
        options.baseOption.xAxis[0].max = this.melliChartDate.getRangeForReqest()[1];
        this.stackService.getBroodChartInstance().setOption(options, true);
        this.stackService.getBroodChartInstance().hideLoading();
      });
    } else if (this.router.url === PREFIX_PATH + 'weight') {
      this.weightComponent.loadAllHiveAfterRangeChange((options: any) => {
        options.baseOption.xAxis[0].min = this.melliChartDate.getRangeForReqest()[0];
        options.baseOption.xAxis[0].max = this.melliChartDate.getRangeForReqest()[1];
        this.stackService.getWeightChartInstance().setOption(options, true);
        this.stackService.getWeightChartInstance().hideLoading();
      });

    } else if (this.router.url === PREFIX_PATH + 'events'){
      this.eventsComponent.loadAll();
    }
  }


  /**
   *
   *
   * @param {string} path
   * @memberof ExploreComponent
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
   * @memberof ExploreComponent
   */
  selectHive(hive: RucheInterface, event: MouseEvent): void {
    let length;
    switch (this.router.url) {
      case PREFIX_PATH + 'hive':
        this.melliChartHive.setHiveSelect(hive);
        if (this.stackService.getHiveSelect().length > 0) {
          this.stackService.cleanSlectedHives();
        }
        this.stackService.addHive(hive);
        this.hiveComponent.loadDataFromHive();
        (<HTMLSpanElement>document.getElementById(hive.apiaryId + '_span')).style.fontWeight = 'normal';
        break;
      case PREFIX_PATH + 'brood':
        if (this.stackService.ifActiveAlreadySelected(hive)) {
          this.stackService.removeHive(hive);
          this.broodComponent.removeHiveSerie(hive);
          (<HTMLSpanElement>document.getElementById(hive.apiaryId + '_span')).style.fontWeight = 'normal';
          length = this.stackService.getHiveSelect().length;
          this.melliChartHive.setHiveSelect(this.stackService.getHiveSelect()[length - 1]);
        } else {
          this.stackService.addHive(hive);
          this.broodComponent.loadDataByHive(hive);
          if(this.checkAllHivesSelected(this.rucherService.getApiaryByApiaryId(hive.apiaryId))){
            (<HTMLSpanElement>document.getElementById(hive.apiaryId + '_span')).style.fontWeight = 'bold';
          }
          this.melliChartHive.setHiveSelect(hive);
        }
        break;
      case PREFIX_PATH + 'stack':
        if (this.stackService.ifActiveAlreadySelected(hive)) {
          this.stackService.removeHive(hive);
          this.stackComponent.removeHiveSerie(hive);
          (<HTMLSpanElement>document.getElementById(hive.apiaryId + '_span')).style.fontWeight = 'normal';
          length = this.stackService.getHiveSelect().length;
          this.melliChartHive.setHiveSelect(this.stackService.getHiveSelect()[length - 1]);
        } else {
          this.stackService.addHive(hive);
          const t0 = performance.now();
          this.stackComponent.loadDataByHive(hive);
          const t1 = performance.now();
          if(this.checkAllHivesSelected(this.rucherService.getApiaryByApiaryId(hive.apiaryId))){
            (<HTMLSpanElement>document.getElementById(hive.apiaryId + '_span')).style.fontWeight = 'bold';
          }
          this.melliChartHive.setHiveSelect(hive);
        }
        break;
      case PREFIX_PATH + 'weight':
        if (this.stackService.ifActiveAlreadySelected(hive)) {
          this.stackService.removeHive(hive);
          this.weightComponent.removeHiveSerie(hive);
          (<HTMLSpanElement>document.getElementById(hive.apiaryId + '_span')).style.fontWeight = 'normal';
          length = this.stackService.getHiveSelect().length;
        this.melliChartHive.setHiveSelect(this.stackService.getHiveSelect()[length - 1]);
        } else {
          this.stackService.addHive(hive);
          this.weightComponent.loadDataByHive(hive);
          if(this.checkAllHivesSelected(this.rucherService.getApiaryByApiaryId(hive.apiaryId))){
            (<HTMLSpanElement>document.getElementById(hive.apiaryId + '_span')).style.fontWeight = 'bold';
          }
          this.melliChartHive.setHiveSelect(hive);
        }
        break;
      case PREFIX_PATH + 'events':
        if (this.stackService.ifActiveAlreadySelected(hive)) {
          this.stackService.removeHive(hive);
          this.eventsComponent.removeHive(hive);
          (<HTMLSpanElement>document.getElementById(hive.apiaryId + '_span')).style.fontWeight = 'normal';
          length = this.stackService.getHiveSelect().length;
          this.melliChartHive.setHiveSelect(this.stackService.getHiveSelect()[length - 1]);
        } else {
          this.stackService.addHive(hive);
          this.eventsComponent.loadHive(hive);
          if(this.checkAllHivesSelected(this.rucherService.getApiaryByApiaryId(hive.apiaryId))){
            (<HTMLSpanElement>document.getElementById(hive.apiaryId + '_span')).style.fontWeight = 'bold';
          }
          this.melliChartHive.setHiveSelect(hive);
        }
        break;
    }
  }

  checkAllHivesSelected(apiary: RucherModel): boolean{
    if(this.rucheService.getHivesIdsByApiaryId(apiary._id).every((_hiveId) => this.stackService.getHiveSelectIdsOfApiary(apiary._id).findIndex(_id => _id ===_hiveId) !== -1) &&
       this.rucheService.getHivesIdsByApiaryId(apiary._id).length === this.stackService.getHiveSelectIdsOfApiary(apiary._id).length ){
      return true;
    }
    return false;
  }

  apiaryClick(rucher: RucherModel): void {
    let span = (<HTMLSpanElement>document.getElementById(rucher._id + '_span'));
    let active = this.checkAllHivesSelected(rucher);
    if(!active){
      //console.log('je suis ici');
      span.style.fontWeight = 'bold';
      let hivesToSelect = this.rucheService.getHivesIdsByApiaryId(rucher._id).filter(hiveId => { if(this.stackService.getHiveSelectIdsOfApiary(rucher._id).indexOf(hiveId) === -1) return hiveId; } );
      hivesToSelect.forEach(hiveId => {
        let hive = this.rucheService.getHiveById(hiveId);
        switch(this.router.url){
          case PREFIX_PATH + 'hive':
            span.style.fontWeight = 'normal';
            break;
          case PREFIX_PATH + 'brood':
            this.stackService.addHive(hive);
            this.broodComponent.loadDataByHive(hive);
            break;
          case PREFIX_PATH + 'weight':
            this.stackService.addHive(hive);
            this.weightComponent.loadDataByHive(hive);
            break;
          case PREFIX_PATH + 'stack':
            this.stackService.addHive(hive);
            this.stackComponent.loadDataByHive(hive);
            break;
          case PREFIX_PATH + 'events':
            this.stackService.addHive(hive);
            this.eventsComponent.loadHive(hive);
            break;
        }
      })
      return;
    }
    let hivesToDelete = [...this.rucheService.getHivesIdsByApiaryId(rucher._id)];
    hivesToDelete.splice(0, 1);
    span.style.fontWeight = 'normal';
    hivesToDelete.forEach(hiveId => {
      let hive = this.rucheService.getHiveById(hiveId);
      switch(this.router.url){
        case PREFIX_PATH + 'hive':
          break;
        case PREFIX_PATH + 'brood':
          this.stackService.removeHive(hive);
          this.broodComponent.removeHiveSerie(hive);
          break;
        case PREFIX_PATH + 'weight':
          this.stackService.removeHive(hive);
          this.weightComponent.removeHiveSerie(hive);
          break;
        case PREFIX_PATH + 'stack':
          this.stackService.removeHive(hive);
          this.stackComponent.removeHiveSerie(hive);
          break;
        case PREFIX_PATH + 'events':
          this.stackService.removeHive(hive);
          this.eventsComponent.removeHive(hive);
          break;
      }
    })
    return;
  }


  /**
   *
   *
   * @returns {string}
   * @memberof ExploreComponent
   */
  getStartDate(): string {
    return new Date(this.melliChartDate.start).toISOString().substring(0, 10);
  }


  /**
   *
   *
   * @returns {string}
   * @memberof ExploreComponent
   */
  getEndDate(): string {
    return new Date(this.melliChartDate.end).toISOString().substring(0, 10);
  }

  /**
   *
   *
   * @param {RucheInterface} hive
   * @returns {string}
   * @memberof ExploreComponent
   */
  getColor(hive: RucheInterface): string {
    switch (this.router.url) {
      case PREFIX_PATH + 'hive':
        return this.melliChartHive.getColorByIndex(this.rucherService.rucheService.ruchesAllApiary.map(elt => elt._id).indexOf(hive._id), hive);

        break;
      case PREFIX_PATH + 'brood':
      case PREFIX_PATH + 'weight':
      case PREFIX_PATH + 'events' :
      case PREFIX_PATH + 'stack':
        //console.log(this.rucherService.rucheService.ruchesAllApiary.map(elt => elt._id).indexOf(hive._id));
        return this.stackService.getColorByIndex(this.rucherService.rucheService.ruchesAllApiary.map(elt => elt._id).indexOf(hive._id), hive);
        break;
    }
  }
  /**
   *
   *
   * @param {string} apiaryId
   * @returns {string}
   * @memberof ExploreComponent
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
      case PREFIX_PATH + 'weight':
      case PREFIX_PATH + 'events' :
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
      case PREFIX_PATH + 'weight':
      case PREFIX_PATH + 'events':
      case PREFIX_PATH + 'stack':
        //return this.stackService.
        break;
    }
  }

  mouseEnter(id: string){
    if(this.isDesktop){
      let div = <HTMLDivElement>document.getElementById(id);
      let more_btn = <HTMLButtonElement>div.getElementsByClassName("hive-more-button")[0];
      more_btn.style.visibility = 'visible';
    }
    
  }

  mouseLeave(id: string){
    if(this.isDesktop){
      let div = <HTMLDivElement>document.getElementById(id);
      let more_btn = <HTMLButtonElement>div.getElementsByClassName("hive-more-button")[0];
      more_btn.style.visibility = 'hidden';
    }
  }

  showContextMenu(rucher: RucherModel, ruche: RucheInterface, evt: MouseEvent): void {
    evt.stopPropagation();
    evt.preventDefault();
    const menu = (<HTMLElement>document.getElementsByClassName('right-click-menu')[0]);
    menu.style.top = (evt.clientY + 2) + 'px';
    menu.style.left = (evt.clientX - 200) + 'px';
    menu.style.visibility = 'visible';


    let btn = <HTMLButtonElement>document.getElementsByClassName('hive-more-button active')[0];
    if(btn != undefined){
      btn.classList.remove('active');
    }
    if((<HTMLElement>evt.target).localName === 'svg'){
      btn = <HTMLButtonElement>(<HTMLElement>evt.target).parentElement;
    }
    else if ((<HTMLElement>evt.target).localName === 'ellipse'){
      btn = <HTMLButtonElement>(<HTMLElement>(<HTMLElement>evt.target).parentElement).parentElement;
    }
    else{
      btn = <HTMLButtonElement>evt.target;
    }
    btn.classList.add('active');

    const list = (<HTMLElement>menu.getElementsByClassName('context-menu-group')[0]);

    this.new_event = {
      _id: null,
      apiaryInspId: null,
      apiaryId: null,
      hiveId: null,
      userId: null,
      createDate: null,
      opsDate: null,
      type: null,
      description: null,
      tags: [],
      tasks: [],
      obs: [],
      todo: null
    };

    if(ruche != null){
      this.hiveEvent = Object.assign({}, ruche);
      this.typeEvent = 'hive';
      this.rucherService.findRucherById(ruche.apiaryId, (apiary) => {
        this.apiaryEvent = Object.assign({}, apiary);
      });
      this.new_event.apiaryId = ruche.apiaryId;
      this.new_event.type = this.typeEvent;
      this.new_event.hiveId = ruche._id;
      return;
    }

    this.apiaryEvent = Object.assign({}, rucher);
    this.typeEvent = 'apiary';
    this.new_event.type = this.typeEvent;
    this.new_event.apiaryId = rucher._id;
    return;

  }

  closeContextMenu(): void {
    (<HTMLElement>document.getElementsByClassName('right-click-menu')[0]).style.visibility = 'hidden';
    let btn = <HTMLButtonElement>document.getElementsByClassName('hive-more-button active')[0];
    if(btn != undefined){
      btn.classList.remove('active');
    }
  }

  // <--- ADD EVENT SCREEN --->

  showAddEvent(rucher: RucherModel, ruche: RucheInterface, evt: MouseEvent): void {
    this.PICTOS_HIVES_OBS = [];
    this.new_event = {
      _id: null,
      apiaryInspId: null,
      apiaryId: null,
      hiveId: null,
      userId: null,
      createDate: null,
      opsDate: null,
      type: null,
      description: null,
      tags: [],
      tasks: [],
      obs: [],
      todo: null
    };

    if(ruche != null){
      this.hiveEvent = Object.assign({}, ruche);
      this.typeEvent = 'hive';
      this.rucherService.findRucherById(ruche.apiaryId, (apiary) => {
        this.apiaryEvent = Object.assign({}, apiary);
      });
      this.new_event.apiaryId = ruche.apiaryId;
      this.new_event.type = this.typeEvent;
      this.new_event.hiveId = ruche._id;

      this.inspCat.getInspCat().subscribe(
        _inspCat => {
          let arr = [..._inspCat].sort((a:InspCat, b:InspCat) => { return a.code - b.code });
          arr.forEach(_cat => {
            if(_cat.applies.indexOf("hive") !== -1 && _cat.img !== "Default" && this.notConstant(_cat)){
              this.PICTOS_HIVES_OBS.push({
                name:_cat.name.toLowerCase(), 
                img: _cat.img.toLowerCase() + '_b.svg',
                img_active: _cat.img.toLowerCase() + '_cb.svg',
                class: 'hives-' + _cat.name.toLowerCase() + '-img',
                type: _cat.type
              })
            }
          })
          this.PICTOS_HIVES_OBS.push({
            name:'default', 
            img: 'default_b.svg',
            img_active:'default_cb.svg',
            class: 'hives-default-img',
            type: 'obs'
          })
        },
        () => {},
        () => {
          console.log(this.PICTOS_HIVES_OBS);
          this.apiaryEvent = Object.assign({}, rucher);
          this.new_event.type = this.typeEvent;
          this.new_event.apiaryId = rucher._id;
          this.newEventDate = new Date();
          this.new_event.userId = this.userService.getIdUserLoged();
          this.new_event.createDate = new Date();
          this.new_event.opsDate = new Date();
          (<HTMLElement>document.getElementsByClassName('add-event-time-error')[0]).style.display = 'none';
          (<HTMLInputElement>document.getElementsByClassName('add-event-time-input')[0]).value = this.unitService.getDailyDate(this.newEventDate);
          (<HTMLInputElement>document.getElementsByClassName('add-event-hours-input')[0]).value = this.newEventDate.getHours().toString();
          (<HTMLInputElement>document.getElementsByClassName('add-event-minutes-input')[0]).value = this.newEventDate.getMinutes().toString();
          (<HTMLTextAreaElement>document.getElementsByClassName('add-event-notes-textarea')[0]).value = null;
          (<HTMLTextAreaElement>document.getElementsByClassName('add-event-todo-textarea')[0]).value = null;
          this.addObsList();
        }
      )   
    }
    else{
      this.inspCat.getInspCat().subscribe(
        _inspCat => {
          let arr = [..._inspCat].sort((a:InspCat, b:InspCat) => { return a.code - b.code });
          arr.forEach(_cat => {
            if(_cat.applies.indexOf("apiary") !== -1 && _cat.img !== "Default" && this.notConstant(_cat)){
              this.PICTOS_HIVES_OBS.push({
                name:_cat.name.toLowerCase(), 
                img: _cat.img.toLowerCase() + '_b.svg',
                img_active: _cat.img.toLowerCase() + '_cb.svg',
                class: 'hives-' + _cat.name.toLowerCase() + '-img',
                type: _cat.type
              })
            }
          })
          this.PICTOS_HIVES_OBS.push({
            name:'default', 
            img: 'default_b.svg',
            img_active:'default_cb.svg',
            class: 'hives-default-img',
            type: 'obs'
          })
        },
        () => {},
        () => {
          console.log(this.PICTOS_HIVES_OBS);
          this.apiaryEvent = Object.assign({}, rucher);
          this.new_event.type = this.typeEvent;
          this.new_event.apiaryId = rucher._id;
          this.newEventDate = new Date();
          this.new_event.userId = this.userService.getIdUserLoged();
          this.new_event.createDate = new Date();
          this.new_event.opsDate = new Date();
          (<HTMLElement>document.getElementsByClassName('add-event-time-error')[0]).style.display = 'none';
          (<HTMLInputElement>document.getElementsByClassName('add-event-time-input')[0]).value = this.unitService.getDailyDate(this.newEventDate);
          (<HTMLInputElement>document.getElementsByClassName('add-event-hours-input')[0]).value = this.newEventDate.getHours().toString();
          (<HTMLInputElement>document.getElementsByClassName('add-event-minutes-input')[0]).value = this.newEventDate.getMinutes().toString();
          (<HTMLTextAreaElement>document.getElementsByClassName('add-event-notes-textarea')[0]).value = null;
          (<HTMLTextAreaElement>document.getElementsByClassName('add-event-todo-textarea')[0]).value = null;
          (<HTMLInputElement>document.getElementById("bees_none_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_none_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_none_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_high_check")).checked = false;
          this.addObsList();
        }
      )   
      this.typeEvent = 'apiary';
    }
  }

  addObsList(): void {
    const obsDiv = (<HTMLElement>document.getElementsByClassName('add-event-choice-obs')[0]);
    obsDiv.innerHTML = '';
    
    for (let i = 0; i < this.PICTOS_HIVES_OBS.length; i++) {

      const button = document.createElement('button');
      if(this.PICTOS_HIVES_OBS[i].type === 'act'){
        button.className = 'hives-act-add';
      }
      if(this.PICTOS_HIVES_OBS[i].type === 'obs'){
        button.className = 'hives-obs-add';
      }

      button.setAttribute('data-toggle', 'tooltip');
      button.setAttribute('data-placement', 'top');
      button.setAttribute('title', this.translateService.instant('INSP_CONF.' + this.PICTOS_HIVES_OBS[i].name.toUpperCase()));

      button.classList.add(this.PICTOS_HIVES_OBS[i].class);
      button.onclick = (evt: Event) => {
        const n = i;
        this.hiveButton(evt, n);
      };

      obsDiv.appendChild(button);

    }
  }

  hiveButton(evt: Event, btnIndex: number): void {
    const button = (<HTMLButtonElement> evt.target);
    if ( button.classList.contains(this.PICTOS_HIVES_OBS[btnIndex].class + '-active') ) {
      button.classList.remove(this.PICTOS_HIVES_OBS[btnIndex].class + '-active');
      const i = this.new_event.obs.findIndex(e => e.name === this.PICTOS_HIVES_OBS[btnIndex].name);
      this.new_event.obs.splice(i, 1);
      return;
    }
    button.classList.add(this.PICTOS_HIVES_OBS[btnIndex].class + '-active');
    this.new_event.obs.push({name: this.PICTOS_HIVES_OBS[btnIndex].name, img: this.PICTOS_HIVES_OBS[btnIndex].img});
    return;
  }

  setNewEventDate(): void {
    this.newEventDate = new Date( (<any>this.newEventDate)._d);
    (<HTMLInputElement>document.getElementsByClassName('add-event-time-input')[0]).value = this.unitService.getDailyDate(this.newEventDate);
    this.new_event.opsDate = this.newEventDate;
    this.newEventDate.setHours( parseInt( (<HTMLInputElement>document.getElementsByClassName('add-event-hours-input')[0]).value ));
    this.newEventDate.setMinutes( parseInt( (<HTMLInputElement>document.getElementsByClassName('add-event-minutes-input')[0]).value ));
  }

  setNewEventHours(evt: Event): void{
    if(parseInt((<HTMLInputElement>evt.target).value) > 23){
      (<HTMLInputElement>evt.target).value = "23";
    }
    this.newEventDate.setHours( parseInt((<HTMLInputElement>evt.target).value) );
    this.new_event.opsDate = new Date(this.newEventDate);
  }

  setNewEventMinutes(evt: Event): void{
    if(parseInt((<HTMLInputElement>evt.target).value) > 59){
      (<HTMLInputElement>evt.target).value = "59";
    }
    this.newEventDate.setMinutes( parseInt((<HTMLInputElement>evt.target).value) );
    this.new_event.opsDate = new Date(this.newEventDate);
  }

  showNotes(evt: Event){
    let textArea = <HTMLTextAreaElement>(<HTMLElement>evt.target).parentNode.parentNode.children[1];
    if( (<HTMLElement>evt.target).nodeName === 'I' ){
      textArea = <HTMLTextAreaElement>(<HTMLElement>evt.target).parentNode.parentNode.parentNode.children[1];
    }
    if (textArea.classList.contains('hives-note-textarea-add-active')) {
        textArea.classList.remove('hives-note-textarea-add-active');
    } else {
      textArea.classList.add('hives-note-textarea-add-active');
    }
  }

  saveNotes(evt: Event): void {
    const textArea = <HTMLTextAreaElement>evt.target;
    this.new_event.description = textArea.value;
  }

  showTodo(evt: Event){
    let textArea = <HTMLTextAreaElement>(<HTMLElement>evt.target).parentNode.parentNode.parentNode.children[2].children[1];
    if (textArea.classList.contains('hives-todo-textarea-add-active')) {
        textArea.classList.remove('hives-todo-textarea-add-active');
    } else {
      textArea.classList.add('hives-todo-textarea-add-active');
    }
  }

  saveTodo(evt: Event): void {
    const textArea = <HTMLTextAreaElement>evt.target;
    this.new_event.todo = textArea.value;
  }

  addTag(event: Event): void{
    const input = <HTMLInputElement>document.getElementsByClassName('add-event-tags-input')[0];
    const value = input.value;

    // Add our fruit
    if (value != null && value != '') {
      this.tags.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void{
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  setBeeLevel(lvl: string): void{
    let index;
    switch(lvl){
      case 'low':
        (<HTMLInputElement>document.getElementById("bees_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("bees_high_check")).checked = false;
        (<HTMLInputElement>document.getElementById("bees_none_check")).checked = false;
        index = this.new_event.obs.findIndex(_o => _o.name.includes("Normbees") || _o.name.includes("Highbees") || _o.name.includes("Nobees"));
        if(index > -1){
          this.new_event.obs.splice(index,1);
        }
        this.new_event.obs.push({name:'Lowbees', img:'lowbees_b.svg'});
        break;
      case 'avg':
        (<HTMLInputElement>document.getElementById("bees_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("bees_high_check")).checked = false;
        (<HTMLInputElement>document.getElementById("bees_none_check")).checked = false;
        index = this.new_event.obs.findIndex(_o => _o.name.includes("Lowbees") || _o.name.includes("Highbees") || _o.name.includes("Nobees"));
        if(index > -1){
          this.new_event.obs.splice(index,1);
        }
        this.new_event.obs.push({name:'Normbees', img:'normbees_b.svg'});
        break;
      case 'high':
        (<HTMLInputElement>document.getElementById("bees_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("bees_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("bees_none_check")).checked = false;
        index = this.new_event.obs.findIndex(_o => _o.name.includes("Normbees") || _o.name.includes("Lowbees") || _o.name.includes("Nobees"));
        if(index > -1){
          this.new_event.obs.splice(index,1);
        }
        this.new_event.obs.push({name:'Highbees', img:'highbees_b.svg'});
        break;
      case 'none':
        (<HTMLInputElement>document.getElementById("bees_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("bees_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("bees_high_check")).checked = false;
        index = this.new_event.obs.findIndex(_o => _o.name.includes("Normbees") || _o.name.includes("Highbees") || _o.name.includes("Lowbees"));
        if(index > -1){
          this.new_event.obs.splice(index,1);
        }
        this.new_event.obs.push({name:'Nobees', img:'nobees_b.svg'});
        break;
    }
    return;
  }

  setBroodLevel(lvl: string){
    let index;
    switch(lvl){
      case 'low':
        (<HTMLInputElement>document.getElementById("brood_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("brood_high_check")).checked = false;
        (<HTMLInputElement>document.getElementById("brood_none_check")).checked = false;
        index = this.new_event.obs.findIndex(_o => _o.name.includes("Normbrood") || _o.name.includes("Highbrood") || _o.name.includes("Nobrood"));
        if(index > -1){
          this.new_event.obs.splice(index,1);
        }
        this.new_event.obs.push({name:'Lowbrood', img:'lowbrood_b.svg'});
        break;
      case 'avg':
        (<HTMLInputElement>document.getElementById("brood_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("brood_high_check")).checked = false;
        (<HTMLInputElement>document.getElementById("brood_none_check")).checked = false;
        index = this.new_event.obs.findIndex(_o => _o.name.includes("Lowbrood") || _o.name.includes("Highbrood") || _o.name.includes("Nobrood"));
        if(index > -1){
          this.new_event.obs.splice(index,1);
        }
        this.new_event.obs.push({name:'Normbrood', img:'normbrood_b.svg'});
        break;
      case 'high':
        (<HTMLInputElement>document.getElementById("brood_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("brood_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("brood_none_check")).checked = false;
        index = this.new_event.obs.findIndex(_o => _o.name.includes("Normbrood") || _o.name.includes("Lowbrood") || _o.name.includes("Nobrood"));
        if(index > -1){
          this.new_event.obs.splice(index,1);
        }
        this.new_event.obs.push({name:'Highbrood', img:'highbrood_b.svg'});
        break;
      case 'none':
        (<HTMLInputElement>document.getElementById("brood_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("brood_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("brood_high_check")).checked = false;
        index = this.new_event.obs.findIndex(_o => _o.name.includes("Normbrood") || _o.name.includes("Highbrood") || _o.name.includes("Lowbrood"));
        if(index > -1){
          this.new_event.obs.splice(index,1);
        }
        this.new_event.obs.push({name:'Nobrood', img:'nobrood_b.svg'});
        break;
    }
    return;
  }

  setResLevel(lvl: string): void{
    let index;
    switch(lvl){
      case 'low':
        (<HTMLInputElement>document.getElementById("res_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("res_high_check")).checked = false;
        (<HTMLInputElement>document.getElementById("res_none_check")).checked = false;
        index = this.new_event.obs.findIndex(_o => _o.name.includes("Normres") || _o.name.includes("Highres") || _o.name.includes("Nores"));
        if(index > -1){
          this.new_event.obs.splice(index,1);
        }
        this.new_event.obs.push({name:'Lowres', img:'lowres_b.svg'});
        break;
      case 'avg':
        (<HTMLInputElement>document.getElementById("res_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("res_high_check")).checked = false;
        (<HTMLInputElement>document.getElementById("res_none_check")).checked = false;
        index = this.new_event.obs.findIndex(_o => _o.name.includes("Lowres") || _o.name.includes("Highres") || _o.name.includes("Nores"));
        if(index > -1){
          this.new_event.obs.splice(index,1);
        }
        this.new_event.obs.push({name:'Normres', img:'normres_b.svg'});
        break;
      case 'high':
        (<HTMLInputElement>document.getElementById("res_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("res_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("res_none_check")).checked = false;
        index = this.new_event.obs.findIndex(_o => _o.name.includes("Normres") || _o.name.includes("Lowres") || _o.name.includes("Nores"));
        if(index > -1){
          this.new_event.obs.splice(index,1);
        }
        this.new_event.obs.push({name:'Highres', img:'highres_b.svg'});
        break;
      case 'none':
        (<HTMLInputElement>document.getElementById("res_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("res_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("res_high_check")).checked = false;
        index = this.new_event.obs.findIndex(_o => _o.name.includes("Normres") || _o.name.includes("Highres") || _o.name.includes("Lowres"));
        if(index > -1){
          this.new_event.obs.splice(index,1);
        }
        this.new_event.obs.push({name:'Nores', img:'nores_b.svg'});
        break;
    }
    return;
  }

  insertAddEvent(): void {
    let hours = parseInt((<HTMLInputElement>document.getElementsByClassName('add-event-hours-input')[0]).value)
    let minutes = parseInt((<HTMLInputElement>document.getElementsByClassName('add-event-minutes-input')[0]).value)
    if (this.new_event.opsDate == null  || hours > 23 || minutes > 59 ) {
      (<HTMLElement>document.getElementsByClassName('add-event-time-error')[0]).style.display = 'flex';
      return;
    }
    this.new_event.obs = this.new_event.obs.sort((a,b) => {
      let iA = this.inspCats.find(_i => _i.name.toLowerCase() === a.name.toLowerCase());
      let iB = this.inspCats.find(_i => _i.name.toLowerCase() === b.name.toLowerCase());
      return iA.code - iB.code;
    });
    (<HTMLElement>document.getElementsByClassName('add-event-time-error')[0]).style.display = 'none';
    this.inspService.insertHiveEvent(this.new_event).subscribe(
      _insp => {
        this.insertOnGraph(_insp);
      },
      () => {},
      () => {
        if(this.translateService.currentLang === 'fr'){
          this.notify.notify('success', 'Inspection créée');

        }else{
          this.notify.notify('success', 'Created Inspection');
        }
        let btn = <HTMLButtonElement>document.getElementsByClassName('hive-more-button active')[0];
        if(btn != undefined){
          btn.classList.remove('active');
        }
      }
    );
    $('#newInspectionModal').modal('hide');
    return;
  }

  dismissAddEvent(): void{
    let btn = <HTMLButtonElement>document.getElementsByClassName('hive-more-button active')[0];
    btn.classList.remove('active');
  }

  insertOnGraph(insp: Inspection): void {
    switch (this.router.url) {
      case PREFIX_PATH + 'hive':
        this.hiveComponent.dailyComponent.loadDailyEnvData(false);
        break;
      case PREFIX_PATH + 'brood':
        this.broodComponent.insertNewEvent(insp);
        break;
      case PREFIX_PATH + 'weight':
        break;
      case PREFIX_PATH + 'stack':
        break;
      case PREFIX_PATH + 'events':
        this.eventsComponent.insertNewInsp(insp);
        break;
    }
  }

  // <--- END ADD EVENT SCREEN --->

  // <--- FILTERS BEHAVIOUR --->

  openFiltersMenu(evt: Event){
    this.buildFilterDisplay();
  }


  filterMenu(e: Event): void{
    e.stopPropagation();
  }

  buildFilterDisplay(): void{
    let container = (<HTMLElement>document.getElementsByClassName('filters-events-display')[0]);
    container.innerHTML = '';
    this.melliFilters.alertsDisplay.forEach( alert => {
      let input = document.createElement('input');
      input.type = 'button';
      input.value = alert.name;
      if(alert.show){
        input.className = 'filters-events-display-' + alert.name +'-active';
      }
      else{
        input.className = 'filters-events-display-' + alert.name;
      }
      input.onclick = (evt: Event) => { this.filterDisplayButton(evt); }
      container.appendChild(input);
    });
  }

  filterButton(evt: Event): void{
    const button = (<HTMLInputElement>evt.target);
    const filter: string = button.nextSibling.textContent;
    let active: boolean = false;
    if (button.className.includes('-active')) {
      button.className = button.className.slice(0, -7);
      active = false;
    }
    else{
      button.className = button.className + '-active';
      active = true;
    }
    if(button.className.includes('alert')){
      this.melliFilters.changeFilter('alert', active);
      this.applyFilter('alert', active);
      return;
    }
    if(button.className.includes('inspection')){
      this.melliFilters.changeFilter('inspection', active);
      this.applyFilter('inspection', active);
      return;
    }
    if(button.className.includes('event')){
      this.melliFilters.changeFilter('event', active);
      this.applyFilter('event', active);
      return;
    }
  }

  filterDisplayButton(evt: Event): void{
    const button = (<HTMLInputElement>evt.target);
    let active: boolean = false;
    if (button.className.includes('-active')) {
      button.className = button.className.slice(0, -7);
      active = false;
    }
    else{
      button.className = button.className + '-active';
      active = true;
    }
    this.melliFilters.changeDisplay(button.value, active);
    let index = this.melliFilters.alertsDisplay.findIndex( alert => alert.name === button.value);
    this.melliFilters.alertsDisplay[index].show = active;
    this.applyDisplay(button.value, active);
  }

  applyFilter(filterName: string, show: boolean): void{
    switch (this.router.url) {
      case PREFIX_PATH + 'hive':
        break;
      case PREFIX_PATH + 'brood':
        this.broodComponent.applyFilter(filterName, show);
        break;
      case PREFIX_PATH + 'weight':
        break;
      case PREFIX_PATH + 'stack':
        break;
      case PREFIX_PATH + 'events':
        this.eventsComponent.applyFilter(filterName, show);
        break;
    }
  }

  applyDisplay(displayName: string, show: boolean): void{
    switch (this.router.url) {
      case PREFIX_PATH + 'hive':
        break;
      case PREFIX_PATH + 'brood':
        this.broodComponent.applyFilter('alert', true);
        break;
      case PREFIX_PATH + 'weight':
        break;
      case PREFIX_PATH + 'stack':
        break;
      case PREFIX_PATH + 'events':
        this.eventsComponent.applyDisplay(displayName, show);
        break;
    }
  }


  /* Hive Color part */
  changeApiary(evt: Event): void{
    let select = <HTMLInputElement>evt.target;
    //console.log(select.value);
    this.apiaryColor = this.rucherService.allApiaryAccount.find(_a => _a._id === select.value);
  }

  deleteColor(ruche: RucheInterface){
    ruche.color = null;
  }

  testSave(){
    let obsArray = this.rucheService.getHivesByApiaryId(this.apiaryColor._id)
                                    .map( _r => {
                                      return {
                                        ruche: _r,
                                        obs: this.rucheService.updateRuche(_r)
                                      }
                                    });
    let button = <HTMLButtonElement>document.getElementById("save-colors");
    button.disabled = true;
    Observable.forkJoin(obsArray.map(_elt => _elt.obs)).subscribe(
      () => {}, 
      () => {
        setTimeout( () => {
          this.notify.notify('error','Il y a eu une erreur dans la sauvegarde des couleurs');
          button.disabled = false;
          console.log('error in saving');
        }, 300);
        
      }, 
      () => {
        setTimeout( () => {
          this.notify.notify('success','Couleurs sauvegardés');
          button.disabled = false;
          console.log('colors saved');
          $('#colorModal').modal('hide');
        }, 300);
      }
    )
  }

}
