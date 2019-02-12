import { Component, OnInit } from '@angular/core';
import { FleursFloraisonService } from '../fleurs-floraison/service/fleurs.floraison.service';
import { DailyStockHoneyService } from '../ruche-rucher/ruche-detail/service/daily-stock-honey.service';
import { DailyRecordsWService } from '../ruche-rucher/ruche-detail/service/daily-records-w.service';
import { GraphiqueFloraisonService } from '../fleurs-floraison/service/graphique-floraison.service';
import { GrapheReserveMielService } from '../ruche-rucher/ruche-detail/stock/service/graphe-reserve-miel.service';
import { CalendrierPoidsService } from '../ruche-rucher/ruche-detail/stock/service/calendrier-poids.service';
import { RucherService } from '../ruche-rucher/rucher.service';

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
    this.dailyRecWService.getDailyRecordsWbyIdHive(this.idHive)
    this.dailyStockHoneyService.getDailyStockHoneyByApiary(this.idHiveHonney);
  }

receiveMessage($event){
  this.message=$event;
}
/*
options = {
    title: {
        top: 30,
        left: 'center',
        text: '2016年某人每天的步数'
    },
    tooltip : {},
    visualMap: {
        min: 0,
        max: 10000,
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 65,
        textStyle: {
            color: '#000'
        }
    },
    calendar: {
        top: 120,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: '2016',
        itemStyle: {
            normal: {borderWidth: 0.5}
        },
        yearLabel: {show: false}
    },
    series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: this.data
    }
  };*/
}
