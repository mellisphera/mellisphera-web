import { UserloggedService } from './../userlogged.service';
import { CONFIG } from './../../config';
import { AtokenStorageService } from './../auth/Service/atoken-storage.service';
import { RucherService } from './../ruche-rucher/rucher.service';
import { GraphFlowerService } from './graph/graph-flower.service';
import { GraphHoneyService } from './graph/graph-honey.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FleursFloraisonService } from '../fleurs-floraison/service/fleurs.floraison.service';
import { DailyStockHoneyService } from '../ruche-rucher/ruche-detail/service/daily-stock-honey.service';
import { DailyRecordsWService } from '../ruche-rucher/ruche-detail/service/daily-records-w.service';
import { GraphiqueFloraisonService } from '../fleurs-floraison/service/graphique-floraison.service';
import { GrapheReserveMielService } from '../ruche-rucher/ruche-detail/stock/service/graphe-reserve-miel.service';
import { CalendrierPoidsService } from '../ruche-rucher/ruche-detail/stock/service/calendrier-poids.service';
import { CalendrierFSTLervice } from './graph/calendrierFSTL';
import { RucheService } from '../accueil/Service/ruche.service';

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
    this.saveToken(() => {
      this.rucherService.getUserRuchersLast(this.user.getUser());
      this.rucheService.hiveSubject.subscribe(
        () => {}, () => {},
        () => {
          this.dailyStockHoneyService.getDailyStockHoneyByHive(this.rucheService.ruche.id);
          this.fleursFloraisonService.getUserFleur(this.rucherService.rucher.id);
          this.dailyRecWService.getDailyRecordsWbyIdHive(this.rucheService.ruche.id);
        }
      );

    });
  }

  saveToken(next?) {
    this.tokenService.saveToken(CONFIG.PUBLIC_TOKEN);
    this.user.setUser({
      'username' : '***REMOVED***',
      'password' : '***REMOVED***'
    });
    next();
  }


  receiveMessage($event){
    this.message=$event;
  }

  ngOnDestroy() {
    this.rucheService.hiveSubject.unsubscribe();
  }
}
