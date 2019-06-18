import { UserloggedService } from './../userlogged.service';
import { CONFIG } from '../../constants/config';
import { AtokenStorageService } from './../auth/Service/atoken-storage.service';
import { RucherService } from '../dashboard/service/rucher.service';
import { GraphFlowerService } from './graph/graph-flower.service';
import { GraphHoneyService } from './graph/graph-honey.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FleursFloraisonService } from '../dashboard/fleurs-floraison/service/fleurs.floraison.service';
import { DailyStockHoneyService } from '../dashboard/apiary/ruche-rucher/ruche-detail/service/daily-stock-honey.service';
import { DailyRecordsWService } from '../dashboard/apiary/ruche-rucher/ruche-detail/service/daily-records-w.service';
import { GraphiqueFloraisonService } from '../dashboard/fleurs-floraison/service/graphique-floraison.service';
import { GrapheReserveMielService } from '../dashboard/apiary/ruche-rucher/ruche-detail/stock/service/graphe-reserve-miel.service';
import { CalendrierPoidsService } from '../dashboard/apiary/ruche-rucher/ruche-detail/stock/service/calendrier-poids.service';
import { CalendrierFSTLervice } from './graph/calendrierFSTL';
import { RucheService } from '../dashboard/service/ruche.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit,OnDestroy {

  idHive : string;
  idApiary : string;
  idHiveHonney : string;
  message="";
  constructor(
    public fleursFloraisonService: FleursFloraisonService,
    public dailyStockHoneyService : DailyStockHoneyService,
    public dailyRecWService: DailyRecordsWService,
    public grahFleur: GraphFlowerService,
    public rucheService: RucheService,
    public grapheMielService: GraphHoneyService,
    public calendrierPoids: CalendrierFSTLervice,
    public rucherService: RucherService,
    public tokenService: AtokenStorageService,
    private user: UserloggedService) {
    }
  ngOnInit() {
/*     this.saveToken(() => {
      this.rucherService.getApiaryByUser(this.user.getUser());
      this.rucheService.hiveSubject.subscribe(
        () => {}, () => {},
        () => {
          this.dailyStockHoneyService.getDailyStockHoneyByHive(this.rucheService.ruche.id);
          this.fleursFloraisonService.getUserFleur(this.rucherService.rucher.id);
          this.dailyRecWService.getDailyRecordsWbyIdHive(this.rucheService.ruche.id);
        }
      );

    }); */
  }

  saveToken(next?) {
    this.tokenService.saveToken(CONFIG.PUBLIC_TOKEN);
/*     this.user.setUser({
      'email': 'fstl@null',
      'username': 'fstl',
      'accessToken': CONFIG.PUBLIC_TOKEN,
      'authorities': new Array('ROLE_STANDARD'),
      'country': 'FR'
    }); */
    next();
  }


  receiveMessage($event){
    this.message=$event;
  }

  ngOnDestroy() {
    this.rucheService.hiveSubject.unsubscribe();
  }
}
