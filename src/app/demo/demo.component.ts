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
    public grapheMielService: GraphHoneyService,
    public calendrierPoids: CalendrierFSTLervice,
    public rucherService: RucherService) {
    }

  ngOnInit() {
    this.rucherService.ruchersObs.subscribe(() => {}, () => {}, () => {
      this.rucherService.rucheService.ruchesObs.subscribe(() => {}, () => {}, () => {
        this.dailyRecWService.getDailyRecordsWbyIdHive(this.rucherService.rucheService.ruche.id);
        console.log(this.dailyRecWService.dailyRec);
        this.dailyStockHoneyService.getDailyStockHoneyByApiary(this.rucherService.rucheService.ruche.id);
      });
    });
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
