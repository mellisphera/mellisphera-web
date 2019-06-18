import { Component, OnInit, Renderer2 } from '@angular/core';
import { CalendarTemplateService } from './service/calendar-template.service';
import { ECharts } from 'echarts';
import { RucherService } from '../service/rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { RucheInterface } from '../../_model/ruche';
import { DailyRecordsWService } from '../apiary/ruche-rucher/ruche-detail/service/daily-records-w.service';
import { MelliChartsService } from './service/melli-charts.service';
import { DailyRecordService } from '../service/dailyRecordService';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'app-melli-charts',
  templateUrl: './melli-charts.component.html',
  styleUrls: ['./melli-charts.component.css']
})
export class MelliChartsComponent implements OnInit {

  public echartInstance: ECharts;
  private currentHiveItem: EventTarget;
  private currentTypeElt: EventTarget;
  private hiveSelect: RucheInterface;
  private typeStrChart: string;
  public loading: boolean;

  constructor(
    public templateCalendar: CalendarTemplateService,
    public rucherService: RucherService,
    private userService: UserloggedService,
    public melliService: MelliChartsService,
    public dailyReccordThService: DailyRecordService,
    public dailyRecordWService: DailyRecordsWService,
    private renderer: Renderer2) {
    this.loading = false;
    this.currentHiveItem = null;
    this.currentTypeElt = null;
    this.hiveSelect = {
      id: null,
      name: '',
      description: '',
      username: '',
      idApiary: '',
      apiaryName: '',
      idUsername: '',
      hivePosX: '',
      hivePosY: '',
      sharingUser: []
    };
    this.typeStrChart = null;
    this.rucherService.rucheService.getRucheByUsername(this.userService.getUser()).subscribe(
      data => {
        this.rucherService.rucheService.ruchesAllApiary = data;
      }
    );
  }

  ngOnInit() {
  }

  public onChartInit(event: ECharts) {
    this.echartInstance = event;
  }

  public onSelectHive(event: MouseEvent, hive: RucheInterface) {
    if (this.currentHiveItem !== null && event.target !== this.currentHiveItem) {
      this.renderer.removeClass(this.currentHiveItem, 'hive-active');
      this.currentHiveItem = event.target;
      this.renderer.addClass(this.currentHiveItem, 'hive-active');
    } else if (this.currentHiveItem === null) {
      this.currentHiveItem = event.target;
      this.renderer.addClass(this.currentHiveItem, 'hive-active');
    }
    if (this.typeStrChart != null) { // Si un type à été selectionné
      if (this.hiveSelect.id !== hive.id) { // si la ruche est differente de la précedente
        this.hiveSelect = hive;
        this.setData();
      }
    } else {
      this.hiveSelect = hive;
    }
  }
  public selectType(event: MouseEvent, type: string) {
    this.typeStrChart = type;
    /* Si je n'ai pas de type et qu'il est different du précédent */
    if (this.currentTypeElt !== null && this.currentTypeElt !== event.target) {
      this.renderer.removeClass(this.currentTypeElt, 'type-active');
      this.currentTypeElt = event.target;
      this.renderer.addClass(this.currentTypeElt, 'type-active');
    } else if (this.currentTypeElt === null) {
      this.currentTypeElt = event.target;
      this.renderer.addClass(this.currentTypeElt, 'type-active');
    }
    /* Si une ruche est séléctionné ET que aucune donnée n'existe la concernant */
    if (this.currentHiveItem !== null && this.melliService.getMergeAllData() !== null) {
      this.melliService.setMerge(this.melliService.getMergeAllData()[this.typeStrChart]);
    } else if (this.currentHiveItem !== null) {
      this.setData();
    }
    this.refreshDataGraph();
  }

  refreshDataGraph(): void {
    const options = this.echartInstance.getOption();
    options.series = this.melliService.getMerge().series;
    options.tooltip = this.melliService.getMerge().tooltip;
    options.legend = this.melliService.getMerge().legend;
    options.visualMap = this.melliService.getMerge().visualMap;
    this.echartInstance.clear();
    this.echartInstance.setOption(options);
  }


  setRangeCalendar(): void {
    const options = this.echartInstance.getOption();
    options.calendar[0].range = [this.melliService.startCalendar, this.melliService.endCalendar];
    this.echartInstance.clear();
    this.echartInstance.setOption(options);
  }
  setData(): void {
    this.loading = true;
/*     const obsData = [
      this.dailyRecordWService.getDailyRecordWByHive(this.hiveSelect.id, this.hiveSelect.name),
      this.dailyReccordThService.getByHive(this.hiveSelect.id)
    ];
    console.log(obsData);
    Observable.forkJoin(obsData).flatMap(res => {
      console.log(res);
      return res;
    }).subscribe(
      data => {
        console.log(data);
      }
    ); */
    this.dailyRecordWService.getDailyRecordWByHive(this.hiveSelect.id, this.hiveSelect.name).subscribe(
      data => {
        this.melliService.setMergeAllData(data);
        this.melliService.setMerge(data[this.typeStrChart]);
        this.refreshDataGraph();
      },
      err => { },
      () => {
        this.loading = false;
      }
    );
  }
}
