import { RucherService } from './../ruche-rucher/rucher.service';
import { GraphFlowerService } from './graph/graph-flower.service';
import { GraphHoneyService } from './graph/graph-honey.service';
import { Component, OnInit } from '@angular/core';
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
export class DemoComponent implements OnInit {

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
    public rucherService: RucherService) {
    }

  ngOnInit() {
    this.rucherService.ruchersObs.subscribe(() => {}, () => {}, () => {
      this.rucheService.ruchesObs.subscribe(() => {}, () => {}, () => {
        console.log(this.rucherService.rucher);
        this.dailyRecWService.getDailyRecordsWbyIdHive(this.rucherService.rucheService.ruche.id);
        console.log(this.dailyRecWService.dailyRec);
        this.dailyStockHoneyService.getDailyStockHoneyByApiary(this.rucherService.rucheService.ruche.id);
      });
    });
  }

receiveMessage($event){
  this.message=$event;
}
}
