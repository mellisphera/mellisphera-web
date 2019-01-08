import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendrierHealthService } from './service/calendrier-health.service';
import { DailyRecordService } from '../../../../accueil/disposition-ruche/Service/dailyRecordService';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit, OnDestroy{

  rucheId;
  message="";
  rucheName : string;
  constructor(private activatedRoute : ActivatedRoute,
    public calendrierHealthService : CalendrierHealthService,
    public dailyRecordThService : DailyRecordService) { }

  ngOnInit() {
    this.rucheId = this.activatedRoute.snapshot.params.id;
    this.rucheName = this.activatedRoute.snapshot.params.name;
    this.dailyRecordThService.getByIdHive(this.rucheId);
    console.log(this.rucheName);
  }

  receiveMessage($event){
        this.message=$event;
  }

  ngOnDestroy(){

  }

}
