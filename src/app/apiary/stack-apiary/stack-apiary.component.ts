import { StackApiaryGraphService } from './service/stack-apiary-graph.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { RucheService } from '../../accueil/Service/ruche.service';
import { RucheInterface } from '../../_model/ruche';
import { RecordService } from '../ruche-rucher/ruche-detail/service/Record/record.service';
import { EChartOption } from 'echarts';
import { BehaviorSubject } from 'rxjs';
import { UserloggedService } from '../../userlogged.service';
import { RucherService } from '../ruche-rucher/rucher.service';
/* import * as echarts from 'echarts'; */

@Component({
  selector: 'app-stack-apiary',
  templateUrl: './stack-apiary.component.html',
  styleUrls: ['./stack-apiary.component.css']
})
export class StackApiaryComponent implements OnInit {

  private arrayHiveSelect: Array<RucheInterface>;
  private echartInstance: any;
  public merge: any;
  private subjectEchart: BehaviorSubject<any>;
  message: string;
  constructor(public rucheService: RucheService,
    public rucherService: RucherService,
    private render: Renderer2,
    private userService: UserloggedService,
    public stackApiaryGraph: StackApiaryGraphService,
    public recordService: RecordService, ) {
    this.arrayHiveSelect = [];
    /* this.subjectEchart = new BehaviorSubject({}); */
    this.merge = {
      series : [],
      legend:{
        data: []
      }
    };
    this.message = '';
  }

  onChartInit(e: any) {
    this.echartInstance = e;
    console.log(e);
    console.log('on chart init:', e);
  }

  ngOnInit() {
    if (!this.rucherService.rucherSubject.closed) {
      this.rucherService.rucherSubject.subscribe(() => {}, () => {}, () => {
        this.rucherService.rucheService.getRucheByUsername(this.userService.getUser()).map((hives) => {
          hives.forEach(elt => {
            this.rucherService.findRucherById(elt.idApiary, (apiary) => {
              elt.apiaryName = apiary[0].name;
            });
          });
          return hives;
        }).subscribe((hives) => {
          this.rucherService.rucheService.ruchesAllApiary = hives;
        });
      });
    }
  }

  getHiveByApiary(idApiary: string) {
    try{
      return this.rucherService.rucheService.ruchesAllApiary.filter(hive => hive.idApiary === idApiary);
    }
    catch(e){
      return false;
    }
  }
  getId(index: number) {
    return '#' + index;
  }
  selectHive(selectHive: RucheInterface, event: MouseEvent) {
    const arrayFilter = this.arrayHiveSelect.filter(hive => hive.id === selectHive.id);
    if (arrayFilter.length > 0) {
      this.render.removeClass(event.target, 'active');
      const index = this.arrayHiveSelect.indexOf(arrayFilter[0]);
      this.arrayHiveSelect.splice(index, 1);
      let option = this.echartInstance.getOption();
      this.removeHiveStack(selectHive.name);
      this.echartInstance.clear();
      option.series = this.recordService.mergeOptionStackApiary.series;
      option.legend = this.recordService.mergeOptionStackApiary.legend;
      this.echartInstance.setOption(option);
      // this.echartInstance.clear();
    } else {
      this.render.addClass(event.target, 'active');
      this.arrayHiveSelect.push(selectHive);
      this.recordService.setRange({ scale: 15, type: 'DAY' });
      this.recordService.getRecordStackApiaryByIdHive(selectHive.id, selectHive.name, this.recordService.mergeOptionStackApiary).subscribe((data) => {
        this.recordService.mergeOptionStackApiary = data;
      });
    }
  }

  receiveMessage($event) {
    this.message = $event;
  }

/*   getMergeObs() {
    return this.subjectEchart.asObservable();
  } */

   removeHiveStack(hiveName: string) {
    this.recordService.mergeOptionStackApiary.series.filter(serie => hiveName === serie.name.split('-')[0]).forEach(element => {
      const index = this.recordService.mergeOptionStackApiary.series.indexOf(element);
      this.recordService.mergeOptionStackApiary.series.splice(index, 1);
      this.recordService.mergeOptionStackApiary.legend.data.splice(index, 1);
    });
  }
}
