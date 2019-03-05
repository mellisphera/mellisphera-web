import { StackApiaryGraphService } from './service/stack-apiary-graph.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { RucheService } from '../../accueil/Service/ruche.service';
import { RucheInterface } from '../../_model/ruche';
import { RecordService } from '../ruche-rucher/ruche-detail/service/Record/record.service';

@Component({
  selector: 'app-stack-apiary',
  templateUrl: './stack-apiary.component.html',
  styleUrls: ['./stack-apiary.component.css']
})
export class StackApiaryComponent implements OnInit {

  private arrayHiveSelect: Array<RucheInterface>;
  message: string;
  constructor(public rucheService: RucheService,
    private render: Renderer2,
    public stackApiaryGraph: StackApiaryGraphService,
    public recordService: RecordService) {
    this.arrayHiveSelect = [];
    this.message = '';
  }


  ngOnInit() {

  }

  selectHive(selectHive: RucheInterface, event: MouseEvent) {
    const arrayFilter = this.arrayHiveSelect.filter(hive => hive.id === selectHive.id);
    if (arrayFilter.length > 0) {
      this.render.removeClass(event.target, 'active');
      const index = this.arrayHiveSelect.indexOf(arrayFilter[0]);
      this.arrayHiveSelect.splice(index, 1);
    } else {
      this.render.addClass(event.target, 'active');
      this.arrayHiveSelect.push(selectHive);
      this.recordService.setRange({ scale: 15, type: 'DAY' }, selectHive.id, selectHive.name);
    }
  }

  receiveMessage($event) {
    this.message = $event;
}

}
