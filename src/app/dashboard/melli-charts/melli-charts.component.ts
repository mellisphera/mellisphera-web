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
import { type } from 'os';
import { TranslateService } from '@ngx-translate/core';
import { WeightComponent } from './weight/weight.component';
import { UnitService } from '../service/unit.service';
import * as moment from 'moment';
import { UserPref } from '../../_model/user-pref';
import { InspHive } from '../../_model/inspHive';
import { InspHiveService } from '../service/api/insp-hive.service';
import { p } from '@angular/core/src/render3';
import { checkNoChanges } from '@angular/core/src/render3/instructions';

const PREFIX_PATH = '/dashboard/explore/';
const IMG_PATH = '../../../assets/icons/inspect/';

const PICTOS_HIVES_OBS = [
  {name:'swarm', img:'observations/swarm_grey.png', img_active: 'observations/swarm.png', class:'hives-swarm-img'},
  /*{name:'Y2', img:''},
  {name:'X3', img:''},
  {name:'W4', img:''},*/
];

@Component({
  selector: 'app-melli-charts',
  templateUrl: './melli-charts.component.html',
  styleUrls: ['./melli-charts.component.css',
              '../shared/navbar/navbar.component.scss',
              '../dashboard.component.css'
              ],
  encapsulation: ViewEncapsulation.None,
})
export class MelliChartsComponent implements OnInit, AfterViewInit {

  public xPosContextMenu: number = 0;
  public yPosContextMenu: number = 0;

  public newEventDate: Date;
  public hiveEvent: RucheInterface;
  public apiaryEvent: RucherModel;

  public hiveEventList: InspHive[];
  public hiveEventToDelete: InspHive[] | null;

  public new_event : InspHive = {
    _id: null,
    inspId: null,
    date: null,
    apiaryId: null,
    hiveId: null,
    tasks: [],
    obs: [],
    notes: null,
    todo: null
  }

  public user_pref : UserPref;

