import { Component, OnInit, Renderer2 } from '@angular/core';
import { CalendarTemplateService } from './service/calendar-template.service';
import { ECharts } from 'echarts';
import { RucherService } from '../apiary/ruche-rucher/rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { RucheInterface } from '../../_model/ruche';
import { DailyRecordsWService } from '../apiary/ruche-rucher/ruche-detail/service/daily-records-w.service';
import { MelliChartsService } from './service/melli-charts.service';

@Component({
  selector: 'app-melli-charts',
  templateUrl: './melli-charts.component.html',
  styleUrls: ['./melli-charts.component.css']
})
export class MelliChartsComponent implements OnInit {

  public echartInstance: ECharts;
  private currentHiveItem: EventTarget;
  private currentType: EventTarget;
  private hiveSelect: RucheInterface;
  private typeChart: string;
  private loading: boolean;

  constructor(
    public templateCalendar: CalendarTemplateService,
    public rucherService: RucherService,
    private userService: UserloggedService,
    public melliService: MelliChartsService,
    public dailyRecordWService: DailyRecordsWService,
    private renderer: Renderer2) {
    this.loading = false;
    this.currentHiveItem = null;
    this.currentType = null;
    this.typeChart = null;
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
    console.log(this.echartInstance);
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
    this.hiveSelect = hive;
    if (this.currentType !== null) {
      this.setData();
    }
  }
  public selectType(event: MouseEvent, type: string) {
    this.typeChart = type;
    if (this.currentType !== null && this.currentType !== event.target) {
      this.renderer.removeClass(this.currentType, 'type-active');
      this.currentType = event.target;
      this.renderer.addClass(this.currentType, 'type-active');
      this.setData();
    } else if (this.currentType === null) {
      this.currentType = event.target;
      this.renderer.addClass(this.currentType, 'type-active');
      this.setData();
    }
  }

  setData() {
    this.loading = true;
    this.dailyRecordWService.getDailyRecordWByHive(this.hiveSelect.id, this.hiveSelect.name).subscribe(
      data => {
        this.melliService.setMerge(data[this.typeChart]);
        const options = this.echartInstance.getOption();
        options.series = this.melliService.getMerge().series;
        this.echartInstance.clear();
        this.echartInstance.setOption(options);
        console.log(this.melliService.getMerge());
        console.log(this.echartInstance.getOption());
      },
      err => {},
      () => {
        this.loading = false;
      }
    );
  }
}
