import { StackApiaryGraphService } from './service/stack-apiary-graph.service';
import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { RucheService } from '../../service/api/ruche.service';
import { RucheInterface } from '../../../_model/ruche';
import { RecordService } from '../ruche-rucher/ruche-detail/service/Record/record.service';
import { EChartOption } from 'echarts';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserloggedService } from '../../../userlogged.service';
import { RucherService } from '../../service/api/rucher.service';
import { DataRange } from '../ruche-rucher/ruche-detail/service/Record/data-range';
import { StackService } from './service/stack.service';
import { element } from '@angular/core/src/render3/instructions';
import { resolve } from 'q';
import { AtokenStorageService } from '../../../auth/Service/atoken-storage.service';
import { AdminService } from '../../admin/service/admin.service';
import 'rxjs/add/observable/forkJoin';
import { ObservationService } from '../ruche-rucher/ruche-detail/observation/service/observation.service';
import { Console } from '@angular/core/src/console';
import { UserParamsService } from '../../preference-config/service/user-params.service';
import { RucherModel } from '../../../_model/rucher-model';

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
  private zoomChange: number;
  private subjectEchart: BehaviorSubject<any>;
  message: string;
  constructor(public rucheService: RucheService,
    public rucherService: RucherService,
    private render: Renderer2,
    private userService: UserloggedService,
    public stackApiaryGraph: StackApiaryGraphService,
    public stackService: StackService,
    public recordService: RecordService,
    private adminService: AdminService,
    private tokenService: AtokenStorageService,
    private observationService: ObservationService,
    private userConfig: UserParamsService) {

    /* this.subjectEchart = new BehaviorSubject({}); */
    this.merge = {
      series: [],
      legend: {
        data: []
      }
    };
    this.zoomChange = 0;
    this.ranges = [
      { scale: 3, type: 'DAY' },
      { scale: 7, type: 'DAY' },
      { scale: 15, type: 'DAY' },
      { scale: 30, type: 'DAY' },
      { scale: 3, type: 'MONTH' },
      { scale: 6, type: 'MONTH' },
      { scale: 1, type: 'YEAR' }
    ];
    this.stackService.range = this.ranges[0];
    this.observationService.setRange(this.ranges[0]);
    this.recordService.setRange(this.stackService.range);
    this.message = '';
  }

  onChartInit(e: any) {
    this.echartInstance = e;
  }

  selectAllHive(idApiary: string) {
  }

  ngOnInit() {
    this.userConfig.getSubject().subscribe(
      data => {
        this.recordService.setUnitSystem(data.unitSystem);
      }
    )
    if (!this.rucherService.rucherSubject.closed) {
      if (!this.tokenService.checkAuthorities('ROLE_ADMIN')) {
        this.rucherService.rucherSubject.subscribe(() => { }, () => { }, () => {
          this.rucherService.rucheService.getAllHiveByAccount(this.userService.getUser()).map((hives: RucheInterface[][]) => {
            let allHives = hives.flat();
            console.log(allHives);
            allHives.forEach((elt: RucheInterface) => {
              this.rucherService.findRucherById(elt.idApiary, (apiary: RucherModel[]) => {
                elt.apiaryName = apiary[0].name;
              });
            });
            return allHives;
          }).subscribe(
            hives => {
              console.log(hives);
              this.rucherService.rucheService.ruchesAllApiary = hives;
            },
            (err) => {
              console.log(err);
            }
          )
        });
      } else {
        this.rucherService.rucherSubject.subscribe(() => { }, () => { }, () => {
          this.adminService.getAllHive().map((hives) => {
            hives.forEach(elt => {
              this.rucherService.findRucherById(elt.idApiary, (apiary: RucherModel[]) => {
                try {
                  elt.apiaryName = apiary[0].name;
                } catch (e) { }
              });
            });
            return hives;
          }).subscribe((hives) => {
            this.rucherService.rucheService.ruchesAllApiary = hives;
          });
        });
      }
    }
/*     if (!this.observationService.obsApiarySubject.closed) {
      this.observationService.getObservationByIdApiary(this.rucherService.getCurrentApiary());
    } */
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
    this.loadingStack = true;
    this.recordService.updateMergeStack();
    this.recordService.setRange(this.stackService.range);
    this.observationService.setRange(this.stackService.range);
    const observableRecord = this.stackService.getHiveSelect().filter(hive => hive.id !== '')
    .map(hive => this.recordService.getRecordByIdHive(hive.id, hive.name, this.merge, this.getColor(hive)));
    Observable.forkJoin(observableRecord).subscribe(data => {
       data.map(elt => elt.series).forEach(elt => {
        elt.forEach(element => {
          this.recordService.mergeOptionStackApiary.series.push(element);
        });
      });
      data.map(elt => elt.legend.data).forEach(elt => {
        elt.forEach(element => {
          this.recordService.mergeOptionStackApiary.legend.data.push(element);
        });
      });
/*       this.recordService.mergeOptionStackApiary.series = data.map(elt => elt.series).flat();
      this.recordService.mergeOptionStackApiary.legend.data = data.map(elt => elt.legend.data); */
    },
    (err) => {},
    () => {
      const observableObs = this.stackService.getHiveSelect().filter(hive => hive.id !== '')
      .map(hive => this.observationService.getObservationByIdHive(hive.id, hive.name));
      Observable.forkJoin(observableObs).subscribe(data => {
        this.recordService.mergeOptionStackApiary.series = this.recordService.mergeOptionStackApiary.series.concat(data);
      },
      err => {},
      () => {
        let option = this.echartInstance.getOption();
        this.echartInstance.clear();
        option.series = this.recordService.mergeOptionStackApiary.series;
        option.legend = this.recordService.mergeOptionStackApiary.legend;
        option.legend.show = false;
        this.echartInstance.setOption(option);
        this.loadingStack = false;
      });
    });
  }

  selectHive(selectHive: RucheInterface, event: MouseEvent) {
    if (!this.loadingStack) {
      this.loadingStack = true;
      const arrayFilter = this.stackService.getHiveSelect().filter(hive => hive.id === selectHive.id);
      if (arrayFilter.length > 0) {
        this.stackService.removeHive(arrayFilter[0]);
        let option = this.echartInstance.getOption();
        this.removeHiveStack(selectHive.name);
        this.echartInstance.clear();
        option.series = this.recordService.mergeOptionStackApiary.series;
        option.legend = this.recordService.mergeOptionStackApiary.legend;
        this.echartInstance.setOption(option);
        this.loadingStack = false;
      } else {
        this.loadingStack = true;
        this.stackService.addHive(selectHive);
        this.stackService.addColorForObs(selectHive, this.getColor(selectHive));
        this.recordService.setRange(this.stackService.range);
        this.recordService.getRecordByIdHive(selectHive.id, selectHive.name,
          this.recordService.mergeOptionStackApiary, this.getColor(selectHive))
          .subscribe((data) => {
            console.log(data);
            // this.recordService.mergeOptionStackApiary = data;
             this.observationService.getObservationByIdHive(selectHive.id, selectHive.name).subscribe(
              obsData => {
                data.series.push(obsData);
                data.legend.data.push(selectHive.name + ' / note');
                this.recordService.mergeOptionStackApiary = data;

              }
            );
            this.recordService.mergeOptionStackApiary.series.push(this.observationService.mergeStackObsApiary);
            this.recordService.mergeOptionStackApiary.series.push(this.observationService.mergeStackObsHIve);
          }, () => { }, () => {
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

  onZoom(event: any) {
    console.log(this.zoomChange);
    if (event.batch[0].end === 100 && event.batch[0].start === 0) {
      this.zoomChange ++;
    } else {
      this.zoomChange --;
    }
    if (this.zoomChange > 1) {
    }
  }

  getColor(hive: RucheInterface): string {
    return this.stackService.getColorByIndex(this.rucherService.rucheService.ruchesAllApiary.map(elt => elt.id).indexOf(hive.id), hive);
  }


  /*   getMergeObs() {
      return this.subjectEchart.asObservable();
    } */

  removeHiveStack(hiveName: string) {
    this.recordService.mergeOptionStackApiary.series.filter(serie => hiveName === serie.name.split(' / ')[0]).forEach(element => {
      const index = this.recordService.mergeOptionStackApiary.series.map(res => res.name).indexOf(element.name);
      this.recordService.mergeOptionStackApiary.series.splice(index, 1);
      this.recordService.mergeOptionStackApiary.legend.data.splice(index, 1);
    });
  }

  traduction(type : any) : String{
    var texte : String;
    switch (type) {
        case 'DAY' : {
            texte = this.userService.getJwtReponse().country === "FR" ? 'jours' : 'days';
            break;
        }
        case 'MONTH' : {
            texte = this.userService.getJwtReponse().country === "FR" ? 'mois' : 'months';
            break;
        }
        case 'YEAR' : {
            texte = this.userService.getJwtReponse().country === "FR" ? 'an' : 'year';
            break;
        }
        default: {
            texte = 'Erreur traduction';
        }
    }

    return(texte);
}

}
