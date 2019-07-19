import { User } from '../../_model/user';
import { Component, OnInit, OnDestroy, AfterViewInit, Renderer2, ViewChild, ViewChildren } from '@angular/core';
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
import { ObservationService } from '../apiary/ruche-rucher/ruche-detail/observation/service/observation.service';
import { UserParamsService } from '../preference-config/service/user-params.service';
import { DailyRecordsWService } from '../apiary/ruche-rucher/ruche-detail/service/daily-records-w.service';
import { DailyStockHoneyService } from '../apiary/ruche-rucher/ruche-detail/service/daily-stock-honey.service';
import { CapteurService } from '../capteur/capteur.service';
import { AlertsService } from '../service/api/alerts.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { stringify } from '@angular/core/src/render3/util';
import { InfoHivesComponent } from './info-hives/info-hives.component';
import { AlertsHiveComponent } from './info-hives/alerts-hive/alerts-hive.component';
import { AlertsComponent } from './alerts/alerts.component';
import { GraphGlobal } from '../graph-echarts/GlobalGraph';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit, OnDestroy {
  private eltOnClickClass: HTMLCollectionOf<Element>;
  private eltOnClickId: EventTarget;
  infoRuche: any = null;
  photoApiary: File;
  username: string;
  rucheSelect: RucheInterface;
  positionHive: any;
  baseDropValid: string;
  rucherSelectId: string;
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
  newRucheForm: FormGroup;
  private notify: NotifierService;
  private selectHive: RucheInterface;
  private hiveIndex: number;
  private infoHiveComponent: any;

  constructor(public dailyRecTh: DailyRecordService,
    private graphGlobal: GraphGlobal,
    private userService: UserloggedService,
    private notifyService: NotifierService,
    private formBuilder: FormBuilder,
    public login: UserloggedService,
    public rucheService: RucheService,
    private observationService: ObservationService,
    public rucherService: RucherService,
    public dailyRecordWservice: DailyRecordsWService,
    public router: Router,
    private unitService: UnitService,
    public authService: AuthService,
    public capteurService: CapteurService,
    private userConfig: UserParamsService,
    public dailyStockHoneyService: DailyStockHoneyService,
    private renderer: Renderer2,
    private alertsService: AlertsService) {

    this.notify = notifyService;
    this.eltOnClickClass = null;
    this.eltOnClickId = null;
    this.username = this.login.getUser();
    this.photoApiary = null;
    this.message = '';
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
      id: null,
      name: '',
      description: '',
      idUsername: '',
      username: '',
      idApiary: '',
      hivePosX: '',
      hivePosY: '',
      sharingUser: []
    };
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
    showDate.setDate(this.dailyRecTh.rangeDailyRecord.getDate() + 1);
    return this.unitService.getDailyDate(showDate.toISOString());
  }
  ngOnInit() {
    if (!this.rucherService.rucherSubject.closed) {
      this.rucherService.rucherSubject.subscribe(() => { }, () => { }, () => {
        this.dailyRecTh.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
        this.dailyRecordWservice.getDailyWeightIncomeByApiary(this.rucherService.getCurrentApiary());
        this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary());
        this.alertsService.getAllHiveAlertsByApiary(this.rucherService.getCurrentApiary());
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

  numberAlertsActivesByHive(idHive: string): number {
    if (this.alertsService.apiaryAlertsActives != undefined) {
      return (this.alertsService.apiaryAlertsActives.filter(alert => alert.idHive === idHive).length);
    } else {
      return (-1)
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
  //         if (this.dailyStockHoneyService.currentIdHive !== this.rucheService.getCurrentHive().id) {
  //             resolve(true);
  //         } else {
  //             reject(false);
  //         }
  //     });
  // }


  onClick(ruche: RucheInterface) {
    // active button name
    this.clickName();
    // Desactive alerts, notes, summary buttons
    this.eltOnClickId = document.getElementById('notes');
    this.renderer.removeClass(this.eltOnClickId, 'active0');
    this.eltOnClickId = document.getElementById('summary');
    this.renderer.removeClass(this.eltOnClickId, 'active0');
    this.eltOnClickId = document.getElementById('alert');
    this.renderer.removeClass(this.eltOnClickId, 'active0');

    // Save the hive on dataBase
    this.rucheService.saveCurrentHive(ruche);

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
      this.infoHiveComponent.alertsHiveComponent.readAllHiveAlerts(ruche);
    }).catch(err => {
      console.log(err);
    })

    // For the hive notes
    this.observationService.getObservationByIdHive(ruche.id).subscribe();

    //For the hive-weight
    this.dailyRecordWservice.getDailyRecordsWbyIdHive(ruche.id);

    //For the hive-health
    this.dailyRecTh.getByIdHive(ruche.id);

    //For hive sensors
    // this.rucherService.rucheService.getHiveByUsername(this.userService.getUser()).subscribe(ruches => {
    //   this.rucherService.rucheService.ruchesAllApiary = ruches;
    //   this.hiveSensorSelect = ruches[0];
    // })
    this.capteurService.getUserCapteurs();

    // Call info-hives app
    this.router.navigateByUrl('dashboard/home/info-hives');
    let el = document.getElementById('scroll');
    el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

  }

  OnclickAlert() {
    this.router.navigateByUrl('dashboard/home/alerts');
    let el = document.getElementById('scroll');
    el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

  }

  OnclickNotes() {
    this.router.navigateByUrl('dashboard/home/notes');
    let el = document.getElementById('scroll');
    el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

  }

  OnclickSummary() {
    this.router.navigateByUrl('dashboard/home/states');
    let el = document.getElementById('scroll');
    el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

  }


  /**
   *
   *
   * @param {*} event
   * @param {RucheInterface} ruche
   * @memberof HomeComponent
   */
  onMoveEnd(event, ruche: RucheInterface): void {
    if (this.login.checkWriteObject(ruche.idUsername)) {
      const container = document.getElementById("cadre");
      const widthcontainer = container.offsetWidth;
      const heightcontainer = container.offsetHeight;
      let xHivePx = this.getPositionPxToPourcent(parseInt(ruche.hivePosX, 10), widthcontainer);
      let yHivePx = this.getPositionPxToPourcent(parseInt(ruche.hivePosY, 10), heightcontainer);
      this.position.x = this.getPourcentToPx(xHivePx + event.x, widthcontainer);
      this.position.y = this.getPourcentToPx(yHivePx + event.y, heightcontainer);
      if (this.position.y < 0) {
        this.position.y = 0;
      } else if (this.position.x < 0) {
        this.position.x = 0;
      }
      let rucheUpdate = Object.assign({}, ruche);
      rucheUpdate.hivePosX = '' + this.position.x;
      rucheUpdate.hivePosY = '' + this.position.y;
      this.rucheService.updateCoordonneesRuche(rucheUpdate).subscribe(
        () => { }, () => { }, () => {
          this.position.x = 0;
          this.position.y = 0;
          this.hiveUpdateForDestroyPage.push(rucheUpdate);
        }
      )
    }
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
    this.rucherService.updateBackgroundApiary(this.rucherService.rucher.id);
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

  ngOnDestroy(): void {
    this.hiveUpdateForDestroyPage.forEach((hiveUpdate: RucheInterface) => {
      let hiveUpdateIndex = this.rucheService.ruches.map(hive => hive.id).indexOf(hiveUpdate.id);
      this.rucheService.ruches[hiveUpdateIndex].hivePosX = hiveUpdate.hivePosX;
      this.rucheService.ruches[hiveUpdateIndex].hivePosY = hiveUpdate.hivePosY;
    });
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
      if (this.userService.getJwtReponse().country === "FR") {
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
    this.selectHive.idApiary = this.rucherService.rucherSelectUpdate.id;
    this.selectHive.name = formValue.nomRuche;
    this.selectHive.description = formValue.descriptionRuche;
    this.rucheService.updateRuche(this.selectHive).subscribe(() => { }, () => { }, () => {
      if (this.selectHive.idApiary === this.rucherService.getCurrentApiary()) {
        this.rucheService.ruches[this.hiveIndex] = this.selectHive;
        this.rucheService.emitHiveSubject();
      } else {
        this.rucheService.ruches.splice(this.hiveIndex, 1);
        this.rucheService.emitHiveSubject();
      }
      if (this.userService.getJwtReponse().country === "FR") {
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

  // List the hives who haven't daily records data
  hiveNoDataList(): string {
    let stringReturn: string;
    let stringTemp: string;
    stringReturn = '';
    stringTemp = '"';
    let i = 0;
    let j = 0;

    // The first time we found the length of the list (for a good presentation, no important)
    this.rucheService.ruches.forEach(hive => {
      // If the hive haven't daily records data
      if (this.dailyRecTh.dailyRecords.filter(elt => elt.idHive === hive.id).length === 0) {
        i += 1;
      }
    });

    // second time, we build the hive list
    this.rucheService.ruches.forEach(hive => {
      // If the hive haven't daily records data
      if (this.dailyRecTh.dailyRecords.filter(elt => elt.idHive === hive.id).length === 0) {
        j += 1;
        if (j === i - 1) {
          stringTemp += hive.name;
          if (this.userService.getJwtReponse().country === "FR") {
            stringTemp += '" et "';
          } else {
            stringTemp += '" and "';
          }
        } else if (j === i) {
          stringTemp += hive.name;
          stringTemp += '"';
        } else {
          stringTemp += hive.name;
          stringTemp += '" , "';
        }
      }
    });

    // Finally we build the message
    if (i === 1) {
      if (this.userService.getJwtReponse().country === "FR") {
        stringReturn += '   Les données pour la ruche ';
        stringReturn += stringTemp;
        stringReturn += ' ne sont pas à jour. Veuillez synchroniser vos données.'
      } else {
        stringReturn += '   Datas for the hive ';
        stringReturn += stringTemp;
        stringReturn += ' are not up-to-date. Please synchronize your datas.'
      }
    } else if (i === this.rucheService.ruches.length){
      if (this.userService.getJwtReponse().country === "FR") {
        stringReturn += '   Vos données pour les ruches de ce rucher ne sont pas à jour. Veuillez synchroniser vos données.';
      } else {
        stringReturn += '   Your datas for the hives of this apiary are not up-to-date. Please synchronize your datas.';
      }
    }else if (i > 1) {
      if (this.userService.getJwtReponse().country === "FR") {
        stringReturn += '   Les données pour les ruches ';
        stringReturn += stringTemp;
        stringReturn += ' ne sont pas à jour. Veuillez synchroniser vos données.'
      } else {
        stringReturn += '   Datas for the hives ';
        stringReturn += stringTemp;
        stringReturn += ' are not up-to-date. Please synchronize your datas.'
      }
    }

    // and return it
    return stringReturn;
  }

  setRouterPage(event) {
     if (event instanceof InfoHivesComponent) {
      this.infoHiveComponent = event;
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

}
