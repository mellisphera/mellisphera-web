import { User } from '../../_model/user';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { UserloggedService } from '../../userlogged.service';
import { RucherService } from '../service/rucher.service';
import { Ruche } from './ruche';
import { DailyRecordService } from '../service/dailyRecordService';
import { RucheService } from '../service/ruche.service';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit, OnDestroy {
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

  constructor(
    public dailyRecTh: DailyRecordService,
    public login: UserloggedService,
    public rucheService: RucheService,
    public rucherService: RucherService,
    private route: Router,
    private unitService: UnitService,
    public authService: AuthService) {
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
  ngOnInit(): void {
    if (!this.rucherService.rucherSubject.closed) {
      this.rucherService.rucherSubject.subscribe(() => { }, () => { }, () => {
        this.dailyRecTh.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
      });
    }
  }

  onClick(ruche: RucheInterface) {
    this.rucheService.saveCurrentHive(ruche.id);
    this.route.navigateByUrl('dashboard/ruche-detail');

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
      console.log('largeur', + widthcontainer);
      const heightcontainer = container.offsetHeight;
      let xHivePx = this.getPositionPxToPourcent(parseInt(ruche.hivePosX, 10), widthcontainer);
      let yHivePx = this.getPositionPxToPourcent(parseInt(ruche.hivePosY, 10), heightcontainer);
      console.log('ruche en px : ' + xHivePx + '-' + yHivePx);
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
      console.log(this.position);
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
  
}
