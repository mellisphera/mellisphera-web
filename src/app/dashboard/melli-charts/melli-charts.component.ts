import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RucheService } from '../service/api/ruche.service';
import { RucherService } from '../service/api/rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { StackApiaryGraphService } from '../apiary/stack-apiary/service/stack-apiary-graph.service';
import { StackService } from '../apiary/stack-apiary/service/stack.service';
import { RecordService } from '../apiary/ruche-rucher/ruche-detail/service/Record/record.service';
import { AdminService } from '../admin/service/admin.service';
import { AtokenStorageService } from '../../auth/Service/atoken-storage.service';
import { UserParamsService } from '../preference-config/service/user-params.service';
import { RucheInterface } from '../../_model/ruche';
import { RucherModel } from '../../_model/rucher-model';
import { MelliChartsDateService } from './service/melli-charts-date.service';
import { DataRange } from '../apiary/ruche-rucher/ruche-detail/service/Record/data-range';
import { Router } from '@angular/router';
import { MelliChartsHiveService } from './service/melli-charts-hive.service';
import { HiveComponent } from './hive/hive.component';

const PREFIX_PATH = '/dashboard/melli-charts/';
@Component({
  selector: 'app-melli-charts',
  templateUrl: './melli-charts.component.html',
  styleUrls: ['./melli-charts.component.css']
})
export class MelliChartsComponent implements OnInit {


  public btnNav: Array<Object>;
  private btnTypeElement: HTMLElement;
  public typeNav: Array<Object>;

  hiveComponent: HiveComponent;

  constructor(public rucheService: RucheService,
    public rucherService: RucherService,
    private userService: UserloggedService,
    private router: Router,
    public melliChartDate: MelliChartsDateService,
    public melliChartHive: MelliChartsHiveService,
    public recordService: RecordService,
    private adminService: AdminService,
    private tokenService: AtokenStorageService,
    private userConfig: UserParamsService) {
    this.btnNav = [
      { name: 'Vitality', path: 'vitality' },
      { name: 'Map', path: 'map' },
      { name: 'Hives', path: 'hive' },
      { name: 'Stack', path: 'stack' }
    ];
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
            this.melliChartHive.setHiveSelect(allHives[0]);
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
    this.router.navigateByUrl(PREFIX_PATH + 'hive');
  }

  /**
   *
   *
   * @param {DataRange} rangeSelect
   * @memberof MelliChartsComponent
   */
  setRangeSelect(rangeSelect: DataRange): void {
    this.melliChartDate.setRange(rangeSelect);
    this.hiveComponent.setRangeChart();
  }

  getHiveByApiary(idApiary: string): RucheInterface[] | boolean {
    try {
      return this.rucherService.rucheService.ruchesAllApiary.filter(hive => hive.idApiary === idApiary);
    } catch (e) {
      return false;
    }
  }

  onActivate(componentRef) {
    this.hiveComponent = componentRef;
  }


  /**
   *
   *
   * @param {string} type
   * @returns {Array<DataRange>}
   * @memberof MelliChartsComponent
   */
  getRangeByType(type: string): Array<DataRange> {
    return this.melliChartDate.ranges.filter(elt => elt.type === type || elt.type === type + 'S');
  }

  setDateFromInput(): void {
  }


  navToPage(path: string) {
    this.router.navigateByUrl(PREFIX_PATH + path);
  }


  selectHive(hive: RucheInterface, event: MouseEvent) {
    this.melliChartHive.setHiveSelect(hive);
    this.nextByRoute();

  }


  nextByRoute() {
    console.log(this.router.url);
     switch(this.router.url){
      case PREFIX_PATH + 'hive':
        this.hiveComponent.loadDailyData();
        this.hiveComponent.loadHourlyData();
      break;
    }
  }
  /**
   *
   *
   * @returns {string}
   * @memberof MelliChartsComponent
   */
  getStartDate(): string {
    return new Date(this.melliChartDate.start).toISOString().substring(0, 10);
  }


  /**
   *
   *
   * @returns {string}
   * @memberof MelliChartsComponent
   */
  getEndDate(): string {
    return new Date(this.melliChartDate.end).toISOString().substring(0, 10);
  }

  getColor(hive: RucheInterface): string {
    return this.melliChartHive.getColorByIndex(this.rucherService.rucheService.ruchesAllApiary.map(elt => elt.id).indexOf(hive.id), hive);
  }

}
