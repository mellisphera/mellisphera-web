import { Component, OnInit, OnDestroy } from '@angular/core';
import { DailyRecordsWService } from '../service/daily-records-w.service';
import { ECharts, EChartOption} from 'echarts';
import { CalendrierPoidsService } from './service/calendrier-poids.service';
import { ActivatedRoute } from '@angular/router';
import { DailyStockHoneyService } from '../service/daily-stock-honey.service';
import { GrapheReserveMielService } from './service/graphe-reserve-miel.service';
import { RucheService } from '../../../disposition-ruche/Service/ruche.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit, OnDestroy {

  message="";
  rucheId : string;
  rucheName : string;
  constructor(public dailyRecWService : DailyRecordsWService,
    public calendrierPoids : CalendrierPoidsService,
    public dailyStockHoneyService : DailyStockHoneyService,
    public grapheMielService : GrapheReserveMielService,
    private activatedRoute : ActivatedRoute,
    private rucheService : RucheService) { }

  ngOnInit() {
    this.rucheId = this.activatedRoute.snapshot.params.id;
    this.rucheName = this.activatedRoute.snapshot.params.name;
    this.dailyRecWService.getDailyRecordsWbyIdHive(this.rucheService.ruche.id);
    this.dailyStockHoneyService.getDailyStockHoneyByApiary(this.rucheService.ruche.id);
  }

  receiveMessage($event){
        this.message=$event;
  }


  ngOnDestroy() {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
      this.dailyRecWService.cleanQuery();
      this.dailyStockHoneyService.cleanQuery();
  }
}
