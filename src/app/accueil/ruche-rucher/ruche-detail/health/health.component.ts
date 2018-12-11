import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendrierHealthService } from './service/calendrier-health.service';

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
    public calendrierHealthService : CalendrierHealthService) { }

  ngOnInit() {
    this.rucheId = this.activatedRoute.snapshot.params.id;
    this.rucheName = this.activatedRoute.snapshot.params.name;
    console.log(this.rucheName);
  }

  receiveMessage($event){
        this.message=$event;
  }

  ngOnDestroy(){

  }

}
