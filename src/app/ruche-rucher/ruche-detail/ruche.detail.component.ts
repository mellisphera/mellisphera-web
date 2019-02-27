import { MyDate } from './../../class/MyDate';
import { Component, OnInit, OnDestroy, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserloggedService } from '../../userlogged.service';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { DailyRecordsWService } from './service/daily-records-w.service';
import { DailyStockHoneyService } from './service/daily-stock-honey.service';
import { RecordService } from './service/Record/record.service';
import { DailyRecordService } from '../../accueil/Service/dailyRecordService';
import { RucheService } from '../../accueil/Service/ruche.service';
import { ObservationService } from './observation/service/observation.service';
import { CONFIG } from '../../../config';
import { CalendrierTempIntService } from './daily/service/calendrier-temp-int.service';
import { AtokenStorageService } from '../../auth/Service/atoken-storage.service';
import { RucheInterface } from '../../_model/ruche';

@Component({
  selector: 'app-ruche-detail',
  templateUrl: './ruche.detail.component.html',
  styleUrls : ['./ruche.detail.component.scss']
})

export class RucheDetailComponent implements OnInit, OnDestroy {
    message: string;
    hiveSelect: RucheInterface;
    compteurHive: number;
    currentTab: string;
    public img: string;


    constructor(private activatedRoute: ActivatedRoute,
        private route: Router,
        public rucheService: RucheService,
        private observationService: ObservationService,
        private dailyRecordThService: DailyRecordService,
        private dailyRecordWservice: DailyRecordsWService,
        private dailyStockHoneyService: DailyStockHoneyService,
        private recordService: RecordService,
        private userService: UserloggedService,
        public tokenService: AtokenStorageService,
        public calendrierTempInt: CalendrierTempIntService) {
            this.compteurHive = 0;
            this.currentTab = 'notes';
            this.hiveSelect = {
                id : null,
                name : 'NaN',
                description : '',
                username : '',
                idApiary: '',
                hivePosX : '',
                hivePosY : '',
                sharingUser : []
              };
              this.message = '';
            this.img = CONFIG.URL_FRONT + "assets/icons/next-button-4.png";
    }

    ngOnInit() {
        this.observationService.getObservationByIdHive(this.rucheService.getCurrentHive());
        console.log(this.rucheService.hiveSubject);
        console.log(this.hiveSelect);
        this.rucheService.hiveSubject.subscribe( () => {}, () => {}, () => {
            this.rucheService.findRucheById(this.rucheService.getCurrentHive(), (hive) => {
                this.hiveSelect = hive[0];
                console.log(this.hiveSelect);
                this.compteurHive = this.rucheService.ruches.indexOf(this.hiveSelect);
                this.rucheService.saveCurrentHive(this.hiveSelect.id);
            });
        });

    }


    receiveMessage($event){
        this.message=$event;
    }

    previousHive(){
        if (this.compteurHive != 0 && this.compteurHive != -1) {
            this.compteurHive--;
            this.hiveSelect = this.rucheService.ruches[this.compteurHive];
            this.rucheService.saveCurrentHive(this.hiveSelect.id);
            this.exeData();
        }

    }

    nextHive() {
        if (this.compteurHive != this.rucheService.ruches.length-1){
             this.compteurHive++;
        }
        this.hiveSelect = this.rucheService.ruches[this.compteurHive];
        this.rucheService.saveCurrentHive(this.hiveSelect.id);
        this.rucheService.saveCurrentHive(this.hiveSelect.id);
        this.exeData();
    }


    onTab(event : string){
        this.currentTab = event;
        console.log(this.currentTab);
        this.exeData();


    }
    exeData() {
        if (this.currentTab.indexOf('notes') !=-1) {
          this.observationService.getObservationByIdHive(this.rucheService.getCurrentHive());
        } else if(this.currentTab.indexOf('daily')!=-1) {
          this.dailyRecordThService.getByIdHive(this.rucheService.getCurrentHive());
          this.dailyRecordWservice.getDailyRecordsWbyIdHive(this.rucheService.getCurrentHive());
        } else if (this.currentTab.indexOf('stock')!=-1) {
            if (this.dailyStockHoneyService.cuurrentIdHive != this.rucheService.getCurrentHive()) {
                this.dailyStockHoneyService.getDailyStockHoneyByHive(this.rucheService.getCurrentHive());
            }
            if (this.dailyRecordWservice.currentIdHive != this.rucheService.getCurrentHive()) {
                console.log('calendrier');
                this.dailyRecordWservice.getDailyRecordsWbyIdHive(this.rucheService.getCurrentHive());
            }
        } else if (this.currentTab.indexOf('hourly')!=-1) {
            if (this.recordService.currentIdHive != this.rucheService.getCurrentHive()) {
                this.recordService.getRecordByIdHive(this.rucheService.getCurrentHive(), MyDate.getRange());
            }
        } else if (this.currentTab.indexOf('health')!=-1) {
          this.dailyRecordThService.getByIdHive(this.rucheService.getCurrentHive());
        } else if (this.currentTab.indexOf('stack')!=-1) {
            if (this.recordService.currentIdHive != this.rucheService.getCurrentHive()){
                this.recordService.getRecordByIdHive(this.rucheService.getCurrentHive(), MyDate.getRange());
            }
        }
        console.log(this.hiveSelect);
    }

    ngOnDestroy() {
        this.rucheService.hiveSubject.unsubscribe();
        this.observationService.obsHiveSubject.unsubscribe();
        this.observationService.obsApiarySubject.unsubscribe();
    }

}
