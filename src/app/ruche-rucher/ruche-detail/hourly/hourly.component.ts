import { MyDate } from './../../../class/MyDate';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordService } from '../service/Record/record.service';
import { GraphRecordService } from './service/graph-record.service';
import { RucheService } from '../../../accueil/Service/ruche.service';

@Component({
  selector: 'app-hourly',
  templateUrl: './hourly.component.html',
  styleUrls: ['./hourly.component.css']
})
export class HourlyComponent implements OnInit {

  message="";
  rucheId: string;
  rucheName : string;


  constructor(private activatedRoute: ActivatedRoute,
    public recordService: RecordService,
    public graphRecordService: GraphRecordService,
    private rucheService: RucheService,
    ) { }

  ngOnInit() {
    /*this.rucheId = this.activatedRoute.snapshot.params.id;
    this.rucheName = this.activatedRoute.snapshot.params.name;
    this.recordService.getRecordByIdHive(this.rucheService.ruche.id);*/
  }

  receiveMessage($event) {
    this.message = $event;
  }

  selectRange(event) {
    /*
    let date = null;
    const range = event.target.value;
    if (event.target.value > 10 ) {
      date = new Date();
      date.setDate((new Date().getDate() - range));
    } else {
      date = new Date();
      date.setMonth((new Date().getMonth() - range) );
    }
    console.log(date);
    this.recordService.getRecordByIdHive(this.rucheService.getCurrentHive(), MyDate.getRange(date));*/
    this.recordService.setRangeObs(event.target.value);
  }

}
