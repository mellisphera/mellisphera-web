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
export class HiveComponent implements OnInit, AfterViewInit {

  public typeData: Array<any>;
  private currentEltTypeDaily: HTMLElement;
  private currentEltTypeHourly: HTMLElement;
  private currentTypeDaily: any;
  private currentTypeHourly: Array<any>;
  constructor(private melliDate: MelliChartsDateService,
    private melliHive: MelliChartsHiveService,
    public dailyManager: DailyManagerService,
    public hourlyManager: HourlyManagerService,
    private renderer: Renderer2) {
    this.typeData = [
      { name: 'WINCOME', id: 'WINCOME_DAILY', type: 'DAILY', class: 'item-type active' },
      { name: 'TEMP_INT_MAX', id: 'TEMP_INT_MAX_DAILY', type: 'DAILY', class: 'item-type' },
      { name: 'TEMP_INT_MIN', id: 'TEMP_INT_MIN_DAILY', type: 'DAILY', class: 'item-type' },
      { name: 'TEMP_EXT_MAX', id: 'TEMP_EXT_MAX_DAILY', type: 'DAILY', class: 'item-type' },
      { name: 'TEMP_EXT_MIN', id: 'TEMP_EXT_MIN_DAILY', type: 'DAILY', class: 'item-type' },
      { name: 'WEATHER', id: 'WHEATHER_DAILY', type: 'DAILY', class: 'item-type' },
      { name: 'WEIGHT_MAX', id: 'WEIGHT_MAX_DAILY', type: 'DAILY', class: 'item-type' },
      { name: 'HRIN', id: 'HRIN_DAILY', type: 'DAILY', class: 'item-type' },
      { name: 'BROOD', id: 'BROOD_DAILY', type: 'DAILY', class: 'item-type' },
      { name: 'ASTRO', id: 'ASTRO_DAILY', type: 'DAILY', class: 'item-type'},

      { name: 'WINCOME', id: 'WINCOME_HOURLY', type: 'HOURLY', class: 'item-type' },
      { name: 'TEMP_INT', id: 'TEMP_INT_MAX_HOURLY', type: 'HOURLY', class: 'item-type active' },
      { name: 'TEMP_INT_MAX', id: 'TEMP_INT_MAX_HOURLY', type: 'HOURLY', class: 'item-type' },
      { name: 'TEMP_INT_MIN', id: 'TEMP_INT_MIN_HOURLY', type: 'HOURLY', class: 'item-type' },
      { name: 'TEMP_EXT_MAX', id: 'TEMP_EXT_MAX_HOURLY', type: 'HOURLY', class: 'item-type' },
      { name: 'TEMP_EXT_MIN', id: 'TEMP_EXT_MIN_HOURLY', type: 'HOURLY', class: 'item-type' },
      { name: 'HRIN', id: 'HRIN_HOURLY', type: 'HOURLY', class: 'item-type' },
      { name: 'BAT', id: 'BAT_HOURLY', type: 'HOURLY', class: 'item-type' }
    ];
    this.currentTypeDaily = this.typeData[0];
    this.currentTypeHourly = new Array(this.typeData[6]);
  }

  ngOnInit() {
    // this.dailyManager.getWeightincome(this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest());
    this.loadDailyData();
  }


  ngAfterViewInit(): void {
    this.currentEltTypeDaily = document.getElementById(this.currentTypeDaily.id);
    this.currentEltTypeHourly = document.getElementById(this.currentTypeHourly[0].id);

  }

  /**
   *
   *
   * @memberof HiveComponent
   */
  loadDailyData(): void {
    switch (this.currentTypeDaily.name) {
      case 'WINCOME':
        this.dailyManager.getChartWeightincome(this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'TEMP_EXT_MAX':
        this.dailyManager.getChartTextMax(this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'TEMP_EXT_MIN':
        this.dailyManager.getChartTextMin(this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'TEMP_INT_MAX':
          this.dailyManager.getChartTintMax(this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'TEMP_INT_MIN':
        this.dailyManager.getChartTminInt(this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'HRIN':
        this.dailyManager.getChartHint(this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'BROOD':
        this.dailyManager.getChartBrood(this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'WEIGHT_MAX':
        this.dailyManager.getChartWeight(this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'WEATHER':
        this.dailyManager.getChartDailyWeather(this.melliHive.getHiveSelect().idApiary, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true))
        break;
      case 'ASTRO':
        this.dailyManager.getChartAstro(this.melliHive.getHiveSelect().idApiary, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      default:
        break;
    }
  }

  loadHourlyData(): void {
    if (this.ifTypeHourlyContains('WINCOME')) {
      this.hourlyManager.getChartWeight(this.melliHive.getHiveSelect().id, this.melliHive.getHourlyChartInstance(), this.melliDate.getRangeForReqest());

    } if (this.ifTypeHourlyContains('TEMP_INT')) {
      this.hourlyManager.getChartTempInt(this.melliHive.getHiveSelect().id, this.melliHive.getHourlyChartInstance(), this.melliDate.getRangeForReqest());

    } if (this.ifTypeHourlyContains('TEMP_INT_MAX')) {

    } if (this.ifTypeHourlyContains('TEMP_INT_MIN')) {

    } if (this.ifTypeHourlyContains('HRIN')) {

    } if (this.ifTypeHourlyContains('BROOD')) {

    }
  }


  /**
   *
   *
   * @param {string} labelType
   * @returns {boolean}
   * @memberof HiveComponent
   */
  ifTypeHourlyContains(labelType: string): boolean {
    return this.currentTypeHourly.filter(_filter => _filter.name === labelType).length > 0;
  }

  /**
   *
   *
   * @param {*} type
   * @memberof HiveComponent
   */
  removeTypeHourly(type: any): void {
    const index = this.currentTypeHourly.map(_type => _type.id).indexOf(type.id);
    this.currentTypeHourly.splice(index, 1);
  }

  /**
   *
   *
   * @param {*} type
   * @memberof HiveComponent
   */
  setType(type: any): void {
    if (type.type === DAILY) {
      if (type.id !== this.currentTypeDaily.id) {
        this.renderer.removeClass(this.currentEltTypeDaily, 'active');
        this.currentEltTypeDaily = document.getElementById(type.id);
        this.currentTypeDaily = type;
        console.log(document.getElementById(type.id));
        this.renderer.addClass(this.currentEltTypeDaily, 'active');
        this.loadDailyData();
      }
    } else {
      this.currentEltTypeHourly = document.getElementById(type.id);
      if (!this.ifTypeHourlyContains(type.name)) {
        this.currentTypeHourly.push(type);
        this.renderer.addClass(this.currentEltTypeHourly, 'active');
        this.loadHourlyData();
      } else {
        this.renderer.removeClass(this.currentEltTypeHourly, 'active');
        this.removeTypeHourly(type);
      }
    }
  }

  setRangeChart() {
    this.loadHourlyData();
    this.loadDailyData();
  }

  onDailyChartInit(event: any): void {
    this.melliHive.setDailyChartInstance(event);
    console.log(this.melliHive.getDailyChartInstance());
  }

  onHourlyChartInit(event: any) {
    this.melliHive.setHourlyChartInstnace(event);
  }

  /**
   *
   *
   * @param {string} type
   * @returns {Array<any>}
   * @memberof HiveComponent
   */
  getlabelByType(type: string): Array<any> {
    return this.typeData.filter(_filter => _filter.type === type);
  }

}
