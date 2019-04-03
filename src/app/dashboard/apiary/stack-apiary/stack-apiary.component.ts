import { StackApiaryGraphService } from './service/stack-apiary-graph.service';
import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { RucheService } from '../../service/ruche.service';
import { RucheInterface } from '../../../_model/ruche';
import { RecordService } from '../ruche-rucher/ruche-detail/service/Record/record.service';
import { EChartOption } from 'echarts';
import { BehaviorSubject } from 'rxjs';
import { UserloggedService } from '../../../userlogged.service';
import { RucherService } from '../ruche-rucher/rucher.service';
import { DataRange } from '../ruche-rucher/ruche-detail/service/Record/data-range';
import { StackService } from './service/stack.service';
import { element } from '@angular/core/src/render3/instructions';
import { resolve } from 'q';
import { AtokenStorageService } from '../../../auth/Service/atoken-storage.service';
import { AdminService } from '../../admin/service/admin.service';
/* import * as echarts from 'echarts'; */

@Component({
  selector: 'app-stack-apiary',
  templateUrl: './stack-apiary.component.html',
  styleUrls: ['./stack-apiary.component.css']
})
export class StackApiaryComponent implements OnInit {

  private echartInstance: any;
  public merge: any;
  public loadingStack: boolean;
  public ranges: DataRange[];
  private subjectEchart: BehaviorSubject<any>;
  message: string;
  constructor(public rucheService: RucheService,
    public rucherService: RucherService,
    private render: Renderer2,
    private userService: UserloggedService,
    public stackApiaryGraph: StackApiaryGraphService,
    public stackService: StackService,
    public recordService: RecordService,
    private adminService:AdminService,
    private tokenService: AtokenStorageService) {
    /* this.subjectEchart = new BehaviorSubject({}); */
    this.merge = {
      series: [],
      legend: {
        data: []
      }
    };
    this.ranges = [
      { scale: 15, type: 'DAY' },
      { scale: 30, type: 'DAY' },
      { scale: 3, type: 'MONTH' },
      { scale: 6, type: 'MONTH' },
      { scale: 1, type: 'YEAR' }
    ];
    this.stackService.range = this.ranges[0];
    this.recordService.setRange(this.stackService.range);
    this.message = '';
  }

  onChartInit(e: any) {
    this.echartInstance = e;
  }

  selectAllHive(idApiary: string) {
  }

  ngOnInit() {
    if (!this.rucherService.rucherSubject.closed) {
      if (!this.tokenService.checkAuthorities('ROLE_ADMIN')) {
        this.rucherService.rucherSubject.subscribe(() => { }, () => {}, () => {
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
      } else {
        this.rucherService.rucherSubject.subscribe(() => { }, () => { }, () => {
          this.adminService.getAllHive().map((hives) => {
            hives.forEach(elt => {
              this.rucherService.findRucherById(elt.idApiary, (apiary) => {
                try {
                  elt.apiaryName = apiary[0].name;
                } catch (e) {}
              });
            });
            return hives;
          }).subscribe((hives) => {
            console.log(hives);
            this.rucherService.rucheService.ruchesAllApiary = hives;
          });
        });
      }
    }
  }
  getHiveByApiary(idApiary: string) {
    try {
      return this.rucherService.rucheService.ruchesAllApiary.filter(hive => hive.idApiary === idApiary);
    } catch (e) {
      return false;
    }
  }
  getId(index: number) {
    return '#' + index;
  }
  selectRange() {
    let tmpSerieDone = 0;
    this.loadingStack = true;
    this.recordService.mergeOptionStackApiary = this.merge;
    this.recordService.setRange(this.stackService.range);
    console.log(this.stackService.getHiveSelect());
      this.stackService.getHiveSelect().filter(res => res.id !== '').forEach((element, index) => {
        this.recordService.getRecordByIdHive(element.id, element.name, 
          this.recordService.mergeOptionStackApiary, false,  this.getColor(element))
        .subscribe((data) => {
          console.log(data);
          this.recordService.mergeOptionStackApiary = data;
        }, (err) => {
          console.log(err);
        }, () => {
          tmpSerieDone ++;
          if (tmpSerieDone === this.stackService.getHiveSelect().filter(res => res.id !== '').length) {
            console.log(this.recordService.mergeOptionStackApiary);
            this.loadingStack = false;
          }
        });
      });

  }

  selectHive(selectHive: RucheInterface, event: MouseEvent) {
    if (!this.loadingStack) {
      this.loadingStack = true;
      const arrayFilter = this.stackService.getHiveSelect().filter(hive => hive.id === selectHive.id);
      if (arrayFilter.length > 0) {
        // this.render.removeClass(event.target, 'active');
        /* this.render.removeStyle(event.target, 'background-color'); */
        console.log(arrayFilter);
        this.stackService.removeHive(arrayFilter[0]);
        let option = this.echartInstance.getOption();
        this.removeHiveStack(selectHive.name);
        // console.log(this.recordService.mergeOptionStackApiary);
        this.echartInstance.clear();
        option.series = this.recordService.mergeOptionStackApiary.series;
        option.legend = this.recordService.mergeOptionStackApiary.legend;
        this.echartInstance.setOption(option);
        this.loadingStack = false;
        console.log(this.stackService.getHiveSelect());
        // this.echartInstance.clear();
      } else {
        this.loadingStack = true;
        this.stackService.addHive(selectHive);
        this.recordService.setRange(this.stackService.range);
        this.recordService.getRecordByIdHive(selectHive.id, selectHive.name,
          this.recordService.mergeOptionStackApiary, false, this.getColor(selectHive))
        .subscribe((data) => {
          this.recordService.mergeOptionStackApiary = data;
        },() => {}, () => {
          this.loadingStack = false;
        });
      }
    }
  }
  checkLoadingDone() {
    return !this.loadingStack ? 'complete' : 'loading';
  }

  receiveMessage($event) {
    this.message = $event;
  }

  getColor(hive: RucheInterface): string {
    return this.stackService.getColorByIndex(this.rucherService.rucheService.ruchesAllApiary.map(elt => elt.id).indexOf(hive.id), hive);
  }

  /*   getMergeObs() {
      return this.subjectEchart.asObservable();
    } */

  removeHiveStack(hiveName: string) {
    console.log(hiveName);
    this.recordService.mergeOptionStackApiary.series.filter(serie => hiveName === serie.name.split(' / ')[0]).forEach(element => {
      const index = this.recordService.mergeOptionStackApiary.series.map(res => {
        console.log(res);
        return res.name;
      }).indexOf(element.name);
      console.log(index);
      this.recordService.mergeOptionStackApiary.series.splice(index, 1);
      this.recordService.mergeOptionStackApiary.legend.data.splice(index, 1);
      console.log(this.recordService.mergeOptionStackApiary);
      
    });
  }
}
