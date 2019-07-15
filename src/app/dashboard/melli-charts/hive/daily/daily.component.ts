import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { DailyManagerService } from '../service/daily-manager.service';
import { MelliChartsHiveService } from '../../service/melli-charts-hive.service';
import { MelliChartsDateService } from '../../service/melli-charts-date.service';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css']
})
export class DailyComponent implements OnInit, AfterViewInit {

  private currentEltTypeDaily: HTMLElement;
  private currentTypeDaily: any;
  private typeData: any;
  constructor(private renderer: Renderer2,
    private dailyManager: DailyManagerService,
    private melliHive: MelliChartsHiveService,
    private melliDate: MelliChartsDateService) {
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
      { name: 'ASTRO', id: 'ASTRO_DAILY', type: 'DAILY', class: 'item-type'}
    ];
    this.currentTypeDaily = this.typeData[0];

  }
  

  ngOnInit() {
  }



  ngAfterViewInit(): void {
    this.currentEltTypeDaily = document.getElementById(this.currentTypeDaily.id);
  }

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



  onDailyChartInit(event: any): void {
    this.melliHive.checkifDaillyInstanceChart().then(success => {
      console.info('CHART DEJA CHARGE');
      console.log(this.melliHive.getDailyChartInstance().getWidth());
    }).catch(err => {
      console.info('CHART INEXISTANT');
      this.melliHive.setDailyChartInstance(event);
      console.log(this.melliHive.getDailyChartInstance().getWidth());

    });
  }
  
  /**
   *
   *
   * @returns {Array<any>}
   * @memberof DailyComponent
   */
  getlabelByType(): Array<any> {
    return this.typeData;
  }

  setType(type: any): void {
    if (type.id !== this.currentTypeDaily.id) {
      this.renderer.removeClass(this.currentEltTypeDaily, 'active');
      this.currentEltTypeDaily = document.getElementById(type.id);
      this.currentTypeDaily = type;
      console.log(document.getElementById(type.id));
      this.renderer.addClass(this.currentEltTypeDaily, 'active');
      this.loadDailyData();
    }
  }
}