  public btnNav: any[];
  private btnTypeElement: HTMLElement;
  public typeNav: Array<Object>;
  public datePickerConfig: any;
  private hiveComponent: HiveComponent;
  private stackComponent: StackComponent;
  private dateDropdown: HTMLElement;
  private broodComponent: VitalityComponent;
  private weightComponent: WeightComponent;
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
    private userConfig: UserParamsService,
    private userPrefsService: UserParamsService,
    private unitService: UnitService,
    private inspHiveService: InspHiveService) {
    if (this.translateService.currentLang === 'fr') {
      this.btnNav = [
        { name: 'Ruche', path: 'hive' },
        { name: 'Couvain', path: 'brood' },
        { name: 'Données', path: 'stack' },
        { name: 'Poids', path: 'weight'}
      ];
    } else if (this.translateService.currentLang === 'es') {
      this.btnNav = [
        { name: 'Colmena', path: 'hive' },
        { name: 'Cría', path: 'brood' },
        { name: 'Datos', path: 'stack' },
        { name: 'Peso', path: 'weight'}
      ];
    }
    else {
      this.btnNav = [
        { name: 'Hive', path: 'hive' },
        { name: 'Brood', path: 'brood' },
        { name: 'Raw data', path: 'stack' },
        { name: 'Weight', path: 'weight'}
      ];
    }

    this.datePickerConfig = {

    }
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
    if (this.hiveComponent != undefined) {
      this.rucheService.hiveSubject.subscribe(() => { }, () => { }, () => {
        this.hiveComponent.loadDataFromHive();
      });
    }
    this.eltOnClick = document.getElementById('hive');
    this.dateDropdown = document.getElementById('date-dropdown');
    this.renderer.addClass(this.eltOnClick, 'nav-active');
  }



  ifActiveApiary(apiaryId: string): string {
    try {
      const index = this.rucherService.allApiaryAccount.findIndex(_apiary => _apiary._id === apiaryId);
      if (document.getElementById('' + index).classList.contains('in')) {
        return 'caret-up';
      } else {
        return '';
      }
    } catch {
      return '';
    }
  }

  ifCurrentApiary(apiaryId: string): string {
    try {
      return apiaryId === this.melliChartHive.getHiveSelect().apiaryId ? 'in' : '';
    } catch{ }
  }
  onCloseDatePicker(): void {
    (<HTMLInputElement>document.getElementById("calendar-begin")).value = this.unitService.getDailyDate(this.melliChartDate.start);
    (<HTMLInputElement>document.getElementById("calendar-end")).value = this.unitService.getDailyDate(this.melliChartDate.end);
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
    this.melliChartDate.start = this.melliChartDate.getDateBeginMonday(this.melliChartDate.start);
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
    this.melliChartDate.start = this.melliChartDate.getDateBeginMonday(this.melliChartDate.start);
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
    } else if (componentRef instanceof WeightComponent){
        this.weightComponent = componentRef;
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
        options.baseOption.xAxis[0].min = this.melliChartDate.getRangeForReqest()[0];
        options.baseOption.xAxis[0].max = this.melliChartDate.getRangeForReqest()[1];
        this.stackService.getBroodChartInstance().setOption(options, true);
        this.stackService.getBroodChartInstance().hideLoading();
      });
    } else if (this.router.url === PREFIX_PATH + 'weight'){
      this.weightComponent.loadAllHiveAfterRangeChange((options: any) => {
        options.baseOption.xAxis[0].min = this.melliChartDate.getRangeForReqest()[0];
        options.baseOption.xAxis[0].max = this.melliChartDate.getRangeForReqest()[1];
        this.stackService.getWeightChartInstance().setOption(options, true);
        this.stackService.getWeightChartInstance().hideLoading();
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
          let t0 = performance.now();
          this.stackComponent.loadDataByHive(hive);
          let t1 = performance.now();

        }
        break;
      case PREFIX_PATH + 'weight':
        this.melliChartHive.setHiveSelect(this.stackService.getHiveSelect()[0]);
        if (this.stackService.ifActiveAlreadySelected(hive)) {
          this.stackService.removeHive(hive);
          this.weightComponent.removeHiveSerie(hive);

        } else {
          this.stackService.addHive(hive);
          this.weightComponent.loadDataByHive(hive);
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
        return this.melliChartHive.getColorByIndex(this.rucherService.rucheService.ruchesAllApiary.map(elt => elt._id).indexOf(hive._id), hive);

        break;
      case PREFIX_PATH + 'brood':
      case PREFIX_PATH + 'weight':
      case PREFIX_PATH + 'stack':
        return this.stackService.getColorByIndex(this.rucherService.rucheService.ruchesAllApiary.map(elt => elt._id).indexOf(hive._id), hive);
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
      case PREFIX_PATH + 'weight':
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
      case PREFIX_PATH + 'stack':
        //return this.stackService.
        break;
    }
  }

  showContextMenu(ruche: RucheInterface, evt: MouseEvent): void{
    evt.stopPropagation();
    evt.preventDefault();
    let menu = (<HTMLElement>document.getElementsByClassName('right-click-menu')[0]);
    menu.style.top = evt.clientY + 'px';
    menu.style.left = (evt.clientX-80) + 'px';
    menu.style.visibility = 'visible';

    let list = (<HTMLElement>menu.getElementsByClassName('context-menu-group')[0]);
    let name = (<HTMLElement>menu.getElementsByClassName('hive-name')[0]);
    let circle = (<HTMLElement>menu.getElementsByClassName('circle')[0]);
    circle.style.backgroundColor = this.getColor(ruche);
    name.innerHTML =  '  ' + ruche.name;

    this.new_event = {
      _id: null,
      inspId: null,
      date: null,
      apiaryId: null,
      hiveId: null,
      tasks: [],
      obs: [],
      notes: null,
      todo: null
    }

    this.hiveEvent = Object.assign({}, ruche);
    this.new_event.apiaryId = ruche.apiaryId;

    this.rucherService.findRucherById(ruche.apiaryId, (apiary) => {
      this.apiaryEvent = Object.assign({}, apiary);
    });

    let container = (<HTMLElement>document.getElementsByClassName('delete-event-list')[0]);
    container.innerHTML = '';
  }

  closeContextMenu(): void{
    (<HTMLElement>document.getElementsByClassName('right-click-menu')[0]).style.visibility = 'hidden';
  }

  // <--- ADD EVENT SCREEN --->

  showAddEvent(): void{
    this.new_event.hiveId = this.hiveEvent._id;
    this.new_event.apiaryId = this.hiveEvent.apiaryId;
    (<HTMLElement>document.getElementsByClassName('black-filter')[0]).style.display = 'block';
    (<HTMLElement>document.getElementsByClassName('add-event-screen')[0]).style.display = 'block';
    (<HTMLInputElement>document.getElementsByClassName('add-event-time-input')[0]).value = null;
    this.addObsList();
  }

  addObsList(): void{
    let obsDiv = (<HTMLElement>document.getElementsByClassName('add-event-choice-obs')[0]);
    obsDiv.innerHTML = '';
    let div;
    for(let i=0; i<PICTOS_HIVES_OBS.length; i++){
      if( i%6 === 0 ){
        div = document.createElement('div');
      }

      let button = document.createElement('button');
      button.className = 'hives-obs-add';

      button.classList.add(PICTOS_HIVES_OBS[i].class);
      button.onclick = (evt: Event) => {
        let n = i;
        this.hiveButton(evt, n);
      };

      div.appendChild(button);

      if( (i+1)%6 === 0 ){
        obsDiv.appendChild(div);
      }
    }
    if(PICTOS_HIVES_OBS.length%6 !== 0){ // Push last row if not complete
      obsDiv.appendChild(div);
    }
  }

  hiveButton(evt: Event, btnIndex: number): void{
    let button = (<HTMLButtonElement> evt.target);
    if( button.classList.contains(PICTOS_HIVES_OBS[btnIndex].class + '-active') ){
      button.classList.remove(PICTOS_HIVES_OBS[btnIndex].class + '-active');
      let i = this.new_event.obs.findIndex(e => e.name === PICTOS_HIVES_OBS[btnIndex].name);
      this.new_event.obs.splice(i, 1);
      return;
    }
    button.classList.add(PICTOS_HIVES_OBS[btnIndex].class + '-active');
    this.new_event.obs.push({name:PICTOS_HIVES_OBS[btnIndex].name, img:PICTOS_HIVES_OBS[btnIndex].img_active});
    return;
  }

  setNewEventDate(): void{
    (<HTMLInputElement>document.getElementsByClassName('add-event-time-input')[0]).value = moment(this.newEventDate).format(this.user_pref.timeFormat);
    this.new_event.date = this.newEventDate;
  }

  saveNotes(evt: Event): void{
    let textArea = <HTMLTextAreaElement>evt.target;
    this.new_event.notes = textArea.value;
  }

  saveTodo(evt: Event): void{
    let textArea = <HTMLTextAreaElement>evt.target;
    this.new_event.todo = textArea.value;
  }

  insertAddEvent(): void{
    if(this.new_event.date == null){
      (<HTMLElement>document.getElementsByClassName('add-event-time-error')[0]).style.display = 'flex';
      return;
    }
    (<HTMLElement>document.getElementsByClassName('add-event-time-error')[0]).style.display = 'none';
    (<HTMLElement>document.getElementsByClassName('black-filter')[0]).style.display = 'none';
    (<HTMLElement>document.getElementsByClassName('add-event-screen')[0]).style.display = 'none';
    this.inspHiveService.createNewInspHiveEvent(this.new_event).subscribe(
      () => {}, () => {}, () => {}
    );
    this.insertOnGraph();
    return;
  }

  discardAddEvent(): void{
    (<HTMLElement>document.getElementsByClassName('black-filter')[0]).style.display = 'none';
    (<HTMLElement>document.getElementsByClassName('add-event-screen')[0]).style.display = 'none';
  }

  insertOnGraph(): void{
    switch(this.router.url){
      case PREFIX_PATH + 'hive':
        break;
      case PREFIX_PATH + 'brood':
        this.broodComponent.insertNewEvent(this.new_event);
        break;
      case PREFIX_PATH + 'weight':
        break;
      case PREFIX_PATH + 'stack':
        break;
    }
  }

  // <--- END ADD EVENT SCREEN --->

  // <--- DELETE EVENT SCREEN --->

  showDeleteEvent(): void{
    this.hiveEventToDelete = [];
    (<HTMLElement>document.getElementsByClassName('black-filter')[0]).style.display = 'block';
    (<HTMLElement>document.getElementsByClassName('delete-event-screen')[0]).style.display = 'block';
    this.hiveEventList = [];
    this.inspHiveService.getInspHiveByHiveId(this.hiveEvent._id).subscribe(
      _hives_insp => {
        _hives_insp.forEach( insp => {
          if(insp.inspId == null){
            this.hiveEventList.push(insp);
          }
        })
      },
      () => {

      },
      () => {
        for(let i=0; i<this.hiveEventList.length; i++){
          this.hiveEventToDelete[i] = null;
        }
        this.showEventList();
      }
    );

  }

  showEventList(): void{
    let container = (<HTMLElement>document.getElementsByClassName('delete-event-list')[0]);
    container.innerHTML = '';
    this.hiveEventList.forEach( (evt,index) => {
      let divItem = document.createElement('div');
      divItem.className = 'delete-event-item-container';

      let div = document.createElement('div');
      div.className = 'delete-event-item';

      let div1 = document.createElement('div');
      div1.className = 'delete-event-item-logo';
      div1.style.width = '50px';
      div.appendChild(div1);


      let div2 = document.createElement('div');
      div2.style.width = '20%';
      div2.style.textAlign = 'center';
      let p1 = document.createElement('p');
      p1.textContent = this.unitService.getHourlyDate(new Date(evt.date));
      div2.appendChild(p1);
      div.appendChild(div2);

      let div3 = document.createElement('div');
      div3.style.width = '40%';
      div3.style.display = 'flex';
      div3.style.justifyContent = 'center';
      div3.style.alignItems = 'center';
      evt.obs.forEach((obs) => {
        let obsDiv = document.createElement('div');
        obsDiv.className = "hives-obs-delete hives-" + obs.name + "-img-active";
        div3.appendChild(obsDiv);
      });
      div.appendChild(div3);

      let div4 = document.createElement('div');
      div4.style.height = '50px';
      div4.style.display = 'flex';
      div4.style.justifyContent = 'center';
      div4.style.alignItems = 'center';
      let btnNotes = document.createElement('button');
      btnNotes.className = 'hives-notes-delete';
      btnNotes.onclick = (evt: Event) => { this.toggleNotes(evt) };
      div4.appendChild(btnNotes);
      div.appendChild(div4);

      let div5 = document.createElement('div');
      div5.style.height = '50px';
      div5.style.display = 'flex';
      div5.style.justifyContent = 'center';
      div5.style.alignItems = 'center';
      let btnTaches = document.createElement('button');
      btnTaches.className = 'hives-todo-delete';
      btnTaches.onclick = (evt: Event) => { this.toggleTodo(evt) };
      div5.appendChild(btnTaches);
      div.appendChild(div5);

      let div6 = document.createElement('div');
      div6.style.height = '50px';
      div6.style.display = 'flex';
      div6.style.justifyContent = 'center';
      div6.style.alignItems = 'center';
      let checkbox = document.createElement('input');
      checkbox.type ='checkbox';
      checkbox.onchange = (evt: Event) => {
        let n = index;
        this.deleteChange(evt, n);
      }

      div6.appendChild(checkbox);
      div.appendChild(div6);

      let divNotes = document.createElement('div');
      divNotes.style.display = 'flex';
      divNotes.style.justifyContent ='center';
      divNotes.style.alignItems ='center';
      let textNotes = document.createElement('textarea');
      textNotes.disabled = true;
      textNotes.spellcheck = false;
      textNotes.className = 'hives-todo-textarea-delete';
      textNotes.value = evt.notes;
      divNotes.appendChild(textNotes);

      let divTodo = document.createElement('div');
      divTodo.style.display = 'flex';
      divTodo.style.justifyContent ='center';
      divTodo.style.alignItems ='center';
      let textTodo = document.createElement('textarea');
      textTodo.disabled = true;
      textTodo.spellcheck = false;
      textTodo.className = 'hives-todo-textarea-delete';
      textTodo.value = evt.todo;
      divTodo.appendChild(textTodo);


      divItem.appendChild(div);
      divItem.appendChild(divNotes);
      divItem.appendChild(divTodo);

      container.appendChild(divItem);
    });
  }

  toggleNotes(evt: Event): void{
    let button = (<HTMLButtonElement> evt.target);
    let textArea = button.parentNode.parentNode.parentNode.children[1].children[0];
    if(textArea.classList.contains('hives-note-textarea-delete-active')){
      textArea.classList.add('hives-note-textarea-delete-inactive');
      setTimeout(()=> {
        textArea.classList.remove('hives-note-textarea-delete-inactive');
        textArea.classList.remove('hives-note-textarea-delete-active');
      }, 400);
    }
    else{
      textArea.classList.add('hives-note-textarea-delete-active');
    }

  }

  toggleTodo(evt: Event): void{
    let button = (<HTMLButtonElement> evt.target);
    let textArea = button.parentNode.parentNode.parentNode.children[2].children[0];
    if(textArea.classList.contains('hives-todo-textarea-delete-active')){
      textArea.classList.add('hives-todo-textarea-delete-inactive');
      setTimeout(()=> {
        textArea.classList.remove('hives-todo-textarea-delete-inactive');
        textArea.classList.remove('hives-todo-textarea-delete-active');
      }, 400);
    }
    else{
      textArea.classList.add('hives-todo-textarea-delete-active');
    }
  }

  deleteChange(evt: Event, index: number): void{
    let checkbox = (<HTMLInputElement>evt.target);
    if(checkbox.checked){
      this.hiveEventToDelete[index] = Object.assign({},this.hiveEventList[index]);
    }
    else{
      this.hiveEventToDelete[index] = null;
    }
  }

  deleteDeleteEvent(): void{
    let arrayId: string[] = [];
    let inspArray: InspHive[] = [];
    this.hiveEventToDelete.forEach(e => {
      if(e != null){
        arrayId.push(e._id);
        inspArray.push(e);
      }
    });
    this.inspHiveService.deleteInspHiveEvent(arrayId).subscribe(
      () => {}, () => {}, () => {
        this.deleteOnGraph(arrayId, inspArray);
      }
    );
    (<HTMLElement>document.getElementsByClassName('black-filter')[0]).style.display = 'none';
    (<HTMLElement>document.getElementsByClassName('delete-event-screen')[0]).style.display = 'none';
  }

  discardDeleteEvent(): void{
    (<HTMLElement>document.getElementsByClassName('black-filter')[0]).style.display = 'none';
    (<HTMLElement>document.getElementsByClassName('delete-event-screen')[0]).style.display = 'none';
  }

  deleteOnGraph(arrayId: string[], inspArray: InspHive[]): void{
    switch(this.router.url){
      case PREFIX_PATH + 'hive':
        break;
      case PREFIX_PATH + 'brood':
        this.broodComponent.deleteEvents(arrayId, inspArray);
        break;
      case PREFIX_PATH + 'weight':
        break;
      case PREFIX_PATH + 'stack':
        break;
    }
  }

  // <--- END DELETE EVENT SCREEN --->

  // <--- FILTERS BEHAVIOUR --->

  filterMenu(e: Event){
    e.stopPropagation();
  }

  filterButton(evt: Event){
    let button = (<HTMLInputElement>evt.target);
    if(button.className.includes('-active')){
      button.className = button.className.slice(0, -7);
      return;
    }
    button.className = button.className + '-active';
    return;

  }

}
