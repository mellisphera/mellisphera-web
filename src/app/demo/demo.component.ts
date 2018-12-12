import { Component, OnInit } from '@angular/core';
import { FleursFloraisonService } from '../accueil/fleurs-floraison/service/fleurs.floraison.service';
import { DailyStockHoneyService } from '../accueil/ruche-rucher/ruche-detail/service/daily-stock-honey.service';
import { DailyRecordsWService } from '../accueil/ruche-rucher/ruche-detail/service/daily-records-w.service';
import { GraphiqueFloraisonService } from '../accueil/fleurs-floraison/service/graphique-floraison.service';
import { GrapheReserveMielService } from '../accueil/ruche-rucher/ruche-detail/stock/service/graphe-reserve-miel.service';
import { CalendrierPoidsService } from '../accueil/ruche-rucher/ruche-detail/stock/service/calendrier-poids.service';
import { RucherService } from '../accueil/ruche-rucher/rucher.service';

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
  constructor(public fleursFloraisonService : FleursFloraisonService, 
    public dailyStockHoneyService : DailyStockHoneyService,
    public dailyRecWService : DailyRecordsWService,
    public grahFleur : GraphiqueFloraisonService,
    public grapheMielService : GrapheReserveMielService,
    public calendrierPoids : CalendrierPoidsService,
    public rucherService : RucherService) {
      sessionStorage.setItem("demo",'demo');
      this.idHive = "5be557a2dc7d277a7c8c062a";
      this.idApiary = "5bc48388dc7d27634d281536";
      this.idHiveHonney = "5bc483abdc7d27634d281537";
    }

  ngOnInit() {
    console.log(this.idHive);
    this.dailyRecWService.getDailyRecordsWbyIdHive(this.idHive)
    this.dailyStockHoneyService.getDailyStockHoneyByApiary(this.idHiveHonney);
  }

receiveMessage($event){
  this.message=$event;
}

}
