import { Component, OnInit } from '@angular/core';
import { RucherService } from '../../rucher.service';
import { Ruche } from '../../ruche';
import { RucheDetailService } from '../ruche.detail.service';
import { ProcessReport } from '../../processedReport';
import { DailyRecordsWService } from '../service/daily-records-w.service';
import { ActivatedRoute } from '@angular/router';
import { DailyStockHoneyService } from '../service/daily-stock-honey.service';
import { RecordService } from '../service/Record/record.service';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.css']
})
export class ObservationComponent implements OnInit {

  rucheDetail = new Ruche();
  rucheId;
  rucheName;
  rucheDescription;
  observationsHive : ProcessReport[] = [];
  constructor(public rucherService : RucherService, 
    public rucheDetailService : RucheDetailService, 
    private dailyRecWService : DailyRecordsWService,
    private activatedRoute : ActivatedRoute,
    private dailyStockHoneyService : DailyStockHoneyService,
    private recordService : RecordService
    ) { }

  ngOnInit() {
    this.rucheId = this.activatedRoute.snapshot.params.id;
    console.log(this.rucheId);
    /*this.getRucheDetails();
    this.getObservationsHive();*/
    this.dailyRecWService.getDailyRecordsWbyIdHive(this.rucheId);
    this.dailyStockHoneyService.cleanQuery();
    this.dailyStockHoneyService.getDailyStockHoneyByApiary(this.rucheId);
    this.recordService.getRecordByIdHive(this.rucheId);
  }




}
