import { GraphStackService } from './service/graph-stack.service';
import { Component, OnInit } from '@angular/core';
import { RecordService } from '../service/Record/record.service';

@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.css']
})
export class StackComponent implements OnInit {

  constructor(public graphStack : GraphStackService, public recordService : RecordService) { }

  ngOnInit() {
  }

}
