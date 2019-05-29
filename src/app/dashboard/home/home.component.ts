import { User } from '../../_model/user';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { UserloggedService } from '../../userlogged.service';
import { RucherService } from '../service/rucher.service';
import { Ruche } from './ruche';
import { DailyRecordService } from '../service/dailyRecordService';
import { RucheService } from '../service/ruche.service';
import { RucheInterface } from '../../_model/ruche';
import { Route, Router } from '@angular/router';
import { CONFIG } from '../../../config';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit {
  infoRuche: any = null;
  photoApiary: File;
  username: string;
  rucheSelect: RucheInterface;
  positionHive: any;
  baseDropValid: string;
  rucherSelectId: string;
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

  constructor(public dailyRecTh: DailyRecordService,
    public login: UserloggedService,
    public rucheService: RucheService,
    public rucherService: RucherService,
    private route: Router,
    public authService: AuthService) {
    this.username = this.login.getUser();
    this.photoApiary = null;
    this.message = '';
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
  getDateDaily() {
    return this.dailyRecTh.rangeDailyRecord.toDateString();
  }
  ngOnInit() {
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

  onMoveEnd(event, ruche: RucheInterface) {
    const container = document.getElementById("cadre");
    const widthcontainer = container.offsetWidth;
    console.log('largeur', + widthcontainer);
    const heightcontainer = container.offsetHeight;
    console.log(ruche);
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
      }
    )
    console.log(event.x + '-' + event.y);
  }


  getPositionPxToPourcent(value: number, total: number): any {
    return (value * total) / 100;
  }
  /* Calcule les positions */
  /*   getPosition(position: any) {
      const container = document.getElementById("cadre");
  
      const widthcontainer = container.offsetWidth;
      const heightcontainer = container.offsetHeight; 
  
      const coordonnes = position.transform.slice(10, position.transform.length - 1);
      let left = parseInt(position.left, 10);
      let top = parseInt(position.top, 10);
      left = this.getPourcentToPx(left,widthcontainer);
      top = this.getPourcentToPx(top,heightcontainer);
  
      const deplacement = coordonnes.split(',');
  
      deplacement[0] = parseInt(deplacement[0].slice(0,deplacement[0].length-2));
      deplacement[1] = parseInt(deplacement[1].slice(0,deplacement[1].length-2));
  
      this.position.x = '' + (parseInt(left+deplacement[0]) *100) / widthcontainer;
      this.position.y  ='' + (parseInt(top+deplacement[1]) *100) / heightcontainer;
      if(parseInt(this.position.x) > 99 || parseInt(this.position.x) < 0){
        this.position.x = ""+50;
        this.position.y = ""+50;
      }
      if(parseInt(this.position.y) > 99 || parseInt(this.position.y) < 0){
        this.position.x = ""+50;
        this.position.y = ""+50;
      }
      console.log(this.position);
    } */

  getPourcentToPx(valuePx: number, total: number) {
    return (valuePx / total) * 100;

  }
  /* Pour chaque rucher selectionner */
  saveBackground() {
    this.rucherService.updateBackgroundApiary(this.rucherService.rucher.id);
    this.photoApiary = null;
  }

  cancelBackground() {
    this.rucherService.rucher.photo = this.rucherService.currentBackground;
    this.photoApiary = null;
  }
  onMouseover($ruche) {
    const ruche = JSON.parse(JSON.stringify($ruche))
    this.infoRuche = ruche.name + ' : ' + ruche.description;
  }
}
