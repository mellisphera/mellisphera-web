import { Component, OnInit, Renderer2, AfterViewChecked, AfterViewInit } from '@angular/core';
import { MelliChartsDateService } from '../service/melli-charts-date.service';
import { MelliChartsHiveService } from '../service/melli-charts-hive.service';
import { DailyManagerService } from './service/daily-manager.service';
import { HourlyManagerService } from './service/hourly-manager.service';

const HOURLY = 'HOURLY';
const DAILY = 'DAILY';

@Component({
  selector: 'app-hive',
  templateUrl: './hive.component.html',
  styleUrls: ['./hive.component.css']
})
export class HiveComponent implements OnInit,AfterViewInit {

  public typeData: Array<any>;
  private currentEltTypeDaily: HTMLElement;
  private currentEltTypeHourly: HTMLElement;
  private currentTypeDaily: any;
  private currentTypeHourly: any;
  constructor(private melliDate: MelliChartsDateService, 
    private melliHive: MelliChartsHiveService,
    public dailyManager: DailyManagerService,
    public hourlyManager: HourlyManagerService,
    private renderer: Renderer2) {
      this.typeData = [
        { name: 'WINCOME', id: 'WINCOME_DAILY', type: 'DAILY', class: 'item-type active'},
        { name: 'TEMP_INT_MAX', id: 'TEMP_INT_MAX_DAILY', type: 'DAILY', class: 'item-type'},
        { name: 'TEMP_INT_MIN', id: 'TEMP_INT_MIN_DAILY', type: 'DAILY', class: 'item-type'},
        { name: 'HRIN', id: 'HRIN_DAILY', type: 'DAILY', class: 'item-type'},
        { name: 'BROOD', id:'BROOD_DAILY',  type: 'DAILY', class: 'item-type'},

        { name: 'WINCOME', id:'WINCOME_HOURLY', type:'HOURLY', class: 'item-type active'},
        { name: 'TEMP_INT_MAX', id: 'TEMP_INT_MAX_HOURLY', type:'HOURLY', class: 'item-type'},
        { name: 'TEMP_INT_MIN', id: 'TEMP_INT_MIN_HOURLY', type:'HOURLY', class: 'item-type'},
        { name: 'HRIN', id: 'HRIN_HOURLY', type:'HOURLY', class: 'item-type'},
        { name: 'BROOD', id: 'BROOD_HOURKY', type:'HOURLY', class: 'item-type'},
        { name: 'BAT', id:'BAT_HOURLY', type:'HOURLY', class: 'item-type'}
      ];
      this.currentTypeDaily = this.typeData[0];
      this.currentTypeHourly = this.typeData[5];
    }

  ngOnInit() {
    // this.dailyManager.getWeightincome(this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest());
  }


  ngAfterViewInit(): void {
    this.currentEltTypeDaily = document.getElementById(this.currentTypeDaily.id);
    this.currentEltTypeHourly = document.getElementById(this.currentTypeHourly.id);
    
  }
  newHive(): void{
/*     console.log(this.melliHive.getHiveSelect());
    switch(this.currentType){
      case WEIGHT:
        this.dailyManager.getChartWeightincome(this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest());
        this.hourlyManager.getChartWeight(this.melliHive.getHiveSelect().id, this.melliHive.getHourlyChartInstance(), this.melliDate.getRangeForReqest());
        break;
      case TEMPERATURE:
        break;
      case COUVAIN:
        break;
      case HUMIDITY:
        break;
      default:
        break;
    } */
  }
  
  setType(type: any): void {
    if (type.type === DAILY) {
      console.log(type.id +'==='+ this.currentTypeDaily.id);
      if (type.id !== this.currentTypeDaily.id) {
        this.renderer.removeClass(this.currentEltTypeDaily, 'active');
        this.currentEltTypeDaily = document.getElementById(type.id);
        console.log(document.getElementById(type.id));
        this.renderer.addClass(this.currentEltTypeDaily, 'active');
      }
    } else {
      if (type.id !== this.currentTypeHourly.id) {
        this.renderer.removeClass(this.currentEltTypeHourly, 'active');
        this.currentEltTypeHourly = document.getElementById(type.id);
        console.log(document.getElementById(type.id));
        this.renderer.addClass(this.currentEltTypeHourly, 'active');
      }
    }
  }

  setRangeChart() {
    let options = this.melliHive.getDailyChartInstance().getOption();
    options.calendar[0].range = this.melliDate.getRangeForReqest();
    console.log(options);
    this.melliHive.getDailyChartInstance().clear();
    this.melliHive.getDailyChartInstance().setOption(options);
    this.hourlyManager.getChartWeight(this.melliHive.getHiveSelect().id, this.melliHive.getHourlyChartInstance(), this.melliDate.getRangeForReqest());

  }

  onDailyChartInit(event: any): void {
    this.melliHive.setDailyChartInstance(event);
    console.log(this.melliHive.getDailyChartInstance());
  }

  onHourlyChartInit(event: any) {
    this.melliHive.setHourlyChartInstnace(event);
  }

  getlabelByType(type: string): Array<any> {
    return this.typeData.filter(_filter => _filter.type === type);
  }

}
