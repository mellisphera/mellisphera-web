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

import { User } from '../../_model/user';
import { Component, OnInit, OnDestroy, AfterViewChecked, HostListener, Renderer2, ViewChild, ViewChildren, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { UserloggedService } from '../../userlogged.service';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { RucherService } from '../service/api/rucher.service';
import { Ruche } from './ruche';
import { DailyRecordService } from '../service/api/dailyRecordService';
import { RucheService } from '../service/api/ruche.service';
import { RucheInterface } from '../../_model/ruche';
import { Route, Router } from '@angular/router';
import { CONFIG } from '../../../constants/config';
import { AuthService } from '../../auth/Service/auth.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { Position } from 'angular2-draggable';
import { UnitService } from '../service/unit.service';
import { UserParamsService } from '../preference-config/service/user-params.service';
import { DailyRecordsWService } from '../service/api/daily-records-w.service';
import { CapteurService } from '../service/api/capteur.service';
import { AlertsService } from '../service/api/alerts.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { InfoHivesComponent } from './info-hives/info-hives.component';
import { InfoApiaryComponent } from './info-apiary/info-apiary.component';
import { GraphGlobal } from '../graph-echarts/GlobalGraph';
import { MyDate } from '../../class/MyDate';
import { AlertInterface } from '../../_model/alert';
import { TranslateService } from '@ngx-translate/core';
import { MyNotifierService } from '../service/my-notifier.service';
import { NotifList } from '../../../constants/notify';
import { AdminService } from '../admin/service/admin.service';
import { AtokenStorageService } from '../../auth/Service/atoken-storage.service';
import { FitnessService } from '../service/api/fitness.service';
import { DeviceStatusService } from '../service/api/device-status.service';
import { DeviceStatus } from '../../_model/device-status';
import { CapteurInterface } from '../../_model/capteur';
import { HubService } from '../service/api/hub.service';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { isUndefined } from 'util';
import { InspectionService } from '../service/api/inspection.service';
import { RucherModel } from '../../_model/rucher-model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  @Output() apiaryChange = new EventEmitter<string>();
  private eltOnClickClass: HTMLCollectionOf<Element>;
  private eltOnClickId: EventTarget;
  infoRuche: any = null;
  dragPhotoApiary: File;
  public optionCsv: Object;
  selectPhotoApiary: File;
  photoBase64: string;
  username: string;
  rucheSelect: RucheInterface;
  positionHive: any;
  baseDropValid: string;
  boolDraggable: boolean;
  rucherSelectId: string;
  firstValue: boolean;
  translateX: number;
  translateY: number;
  private hiveUpdateForDestroyPage: Array<RucheInterface>;
  message: string;
  style: {
    'background-image': string,
    'background-position': string,
    'background-repeat': string
  };
  position: {
    'x': number,
    'y': number
  };

  rucheOnClick: Ruche;
  public loadingStockHoney: boolean;
  public lockHive: boolean;
  newRucheForm: FormGroup;
  private notify: NotifierService;
  private selectHive: RucheInterface;
  private hiveIndex: number;
  private infoHiveComponent: InfoHivesComponent;
  private infoApiaryComponent: InfoApiaryComponent;
  screenHeight: any;
  public apiaryAlertsActives: AlertInterface[];
  // Hive alerts by apiay
  public hiveAlertsByApiary: AlertInterface[];
  screenWidth: any;
  lastHighlightFix: string;
  lastHighlightHandle: string;
  location: Location;

  constructor(location: Location,
      public dailyRecTh: DailyRecordService,
      public userService: UserloggedService,
      private translateService: TranslateService,
      private notifyService: NotifierService,
      private formBuilder: FormBuilder,
      public login: UserloggedService,
      public graphGlobal: GraphGlobal,
      public rucheService: RucheService,
      public rucherService: RucherService,
      public dailyRecordWservice: DailyRecordsWService,
      public router: Router,
      private unitService: UnitService,
      public authService: AuthService,
      public fitnessService: FitnessService,
      public tokenService: AtokenStorageService,
      public capteurService: CapteurService,
      public adminService: AdminService,
      private userConfig: UserParamsService,
      private myNotifier: MyNotifierService,
      private renderer: Renderer2,
      public hubService: HubService,
      public deviceSatusService: DeviceStatusService,
      public alertsService: AlertsService,
      public inspService: InspectionService,
      private dailyWService: DailyRecordsWService,
      private dailyRecordService: DailyRecordService,) {
    this.location = location;
    this.notify = notifyService;
    this.eltOnClickClass = null;
    this.lockHive = true;
    this.eltOnClickId = null;
    this.username = this.login.getUser();
    this.dragPhotoApiary = null;
    this.message = '';
    this.lastHighlightFix = 'dontExist';
    this.lastHighlightHandle = 'dontExist';
    this.hiveUpdateForDestroyPage = [];
    this.style = {
      'background-image': 'url(' + CONFIG.URL_FRONT + 'assets/imageClient/testAccount.png)',
      'background-position': 'center',
      'background-repeat': 'no-repeat'
    };
    this.position = {
      x: 0,
      y: 0
    };
    this.optionCsv = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Your title',
      useBom: true,
      noDownload: false,
      headers: ['APIARY','HIVE', 'BROOD', 'WEIGHT', 'BATTERY', 'SENSORS', 'LAST ANNOTATED INSPECTION'],
      nullToEmptyString: false,
    };

    this.selectHive = {
      _id: '',
      name: '',
      description: '',
      userId: '',
      username: '',
      apiaryId: '',
      dataLastReceived: null,
      hidden: false,
      createDate: null,
      apiaryName: '',
      hivePosX: '',
      hivePosY: '',
      color: null,
      sharingUser: []
    };

    this.inspService.getInspectionByUserId(this.userService.getIdUserLoged());


    this.boolDraggable = true;
    this.firstValue = true;
    this.getScreenSize();
  }

  receiveMessage($event) {
    this.message = $event;

  }

  checkSensor(sensorRef: string): string{
    let deviceStatus: DeviceStatus = this.deviceSatusService.getDeviceStatusBySensorRef(sensorRef)[0];
    try {
      return deviceStatus.color;
    } catch {
      return '#4F4F51';
    }
  }

  exportToCsv(): void {
    this.optionCsv['title'] = `Export Mellisphera ${this.unitService.getDailyDate(new Date())}`
      const data = this.rucheService.ruchesAllApiary.map(_hive => {
        let noteLengh =  this.inspService.inspectionsHive.filter(_insp => _insp.hiveId === _hive._id).length;
        let lastNote = this.inspService.inspectionsHive.filter(_insp => _insp.hiveId === _hive._id)[noteLengh - 1];
        if(this.rucherService.allApiaryAccount.filter(_apiary => _apiary._id === _hive.apiaryId)[0] !== undefined){
          const apiary_name = this.rucherService.allApiaryAccount.filter(_apiary => _apiary._id === _hive.apiaryId)[0].name;
          return {
            APIARY: apiary_name,
            HIVE: _hive.name,
            BROOD: this.dailyRecTh.getPourcentByHive(_hive._id),
            WEIGHT: this.graphGlobal.getStringWeightFormat(this.dailyRecordWservice.getDailyWeightByHive(_hive._id)),
            BATTERY: this.capteurService.getCapteursByHive(_hive._id).sort((a: CapteurInterface, b:CapteurInterface) => a.sensorRef.localeCompare(b.sensorRef)).map(_elt => _elt.sensorBat + '%').join('\n'),
            SENSORS: this.capteurService.getCapteursByHive(_hive._id).map(_elt => _elt.sensorRef).sort((a: string, b:string) => a.localeCompare(b)).join('\n'),
            NOTE: !isUndefined(lastNote) ? this.unitService.getDailyDate(lastNote.opsDate) + ' - ' + lastNote.description: '-'
          }
        }
      }).sort((a, b) => a.APIARY.localeCompare(b.APIARY) || a.HIVE.localeCompare(b.HIVE));
      console.log(data);
      new Angular5Csv(data,  `Export Mellisphera ${this.unitService.getDailyDate(new Date())}`, this.optionCsv);
  }

  /**
   *
   *
   * @returns {string}
   * @memberof HomeComponent
   */
  getDateDaily(): string {
    let showDate = new Date(MyDate.thisDay);
    //showDate.setFullYear(MyDate.thisDay.getFullYear());
    //showDate.setMonth(MyDate.thisDay.getMonth());
    //showDate.setDate(MyDate.thisDay.getDate() - 1);
    return this.unitService.getDailyDate(showDate.toISOString());
  }
  closePopup(): void {
    this.userService.setFristConnection(false);
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    this.dailyRecTh.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
    this.dailyRecordWservice.getDailyWeightMaxByApiary(this.rucherService.getCurrentApiary());
    this.loadAlert();
    MyDate.init();
    this.rucherService.getApiaryByUser(this.userService.getIdUserLoged());

    if (!this.rucheService.getCurrentHive()) {
      this.rucheService.saveCurrentHive();
    }


    // Use the user configuration
    this.userConfig.getSubject().subscribe(
      data => {
        this.dailyRecTh.setUnitSystem(data.unitSystem);
        this.dailyRecordWservice.setUnitSystem(data.unitSystem);
      }
    );

    this.initForm();
  }

  ngAfterViewInit(): void {
   this.rucheService.ruches.forEach(_hive => {
      document.getElementById(_hive.name).style.transform = 'translate(0px, 0px)';
    });
  }
  onDragEnd(event) {
    console.log(event);
  }

  ngAfterViewChecked(): void {
/*     const elt = document.getElementById('cadre');
    const img = document.getElementById('apiary-photos');
    let height = img.clientHeight;
    let width = img.clientHeight;
    elt.style.height = height * 3/4 + 'px'; */
  }


  changePicturePhotos(base64: string): void {
    this.rucherService.rucher.photo = base64;
    this.rucherService.updateBackgroundApiary(this.rucherService.rucher._id);
    this.selectPhotoApiary = null;
  }

  loadAlert() {
    this.alertsService.getHiveAlertByApiaryId(this.rucherService.getCurrentApiary(),
      MyDate.getRangeForCalendarAlerts()[0].getTime(), MyDate.getRangeForCalendarAlerts()[1].getTime()).subscribe(
        _alerts => {
          this.hiveAlertsByApiary = _alerts.filter(_alert => _alert.check === false);
        }
      );
    this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary(), MyDate.getRangeForCalendarAlerts()).subscribe(
      _notif => {
        this.apiaryAlertsActives = _notif.filter(_notif => !_notif.check);
      }
    )
  }

  numberAlertsActivesByHive(hiveId: string): number | any {
    if (this.hiveAlertsByApiary !== undefined) {
      return this.hiveAlertsByApiary.filter(alert => alert.hiveId === hiveId).length;
    } else {
      return null;
    }
  }

  numberActiveNotifByApiary(): number {
    if (this.apiaryAlertsActives !== undefined) {
      return this.apiaryAlertsActives.length;
    } else {
      return null;
    }
  }

  getApiaryHelp(text: string[]) {
    return text.join('<br/>');
  }

  onClickNextDay() {
    let end =  new Date(MyDate.end)
    end.setDate( end.getDate() - 1 );
    end.setHours(0);
    end.setMinutes(0);
    if(MyDate.thisDay < new Date(end)){
      MyDate.thisDay.setDate(MyDate.thisDay.getDate() + 1);
      this.fitnessService.nextDay(this.userService.getIdUserLoged());
      this.dailyRecTh.nextDay(this.rucherService.getCurrentApiary());
      this.dailyRecordWservice.nextDay(this.rucherService.getCurrentApiary());
      this.deviceSatusService.nextDay(this.userService.getIdUserLoged());
      this.updateCalendars();
    }

  }

  onClickPreviousDay() {
    let d1 = new Date()
    d1.setDate( d1.getDate() - 24 );
    d1 = MyDate.getDateBeginMonday(d1);
    if(MyDate.thisDay > d1){
      MyDate.thisDay.setDate(MyDate.thisDay.getDate() - 1);
      this.fitnessService.previousDay(this.userService.getIdUserLoged());
      this.dailyRecTh.previousDay(this.rucherService.getCurrentApiary());
    this.dailyRecordWservice.previousDay(this.rucherService.getCurrentApiary());
      this.deviceSatusService.previousDay(this.userService.getIdUserLoged());
      this.updateCalendars();
    }

  }

  updateCalendars(){
    switch(this.router.url){
      case '/dashboard/home/info-apiary':
        this.infoApiaryComponent.alertsComponent.initCalendar();
        break;
      case '/dashboard/home/info-hives':
        this.infoHiveComponent.alertsHiveComponent.initCalendar();
        this.infoHiveComponent.loadHealthCalendar();
        this.infoHiveComponent.loadProductivityCalendar();
        break;
    }
  }

  //   checkHiveActive(): Promise<Boolean> {
  //     return new Promise((resolve, reject) => {
  //         if (this.dailyStockHoneyService.currenthiveId !== this.rucheService.getCurrentHive().id) {
  //             resolve(true);
  //         } else {
  //             reject(false);
  //         }
  //     });
  // }


  isActiveHive(hive: RucheInterface): boolean {
    return hive._id === this.rucheService.getCurrentHive()._id;
  }

  checkHiveIsActive(hiveId: string): string {
    try{
      return this.rucheService.getCurrentHive()._id === hiveId ? 'highlightFix' : '';
    }
    catch {}
  }

  onPastilleClick(hive: RucheInterface) {
    if (this.lockHive) {
      this.onClick(hive);
    }
  }

  onClick(ruche: RucheInterface) {
    // Save the hive on dataBase
    this.rucheService.saveCurrentHive(ruche);
    this.inspService.inspHive = this.inspService.getInspectionCurrentHive(ruche._id)

    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      if (this.hiveAlertsByApiary.filter(_notif => _notif.hiveId === ruche._id).length > 0) {
        this.alertsService.checkAlert(this.hiveAlertsByApiary.filter(_notif => _notif.hiveId === ruche._id)).subscribe(
          _res => {
            //this.myNotifier.sendSuccessNotif(NotifList.READ_ALL_ALERTS_HIVE);
            this.hiveAlertsByApiary = this.hiveAlertsByApiary.filter(_notif => _notif.hiveId !== ruche._id).slice();
          }
        );
      }
    }

    // Use the user configuration
    this.userConfig.getSubject().subscribe(
      data => {
        this.dailyRecTh.setUnitSystem(data.unitSystem);
        this.dailyRecordWservice.setUnitSystem(data.unitSystem);
      }
    )

    // For the hive alerts
    this.checkIfInfoHiveComponent().then(status => {
      this.infoHiveComponent.loadHealthCalendar();
      this.infoHiveComponent.loadProductivityCalendar();
      this.infoHiveComponent.alertsHiveComponent.initCalendar();
      if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
        this.infoHiveComponent.alertsHiveComponent.readAllHiveAlerts();
      }
    }).catch(err => {
      console.log(err);
    });

    // For the hive notes

    //this.observationService.getNoteByUserId(this.userService.getIdUserLoged());

    //For the hive-weight
    this.dailyRecordWservice.getDailyRecordsWbyhiveId(ruche._id);

    //For the hive-health

    //For hive sensors
