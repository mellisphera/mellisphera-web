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
//import { CalendrierHealthService } from './service/health/calendrier-health.service';

@Component({
  selector: 'app-ruche-detail',
  templateUrl: './ruche.detail.component.html',
  styleUrls : ['./ruche.detail.component.scss']
})

export class RucheDetailComponent implements OnInit, OnDestroy {
   
    rucheId;
    message="";

  private timerSubscription: Subscription;

    constructor(private activatedRoute : ActivatedRoute, private route : Router){
                    this.rucheId = null;
    }
    ngOnInit(){
        this.rucheId = this.activatedRoute.snapshot.params.id;
        console.log(this.rucheId);
        console.log(this.route);
        this.route.navigate(['/ruche-detail/'+this.rucheId+'/health',this.rucheId]);
    }


    receiveMessage($event){
        this.message=$event;
    }


    ngOnDestroy() {
    }

}


