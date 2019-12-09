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
import { Component, OnInit, OnDestroy, AfterViewChecked, HostListener, Renderer2, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { UserloggedService } from '../../userlogged.service';
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
import { ObservationService } from '../service/api/observation.service';
import { UserParamsService } from '../preference-config/service/user-params.service';
import { DailyRecordsWService } from '../service/api/daily-records-w.service';
import { DailyStockHoneyService } from '../service/api/daily-stock-honey.service';
import { CapteurService } from '../service/api/capteur.service';
import { AlertsService } from '../service/api/alerts.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { stringify } from '@angular/core/src/render3/util';
import { InfoHivesComponent } from './info-hives/info-hives.component';
import { InfoApiaryComponent } from './info-apiary/info-apiary.component';
import { AlertsHiveComponent } from './info-hives/alerts-hive/alerts-hive.component';
import { AlertsComponent } from './info-apiary/alerts/alerts.component';
import { GraphGlobal } from '../graph-echarts/GlobalGraph';
import { MyDate } from '../../class/MyDate';
import { AlertInterface } from '../../_model/alert';
import { TranslateService } from '@ngx-translate/core';
import { MyNotifierService } from '../service/my-notifier.service';
import { NotifList } from '../../../constants/notify';
import { AdminService } from '../admin/service/admin.service';
import { AtokenStorageService } from '../../auth/Service/atoken-storage.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  private eltOnClickClass: HTMLCollectionOf<Element>;
  private eltOnClickId: EventTarget;
  infoRuche: any = null;
  photoApiary: File;
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
  private infoHiveComponent: any;
  private infoApiaryComponent: any;
  screenHeight: any;
  public apiaryAlertsActives: AlertInterface[];
  // Hive alerts by apiay
  public hiveAlertsByApiary: AlertInterface[];
  screenWidth: any;
  lastHighlightFix: string;
  lastHighlightHandle: string;

  constructor(public dailyRecTh: DailyRecordService,
    private userService: UserloggedService,
    private translateService: TranslateService,
    private notifyService: NotifierService,
    private formBuilder: FormBuilder,
    public login: UserloggedService,
    public graphGlobal: GraphGlobal,
    public rucheService: RucheService,
    private observationService: ObservationService,
    public rucherService: RucherService,
    public dailyRecordWservice: DailyRecordsWService,
    public router: Router,
    private unitService: UnitService,
    public authService: AuthService,
    public tokenService: AtokenStorageService,
    public capteurService: CapteurService,
    public adminService: AdminService,
    private userConfig: UserParamsService,
    private myNotifier: MyNotifierService,
    public dailyStockHoneyService: DailyStockHoneyService,
    private renderer: Renderer2,
    public alertsService: AlertsService) {

    this.notify = notifyService;
    this.eltOnClickClass = null;
    this.lockHive = true;
    this.eltOnClickId = null;
    this.username = this.login.getUser();
    this.photoApiary = null;
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
      sharingUser: []
    };

    this.observationService.getNoteByUserId(this.userService.getIdUserLoged());

    this.boolDraggable = true;
    this.firstValue = true;
    this.getScreenSize();
  }

  receiveMessage($event) {
    this.message = $event;

  }
  /**
   *
   *
   * @returns {string}
   * @memberof HomeComponent
   */
  getDateDaily(): string {
    let showDate = new Date();
    showDate.setFullYear(this.dailyRecTh.rangeDailyRecord.getFullYear());
    showDate.setMonth(this.dailyRecTh.rangeDailyRecord.getMonth());
    showDate.setDate(this.dailyRecTh.rangeDailyRecord.getDate() + 1);
    return this.unitService.getDailyDate(showDate.toISOString());
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    if (!this.rucherService.rucherSubject.closed) {
      this.rucherService.rucherSubject.subscribe(() => { }, () => { }, () => {
        this.dailyRecTh.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
        this.dailyRecordWservice.getDailyWeightMaxByApiary(this.rucherService.getCurrentApiary());
        this.loadAlert();
        //this.alertsService.getAllHiveAlertsByApiary(this.rucherService.getCurrentApiary());
      });
    }

    if (!this.rucheService.getCurrentHive()) {
      this.rucheService.saveCurrentHive();
      this.capteurService.getUserCapteurs();
    } else {
      this.capteurService.getUserCapteurs();
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

  onClickNextDay() {
    this.dailyRecTh.nextDay(this.rucherService.getCurrentApiary());
    this.dailyRecordWservice.nextDay(this.rucherService.getCurrentApiary());
  }

  onClickPreviousDay() {
    this.dailyRecTh.previousDay(this.rucherService.getCurrentApiary());
    this.dailyRecordWservice.previousDay(this.rucherService.getCurrentApiary());
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
    // active button name
    // this.clickName();
    // Desactive alerts buttons
    this.eltOnClickId = document.getElementById('infoApiaryButton');
    this.renderer.removeClass(this.eltOnClickId, 'active0');

    // remove higlight for last highlighted hive


    // Save the hive on dataBase
    this.rucheService.saveCurrentHive(ruche);

    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      if (this.hiveAlertsByApiary.filter(_notif => _notif.hiveId === ruche._id).length > 0) {
        this.alertsService.checkAlert(this.hiveAlertsByApiary.filter(_notif => _notif.hiveId === ruche._id)).subscribe(
          _res => {
            this.myNotifier.sendSuccessNotif(NotifList.READ_ALL_ALERTS_HIVE);
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
      this.infoHiveComponent.alertsHiveComponent.initCalendar(ruche);
      if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
        this.infoHiveComponent.alertsHiveComponent.readAllHiveAlerts(ruche);
      }
    }).catch(err => {
      console.log(err);
    });

    // For the hive notes

    //this.observationService.getNoteByUserId(this.userService.getIdUserLoged());

    //For the hive-weight
    this.dailyRecordWservice.getDailyRecordsWbyhiveId(ruche._id);

    //For the hive-health
    this.dailyRecTh.getByhiveId(ruche._id);

    //For hive sensors
/*     this.rucherService.rucheService.getHiveByUserId(this.userService.getUser()).subscribe(ruches => {
      this.rucherService.rucheService.ruchesAllApiary = ruches;
    }); */
    this.capteurService.getUserCapteurs();

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
          this.myNotifier.sendSuccessNotif(NotifList.READ_ALL_ALERTS_HIVE);
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

  // onMove(event, ruche: RucheInterface, id:number): void {
  //   // console.log(document.getElementById(id.toString()).style.transform.substring(10).split('px')[0]);
  //   // console.log(document.getElementById(id.toString()).style.transform.substring(10).split('px')[1].substring(2));
  //   if(this.firstValue){
  //     let str11 = document.getElementById(id.toString()).style.transform.substring(10).split('px')[0];
  //     let str21 = document.getElementById(id.toString()).style.transform.substring(10).split('px')[1].substring(2);
  //     this.translateX = +str11; 
  //     this.translateY = +str21; 
  //     this.firstValue = false;
  //   }
  //     let str1 = document.getElementById(id.toString()).style.transform.substring(10).split('px')[0];
  //     let str2 = document.getElementById(id.toString()).style.transform.substring(10).split('px')[1].substring(2);
  //     let translateX1 : number;
  //     let translateY1 : number;
  //     translateX1 = +str1;
  //     translateY1 = +str2;
  //     console.log(((translateX1 - this.translateX).toString()));
  //     console.log(((translateY1 - this.translateY).toString()));
  //     // let doc = document.getElementsByClassName(id.toString()) as HTMLCollectionOf<HTMLElement>;
  //     // for (let i = 0; i < doc.length; i++) {
  //     //   doc[i].style.transform = 'translate(' + ((translateX1 - this.translateX).toString())  + ', ' + ((translateY1 - this.translateY).toString()) + ') !important';
  //     // }
  //     document.getElementById(id.toString()).setAttribute('style','transform : translate(' + ((translateX1 - this.translateX).toString())  + 'px, ' + ((translateY1 - this.translateY).toString()) + 'px) !important; z-index:100; top: ' + ruche.hivePosY +'%; left : ' + ruche.hivePosX + '%;');
  //     // document.getElementById(id.toString()).style.transform = ('translate(' + ((translateX1 - this.translateX).toString())  + 'px, ' + ((translateY1 - this.translateY).toString()) + 'px) !important');

  //   }


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
    this.photoApiary = null;
  }

  /**
   *
   *
   * @memberof HomeComponent
   */
  cancelBackground(): void {
    this.rucherService.rucher.photo = this.rucherService.currentBackground;
    this.photoApiary = null;
  }
  onMouseover($ruche) {
    const ruche = JSON.parse(JSON.stringify($ruche))
    this.infoRuche = ruche.name + ' : ' + ruche.description;
  }


  collapseAllActiveButton(class1: string, class2: string, class3: string, idButtonActive: string) {
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

    // Active/Desactive the button clicked
    this.eltOnClickId = document.getElementById(idButtonActive);
    if (document.getElementById(idButtonActive).className === 'button button1 active') {
      this.renderer.removeClass(this.eltOnClickId, 'active');
    } else {
      this.renderer.addClass(this.eltOnClickId, 'active');
    }

    // desactive the other buttons
    this.eltOnClickId = document.getElementById(class1);
    this.renderer.removeClass(this.eltOnClickId, 'active');
    this.eltOnClickId = document.getElementById(class2);
    this.renderer.removeClass(this.eltOnClickId, 'active');
    this.eltOnClickId = document.getElementById(class3);
    this.renderer.removeClass(this.eltOnClickId, 'active');

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
      this.rucheService.emitHiveSubject();
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
        this.rucheService.emitHiveSubject();
      } else {
        this.rucheService.ruches.splice(this.hiveIndex, 1);
        this.rucheService.emitHiveSubject();
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
  increasingSort(sensorsList: string[]): string[] {
    sensorsList.sort((a, b) => {
      if (a < b) {
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


}
