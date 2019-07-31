import { Component, OnInit, Renderer2, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';
import { RucheService } from '../service/api/ruche.service';
import { RucherService } from '../service/api/rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { StackApiaryGraphService } from '../apiary/stack-apiary/service/stack-apiary-graph.service';
import { StackService } from '../apiary/stack-apiary/service/stack.service';
import { RecordService } from '../service/api/record.service';
import { AdminService } from '../admin/service/admin.service';
import { AtokenStorageService } from '../../auth/Service/atoken-storage.service';
import { UserParamsService } from '../preference-config/service/user-params.service';
import { RucheInterface } from '../../_model/ruche';
import { RucherModel } from '../../_model/rucher-model';
import { MelliChartsDateService } from './service/melli-charts-date.service';
import { DataRange } from '../../_model/data-range';
import { Router } from '@angular/router';
import { MelliChartsHiveService } from './service/melli-charts-hive.service';
import { HiveComponent } from './hive/hive.component';
import { DailyRecordsWService } from '../service/api/daily-records-w.service';
import { DailyRecordService } from '../service/api/dailyRecordService';
import { DailyStockHoneyService } from '../service/api/daily-stock-honey.service';
import { WeatherService } from '../service/api/weather.service';
import { StackMelliChartsService } from './stack/service/stack-melli-charts.service';
import { StackComponent } from './stack/stack.component';

const PREFIX_PATH = '/dashboard/melli-charts/';
@Component({
  selector: 'app-melli-charts',
  templateUrl: './melli-charts.component.html',
  styleUrls: ['./melli-charts.component.css']
})
export class MelliChartsComponent implements OnInit, AfterViewInit {


  public btnNav: Array<Object>;
  private btnTypeElement: HTMLElement;
  public typeNav: Array<Object>;

  hiveComponent: HiveComponent;
  stackComponent: StackComponent;
  private eltOnClick: EventTarget;
  constructor(public rucheService: RucheService,
    public rucherService: RucherService,
    private userService: UserloggedService,
    private renderer: Renderer2,
    private router: Router,
    private dailyRecordThService: DailyRecordService,
    private dailyRecordWservice: DailyRecordsWService,
    private dailyStockHoneyService: DailyStockHoneyService,
    public melliChartDate: MelliChartsDateService,
    private stackService: StackMelliChartsService,
    public melliChartHive: MelliChartsHiveService,
    public recordService: RecordService,
    private adminService: AdminService,
    private weatherService: WeatherService,
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
        this.recordService.setUnitSystem(data.unitSystem);
        this.dailyRecordThService.setUnitSystem(data.unitSystem);
        this.dailyRecordWservice.setUnitSystem(data.unitSystem);
        this.dailyStockHoneyService.setUnitSystem(data.unitSystem);
        this.weatherService.setUnitSystem(data.unitSystem);
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
            },
            err => {
              console.log(err);
            },
            () => {
              this.hiveComponent.loadDataFromHive();
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

  ngAfterViewInit(): void {
    this.eltOnClick = document.getElementById('hive');
    this.renderer.addClass(this.eltOnClick, 'nav-active');  
  }



  /**
   *
   *
   * @memberof MelliChartsComponent
   */
  nextDate(): void {
    
  }

  /**
   *
   *
   * @memberof MelliChartsComponent
   */
  previousDate(): void {

  }


  /**
   *
   *
   * @param {DataRange} rangeSelect
   * @memberof MelliChartsComponent
   */
  setRangeSelect(rangeSelect: DataRange): void {
    this.melliChartDate.setRange(rangeSelect);
    if (this.router.url === PREFIX_PATH + 'hive') {
      this.hiveComponent.setRangeChart();
    } else {
      this.stackComponent.loadAfterRangeChanged((options: any) => {
        this.stackService.getEchartInstance().setOption(options, true);
        this.stackService.getEchartInstance().hideLoading();
      });
    }
  }

  getHiveByApiary(idApiary: string): RucheInterface[] | boolean {
    try {
      return this.rucherService.rucheService.ruchesAllApiary.filter(hive => hive.idApiary === idApiary);
    } catch (e) {
      return false;
    }
  }

  onActivate(componentRef: Component) {
    if (componentRef instanceof HiveComponent) {
      this.hiveComponent = componentRef;
    } else if(componentRef instanceof StackComponent) {
      this.stackComponent = componentRef;
    }

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
    let start = this.melliChartDate.start;
    let end = this.melliChartDate.end;
    this.melliChartDate.setRangeForRequest([start, end]);
    if (this.router.url === PREFIX_PATH + 'hive') {
      this.hiveComponent.setRangeChart();
    } else {
      this.stackComponent.loadAfterRangeChanged((options: any) => {
        this.stackService.getEchartInstance().setOption(options, true);
        this.stackService.getEchartInstance().hideLoading();
      });
    }
  }


  /**
   *
   *
   * @param {string} path
   * @memberof MelliChartsComponent
   */
  navToPage(path: string, id: string): void {
    console.log(id);
    if (this.eltOnClick === null ) {
      this.eltOnClick = document.getElementById(id);
      this.renderer.addClass(this.eltOnClick, 'nav-active');
    } else {
      this.renderer.removeClass(this.eltOnClick, 'nav-active');
      this.eltOnClick = document.getElementById(id);
      this.renderer.addClass(this.eltOnClick, 'nav-active');
    }
    this.router.navigateByUrl(PREFIX_PATH + path);
  }


  /**
   *
   *
   * @param {RucheInterface} hive
   * @param {MouseEvent} event
   * @memberof MelliChartsComponent
   */
  selectHive(hive: RucheInterface, event: MouseEvent): void {
    switch (this.router.url) {
      case PREFIX_PATH + 'hive':
        if (!this.hiveComponent.hourlyComponent.chartLoading) {
          this.melliChartHive.setHiveSelect(hive);
          this.hiveComponent.loadDataFromHive();
        }
        break;
      case PREFIX_PATH + 'stack':
        if (this.stackService.ifActiveAlreadySelected(hive)) {
          this.stackService.removeHive(hive);
          this.stackComponent.removeHiveSerie(hive);
        } else {
          this.stackService.addHive(hive);
          this.stackComponent.loadDataByHive(hive);
          console.log(this.stackService.getHiveSelect());
        }
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

  /**
   *
   *
   * @param {RucheInterface} hive
   * @returns {string}
   * @memberof MelliChartsComponent
   */
  getColor(hive: RucheInterface): string {
    switch (this.router.url) {
      case PREFIX_PATH + 'hive':
        return this.melliChartHive.getColorByIndex(this.rucherService.rucheService.ruchesAllApiary.map(elt => elt.id).indexOf(hive.id), hive);
        break;
      case PREFIX_PATH + 'stack':
        return this.stackService.getColorByIndex(this.rucherService.rucheService.ruchesAllApiary.map(elt => elt.id).indexOf(hive.id), hive);
        break;
    }
  }
  /**
   *
   *
   * @param {string} idApiary
   * @returns {string}
   * @memberof MelliChartsComponent
   */
  checkApiaryIfAcive(idApiary: string): string {
    switch (this.router.url) {
      case PREFIX_PATH + 'hive':
          try {
            if (this.melliChartHive.getHiveSelect().idApiary === idApiary) {
              return 'apiary-active';
            } else {
              return 'not-active';
            }
          } catch (TypeError) {
          }
      case PREFIX_PATH + 'stack':
        // return this.stackService.
        break;
    }
  }


  checkLoadindingIsComplete(): string {
    switch (this.router.url) {
      case PREFIX_PATH + 'hive':
          return this.hiveComponent.hourlyComponent.chartLoading ? 'loading' : 'complete';
      case PREFIX_PATH + 'stack':
        //return this.stackService.
        break;
    }
  }

}
