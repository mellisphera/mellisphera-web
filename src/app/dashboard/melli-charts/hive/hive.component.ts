import { Component, OnInit, Renderer2, AfterViewChecked } from '@angular/core';
import { MelliChartsDateService } from '../service/melli-charts-date.service';
import { MelliChartsHiveService } from '../service/melli-charts-hive.service';
import { DailyManagerService } from './service/daily-manager.service';
import { HourlyManagerService } from './service/hourly-manager.service';

const WEIGHT = 'WEIGHT';
const TEMPERATURE = 'TEMPERATURE';
const COUVAIN = 'COUVAIN';
const HUMIDITY = 'HUMIDITY';

@Component({
  selector: 'app-hive',
  templateUrl: './hive.component.html',
  styleUrls: ['./hive.component.css']
})
export class HiveComponent implements OnInit,AfterViewChecked {

  public typeData: Array<Object>;
  private currentEltType: HTMLElement;
  private currentType: string;
  constructor(private melliDate: MelliChartsDateService, 
    private melliHive: MelliChartsHiveService,
    public dailyManager: DailyManagerService,
    public hourlyManager: HourlyManagerService,
    private renderer: Renderer2) {
      this.currentType = 'WEIGHT';
      this.typeData = [
        { name: 'WEIGHT', class: 'item-type active'},
        { name: 'TEMPERATURE', class: 'item-type'},
        { name: 'COUVAIN', class: 'item-type'},
        { name: 'HUMIDITY', class: 'item-type'}
      ];
    }

  ngOnInit() {
  }


  ngAfterViewChecked(): void {
    this.currentEltType = document.getElementById(this.currentType);
  }
  newHive(): void{
    console.log(this.melliHive.getHiveSelect());
    switch(this.currentType){
      case WEIGHT:
        this.dailyManager.getWeightincome(this.melliHive.getHiveSelect().id, this.melliHive.getChartInstance(), this.melliDate.getRangeForReqest());
        break;
      case TEMPERATURE:
        break;
      case COUVAIN:
        break;
      case HUMIDITY:
        break;
      default:
        break;
    }
  }
  
  setType(type: string): void {
    if ((type === this.currentType) !== true) {
      this.currentType = type;
      this.renderer.removeClass(this.currentEltType, 'active');
      this.currentEltType = document.getElementById(this.currentType);
      this.renderer.addClass(this.currentEltType, 'active');
    } else {

    }
  }

  setRangeChart() {
    let options = this.melliHive.getChartInstance().getOption();
    options.calendar[0].range = this.melliDate.getRangeForReqest();
    console.log(options);
    this.melliHive.getChartInstance().clear();
    this.melliHive.getChartInstance().setOption(options);
  }

  onChartInit(event: any): void {
    this.melliHive.setChartInstance(event);
    console.log(this.melliHive.getChartInstance());
  }

}
