import { Component, OnInit, OnDestroy} from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
//import * as echarts from '../../../../assets/echarts.js';
import { ECharts, EChartOption} from 'echarts';
import { Rucher } from '../rucher';
import { Ruche } from '../ruche';
import { ProcessReport } from '../processedReport';
import { RucherService } from '../rucher.service';
import { UserloggedService } from '../../../userlogged.service';
import { selectedRucherService } from '../../_shared-services/selected-rucher.service';
import { Observable, Subscription } from 'rxjs';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { RucheDetailService } from './ruche.detail.service';
//import { CalendrierPoidsService } from './service/calendrier-poids.service';
import { DailyRecordsWService } from './service/daily-records-w.service';
import { DailyStockHoneyService } from './service/daily-stock-honey.service';
import { GrapheReserveMielService } from './stock/service/graphe-reserve-miel.service';
import { RecordService } from './service/Record/record.service';
//import { GraphRecordService } from './service/Record/graph-record.service';
import { DailyRecordService } from '../../disposition-ruche/Service/dailyRecordService';
import { RucheService } from '../../disposition-ruche/Service/ruche.service';
import { ObservationService } from './observation/service/observation.service';
//import { CalendrierHealthService } from './service/health/calendrier-health.service';
import { CONFIG } from '../../../../config';

@Component({
  selector: 'app-ruche-detail',
  templateUrl: './ruche.detail.component.html',
  styleUrls : ['./ruche.detail.component.scss']
})

export class RucheDetailComponent implements OnInit, OnDestroy {
   
    rucheId : string;
    rucheName : string;
    message="";
    compteurHive : number;
    public img : string;
    private timerSubscription: Subscription;

    constructor(private activatedRoute : ActivatedRoute, 
        private route : Router, 
        public rucheService : RucheService,
        private observationService : ObservationService,
        private dailyRecordThService : DailyRecordService,
        private dailyRecordWservice : DailyRecordsWService,
        private dailyStockHoneyService : DailyStockHoneyService,
        private recordService : RecordService){
                    this.rucheId = null;
                    this.compteurHive = 0;
                    this.img = CONFIG.URL_FRONT+"assets/icons/next-button-4.png";
    }

    ngOnInit(){
        this.rucheId = this.activatedRoute.snapshot.params.id;
        this.rucheName = this.activatedRoute.snapshot.params.name;
        console.log(this.rucheId);
        console.log(this.rucheName);
        this.rucheService.ruchesObs.subscribe(
            ()=>{},
            ()=>{},
            ()=>{
                this.rucheService.findRucheById(this.rucheId,true);
                console.log(this.rucheService.ruche);
                this.compteurHive = this.rucheService.ruchesAllApiary.indexOf(this.rucheService.ruche);
                console.log(this.compteurHive); 
            }
        )
        this.route.navigate(['/ruche-detail/'+this.rucheId+'/'+this.rucheName+'/observation/'+this.rucheId+'/'+this.rucheName]);
    }


    receiveMessage($event){
        this.message=$event;
    }

    previousHive(){
        if(this.compteurHive != 0 && this.compteurHive != -1){
            this.compteurHive--;
            this.rucheService.ruche = this.rucheService.ruchesAllApiary[this.compteurHive];
            this.rucheId = this.rucheService.ruche.id;
            this.rucheName = this.rucheService.ruche.name
            console.log(this.rucheService.ruche);
            this.exeData();
        }
        
    }

    nextHive(){
        if(this.compteurHive != this.rucheService.ruchesAllApiary.length-1){
             this.compteurHive++;
        }
        this.rucheService.ruche = this.rucheService.ruchesAllApiary[this.compteurHive];
        this.rucheId = this.rucheService.ruche.id;
        this.rucheName = this.rucheService.ruche.name
        console.log(this.rucheService.ruche);
        this.exeData();
    }

    ngOnDestroy() {
    }

    exeData(){
        switch (this.activatedRoute.snapshot['_urlSegment'].segments[3].path){
            case 'observation':
                this.observationService.getObservationByIdHive(this.rucheService.ruche.id);
                break;
            case 'daily':
                this.dailyRecordThService.getByIdHive(this.rucheId);
                this.dailyRecordWservice.getDailyRecordsWbyIdHive(this.rucheService.ruche.id);
                break;
            case 'stock':
                this.dailyRecordWservice.getDailyRecordsWbyIdHive(this.rucheService.ruche.id);
                this.dailyStockHoneyService.getDailyStockHoneyByApiary(this.rucheService.ruche.id);
                break;
            case 'hourly':
                this.recordService.getRecordByIdHive(this.rucheService.ruche.id);
                break;
        }
    }

}


