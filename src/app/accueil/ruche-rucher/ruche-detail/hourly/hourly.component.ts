import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordService } from '../service/Record/record.service';
import { GraphRecordService } from './service/graph-record.service';
import { RucheService } from '../../../disposition-ruche/Service/ruche.service';

@Component({
  selector: 'app-hourly',
  templateUrl: './hourly.component.html',
  styleUrls: ['./hourly.component.css']
})
export class HourlyComponent implements OnInit {

  message="";
  rucheId: string;
  rucheName : string;


  constructor(private activatedRoute : ActivatedRoute,
    public recordService : RecordService,
    public graphRecordService : GraphRecordService,
    private rucheService : RucheService
    ) { }

  ngOnInit() {
    /*this.rucheId = this.activatedRoute.snapshot.params.id;
    this.rucheName = this.activatedRoute.snapshot.params.name;
    this.recordService.getRecordByIdHive(this.rucheService.ruche.id);*/
  }

  receiveMessage($event){
    this.message=$event;
  }

}
