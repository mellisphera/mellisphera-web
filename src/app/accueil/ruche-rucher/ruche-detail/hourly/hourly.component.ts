import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordService } from '../service/Record/record.service';
import { GraphRecordService } from './service/graph-record.service';

@Component({
  selector: 'app-hourly',
  templateUrl: './hourly.component.html',
  styleUrls: ['./hourly.component.css']
})
export class HourlyComponent implements OnInit {

  message="";
  rucheId;
  constructor(private activatedRoute : ActivatedRoute,
    public recordService : RecordService,
    public graphRecordService : GraphRecordService
    ) { }

  ngOnInit() {
    this.rucheId = this.activatedRoute.snapshot.params.id;
    this.recordService.getRecordByIdHive(this.rucheId);
  }

  receiveMessage($event){
    this.message=$event;
  }

}