/*     this.rucherService.rucheService.getHiveByUserId(this.userService.getUser()).subscribe(ruches => {
      this.rucherService.rucheService.ruchesAllApiary = ruches;
    }); */

    // Call info-hives app
    this.router.navigateByUrl('dashboard/home/info-hives');
    if (this.screenWidth < 991) {
      let el = document.getElementById('scroll');
      el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }

  }

  onclickInfoApiary() {
    this.rucheService.saveCurrentHive({});
    if (this.apiaryAlertsActives.filter(_notif => _notif.apiaryId === this.rucherService.getCurrentApiary()).length > 0) {
      this.alertsService.checkAlert(this.apiaryAlertsActives.filter(_notif => _notif.apiaryId === this.rucherService.getCurrentApiary())).subscribe(
        _res => {
          //this.myNotifier.sendSuccessNotif(NotifList.READ_ALL_ALERTS_HIVE);
          this.apiaryAlertsActives = this.apiaryAlertsActives.filter(_notif => _notif.apiaryId !== this.rucherService.getCurrentApiary()).slice();
        }
      );
    }
    this.router.navigateByUrl('dashboard/home/info-apiary');
    if (this.screenWidth < 991) {
      let el = document.getElementById('scroll');
      el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }

  }


  /**
   *
   *
   * @param {*} event
   * @param {RucheInterface} ruche
   * @memberof HomeComponent
   */
  onMoveEnd(event, ruche: RucheInterface, id: number): void {
    if (this.login.checkWriteObject(ruche.userId)) {
      const container = document.getElementById("cadre");
      const widthcontainer = container.offsetWidth;
      const heightcontainer = container.offsetHeight;
      const xHivePx = this.getPositionPxToPourcent(parseInt(ruche.hivePosX, 10), widthcontainer);
      const yHivePx = this.getPositionPxToPourcent(parseInt(ruche.hivePosY, 10), heightcontainer);
      this.position.x = this.getPourcentToPx(xHivePx + event.x, widthcontainer);
      this.position.y = this.getPourcentToPx(yHivePx + event.y, heightcontainer);
      if (this.position.y < 0) {
        this.position.y = 0;
      } else if (this.position.x < 0) {
        this.position.x = 0;
      }
      const rucheUpdate = JSON.parse(JSON.stringify(ruche));
      rucheUpdate.hivePosX = '' + this.position.x;
      rucheUpdate.hivePosY = '' + this.position.y;
      this.rucheService.updateCoordonneesRuche(rucheUpdate).subscribe(
        () => { }, () => { }, () => {
          this.position.x = 0;
          this.position.y = 0;
          const index = this.hiveUpdateForDestroyPage.findIndex(_hive => _hive._id === rucheUpdate._id);
          if (index !== -1) {
            this.hiveUpdateForDestroyPage[index] = rucheUpdate;
          } else {
            this.hiveUpdateForDestroyPage.push(rucheUpdate);
          }
        }
      );
    }
  }
  ngOnDestroy(): void {
        this.hiveUpdateForDestroyPage.forEach((hiveUpdate: RucheInterface) => {
          const hiveUpdateIndex = this.rucheService.ruchesAllApiary.map(hive => hive._id).indexOf(hiveUpdate._id);
          this.rucheService.ruchesAllApiary[hiveUpdateIndex].hivePosX = hiveUpdate.hivePosX;
          this.rucheService.ruchesAllApiary[hiveUpdateIndex].hivePosY = hiveUpdate.hivePosY;
        });
  }

  onMoving(event, id: string) {
    console.log(id);
    // document.getElementById(id).style.transform = 'translate(0,0)' ;
  }

  /**
   *
   *
   * @param {number} value
   * @param {number} total
   * @returns {number}
   * @memberof HomeComponent
   */
  getPositionPxToPourcent(value: number, total: number): number {
    return (value * total) / 100;
  }

  /**
   *
   *
   * @param {number} valuePx
   * @param {number} total
   * @returns {number}
   * @memberof HomeComponent
   */
  getPourcentToPx(valuePx: number, total: number): number {
    return (valuePx / total) * 100;

  }
  /**
   *
   *
   * @memberof HomeComponent
   */
  saveBackground(): void {
    this.rucherService.updateBackgroundApiary(this.rucherService.rucher._id);
    this.dragPhotoApiary = null;
  }

  /**
   *
   *
   * @memberof HomeComponent
   */
  cancelBackground(): void {
    this.rucherService.rucher.photo = this.rucherService.currentBackground;
    this.dragPhotoApiary = null;
  }
  onMouseover($ruche) {
    const ruche = JSON.parse(JSON.stringify($ruche))
    this.infoRuche = ruche.name + ' : ' + ruche.description;
  }


  collapseAllActiveButton(idButtonActive: string) {
    let class1 = (idButtonActive=='sensorsNav' ? 'weight' : 'sensors');
    let class2 = (idButtonActive=='nameNav' ? 'weight' : 'name');
    let class3 = (idButtonActive=='broodNav' ? 'weight' : 'brood');
    // Desactive the three collapses div that we don't want
    this.eltOnClickClass = document.getElementsByClassName(class1);
    for (let i = 0; i < this.eltOnClickClass.length; i++) {
      this.eltOnClickClass[i].classList.remove('in');
    }
    this.eltOnClickClass = document.getElementsByClassName(class2);
    for (let i = 0; i < this.eltOnClickClass.length; i++) {
      this.eltOnClickClass[i].classList.remove('in');
    }
    this.eltOnClickClass = document.getElementsByClassName(class3);
    for (let i = 0; i < this.eltOnClickClass.length; i++) {
      this.eltOnClickClass[i].classList.remove('in');
    }
  }

  clickName() {
    // Desactive the three collapses div that we don't want
    this.eltOnClickClass = document.getElementsByClassName('brood');
    for (let i = 0; i < this.eltOnClickClass.length; i++) {
      this.eltOnClickClass[i].classList.remove('in');
    }
    this.eltOnClickClass = document.getElementsByClassName('weight');
    for (let i = 0; i < this.eltOnClickClass.length; i++) {
      this.eltOnClickClass[i].classList.remove('in');
    }
    this.eltOnClickClass = document.getElementsByClassName('sensors');
    for (let i = 0; i < this.eltOnClickClass.length; i++) {
      this.eltOnClickClass[i].classList.remove('in');
    }

    // Active the button clicked
    this.eltOnClickId = document.getElementById('name');
    this.renderer.addClass(this.eltOnClickId, 'active');

    // desactive the other buttons
    this.eltOnClickId = document.getElementById('brood');
    this.renderer.removeClass(this.eltOnClickId, 'active');
    this.eltOnClickId = document.getElementById('weight');
    this.renderer.removeClass(this.eltOnClickId, 'active');
    this.eltOnClickId = document.getElementById('sensors');
    this.renderer.removeClass(this.eltOnClickId, 'active');

    // open the collapse div for name
    this.eltOnClickClass = document.getElementsByClassName('name');
    for (let i = 0; i < this.eltOnClickClass.length; i++) {
      this.eltOnClickClass[i].classList.add('in');
    }
  }

  // Show the right click menu
  onRightClick(event, i: number) {
    let id: string;
    id = String(i);
    // Hide all right click menu
    this.eltOnClickClass = document.getElementsByClassName('affiche');
    for (let i = 0; i < this.eltOnClickClass.length; i++) {
      this.eltOnClickClass[i].classList.remove('affiche');
    }

    this.eltOnClickClass = document.getElementsByClassName('affiche');
    for (let i = 0; i < this.eltOnClickClass.length; i++) {
      this.eltOnClickClass[i].classList.remove('affiche');
    }

    // Show the right click menu
    this.eltOnClickClass = document.getElementsByClassName(id);
    for (let i = 0; i < this.eltOnClickClass.length; i++) {
      this.eltOnClickClass[i].classList.add('affiche');
    }
    // document.getElementById(id).style.display = 'block';
    return (false);
  }

  // Hide right click menu when you click on the picture
  hideRightClick(event) {
    this.eltOnClickClass = document.getElementsByClassName('affiche');
    for (let i = 0; i < this.eltOnClickClass.length; i++) {
      this.eltOnClickClass[i].classList.remove('affiche');
    }

    this.eltOnClickClass = document.getElementsByClassName('affiche');
    for (let i = 0; i < this.eltOnClickClass.length; i++) {
      this.eltOnClickClass[i].classList.remove('affiche');
    }
  }

  //Pour effacer une ruche
  deleteRuche(ruche: RucheInterface, index: number) {
    this.rucheService.deleteRuche(ruche).subscribe(() => { }, () => { }, () => {
      this.rucheService.ruches.splice(index, 1);
      if (this.translateService.currentLang === 'fr') {
        this.notify.notify('success', 'Ruche supprimée');
      } else {
        this.notify.notify('success', 'Deleted Hive');
      }
    });
  }

  onSelectRuche(ruche: RucheInterface, index: number) {
    this.hiveIndex = index;
    this.rucherService.rucherSelectUpdate = this.rucherService.rucher;
    this.selectHive = ruche;
    const donnée = {
      nomRuche: this.selectHive.name,
      descriptionRuche: this.selectHive.description,
    };
    this.newRucheForm.setValue(donnée);
  }
  // pour editer une ruche
  onEditeRuche() {
    const formValue = this.newRucheForm.value;
    this.selectHive.apiaryId = this.rucherService.rucherSelectUpdate._id;
    this.selectHive.name = formValue.nomRuche;
    this.selectHive.description = formValue.descriptionRuche;
    this.rucheService.updateRuche(this.selectHive).subscribe(() => { }, () => { }, () => {
      if (this.selectHive.apiaryId === this.rucherService.getCurrentApiary()) {
        this.rucheService.ruches[this.hiveIndex] = this.selectHive;
      } else {
        this.rucheService.ruches.splice(this.hiveIndex, 1);
      }
      if (this.translateService.currentLang === 'fr') {
        this.notify.notify('success', 'Ruche mis à jour');
      } else {
        this.notify.notify('success', 'Updated Hive');
      }
    });
  }

  initForm() {
    this.newRucheForm = this.formBuilder.group({
      'nomRuche': [null, Validators.compose([Validators.required])],
      'descriptionRuche': [null],
    });
  }


  setRouterPage(event) {
    if (event instanceof InfoHivesComponent) {
      this.infoHiveComponent = event;
    }
    if (event instanceof InfoApiaryComponent) {
      this.infoApiaryComponent = event;
    }
  }

  checkIfInfoHiveComponent(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      if (this.infoHiveComponent instanceof InfoHivesComponent) {
        resolve(true);
      } else {
        reject(false);
      }
    })
  }

  checkIfInfoApiaryComponent(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      if (this.infoApiaryComponent instanceof InfoApiaryComponent) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  }


  // Sort a sensors list in increasing sort
  increasingSort(sensorsList: CapteurInterface[]): CapteurInterface[] {
    console.log(sensorsList);
    sensorsList.sort((a, b) => {
      if (a.sensorRef < b.sensorRef) {
        return -1;
      } else {
        return 1;
      }
    });
    return sensorsList;
  }

  onLockHive() {
    this.lockHive = true;
  }

  changeLockHive(){
    this.lockHive = !this.lockHive;
    if(this.lockHive){
      (<HTMLButtonElement>document.getElementById("locked")).innerHTML = '<i class="fa fa-lock" style="font-size:26px;margin-right:5px;"></i>';
      (<HTMLButtonElement>document.getElementById("locked")).title = this.translateService.instant('HOME.PLACEMENTMODE');
    }
    else{
      (<HTMLButtonElement>document.getElementById("locked")).innerHTML = '<i class="fa fa-unlock" style="font-size:26px;margin-right:5px;"></i>';
      (<HTMLButtonElement>document.getElementById("locked")).title = this.translateService.instant('HOME.CLICKMODE');
    }

  }

  onSelectRucher(apiary: RucherModel) {
    this.rucherService.rucher = apiary;
    this.rucherService.saveCurrentApiaryId(apiary._id);
    this.dailyWService.getDailyWeightMaxByApiary(apiary._id);
    // this.observationService.getObservationByapiaryId(this.rucherService.getCurrentApiary());
    //this.rucheService.loadHiveByApiary(this.rucherService.getCurrentApiary());
    this.rucheService.saveCurrentHive({});
    this.inspService.getInspectionByUserId(this.userService.getIdUserLoged());
    this.rucheService.loadHiveByApiary(this.rucherService.getCurrentApiary());
    this.apiaryChange.emit(this.rucherService.getCurrentApiary());
    this.dailyRecordService.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
    this.dailyRecordService.getRecThByApiaryByDateD3D7(this.rucherService.getCurrentApiary(), (new Date()));
    this.inspService.getInspectionByUserId(this.userService.getIdUserLoged());
    if(this.router.url == '/dashboard/home/info-apiary'){
      this.infoApiaryComponent.alertsComponent.initCalendar();
    } else {
      this.router.navigate(['dashboard/home/info-apiary']);
    }
  }

  checkApiaryIfActive(apiaryId: string): string{
    if(this.rucherService.rucher._id == apiaryId){
      return 'apiary-active';
    }
    return '';
  }

  getColorApiary(apiaryId: string): string{
    if(this.rucherService.rucher._id == apiaryId){
      return 'rgb(50,160,210)';
    }
    else{
      return 'white';
    }
  }
}
