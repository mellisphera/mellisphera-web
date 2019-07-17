import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { DailyManagerService } from '../service/daily-manager.service';
import { MelliChartsHiveService } from '../../service/melli-charts-hive.service';
import { MelliChartsDateService } from '../../service/melli-charts-date.service';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';


interface Tools {
  name: string;
  id: string;
  origin: string;
  type?: string;
  unit?: string;
  class: string;
  icons?: string;
}
@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css']
})
export class DailyComponent implements OnInit, AfterViewInit {

  private currentEltTypeDaily: HTMLElement;
  private currentTypeDaily: Tools;
  private optionCsv: Object;
  private typeData: Tools[];
  constructor(private renderer: Renderer2,
    private dailyManager: DailyManagerService,
    private melliHive: MelliChartsHiveService,
    private melliDate: MelliChartsDateService) {
    this.typeData = [
      { name: 'WINCOME', id: 'WINCOME', origin: 'DEVICE', class: 'item-type active', icons: '' },
      { name: 'TEMP_INT_MAX', id: 'TEMP_INT_MAX', origin: 'DEVICE', class: 'item-type', icons: '' },
      { name: 'TEMP_INT_MIN', id: 'TEMP_INT_MIN', origin: 'DEVICE', class: 'item-type', icons: '' },
      { name: 'TEMP_EXT_MAX', id: 'TEMP_EXT_MAX', origin: 'DEVICE', class: 'item-type', icons: '' },
      { name: 'TEMP_EXT_MIN', id: 'TEMP_EXT_MIN', origin: 'DEVICE', class: 'item-type', icons: '' },
      { name: 'WEATHER', id: 'WHEATHERs', origin: 'OTHER', class: 'item-type', icons: '' },
      { name: 'WEIGHT_MAX', id: 'WEIGHT_MAX', origin: 'DEVICE', class: 'item-type', icons: '' },
      { name: 'HRIN', id: 'HRIN', origin: 'DEVICE', class: 'item-type', icons: '' },
      { name: 'BROOD', id: 'BROOD', origin: 'DEVICE', class: 'item-type', icons: '' },
      { name: 'ASTRO', id: 'ASTRO', origin: 'OTHER', class: 'item-type', icons: ''}
    ];
    this.optionCsv = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Your title',
      useBom: true,
      noDownload: false,
      headers: ['Date', 'Value'],
      nullToEmptyString: false,
    };
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
        this.dailyManager.getChartWeightincome(this.currentTypeDaily.name, this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'TEMP_EXT_MAX':
        this.dailyManager.getChartTextMax(this.currentTypeDaily.name, this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'TEMP_EXT_MIN':
        this.dailyManager.getChartTextMin(this.currentTypeDaily.name, this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'TEMP_INT_MAX':
          this.dailyManager.getChartTintMax(this.currentTypeDaily.name, this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'TEMP_INT_MIN':
        this.dailyManager.getChartTminInt(this.currentTypeDaily.name, this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'HRIN':
        this.dailyManager.getChartHint(this.currentTypeDaily.name, this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'BROOD':
        this.dailyManager.getChartBrood(this.currentTypeDaily.name, this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'WEIGHT_MAX':
        this.dailyManager.getChartWeight(this.currentTypeDaily.name, this.melliHive.getHiveSelect().id, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      case 'WEATHER':
        this.dailyManager.getChartDailyWeather(this.currentTypeDaily.name, this.melliHive.getHiveSelect().idApiary, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true))
        break;
      case 'ASTRO':
        this.dailyManager.getChartAstro(this.currentTypeDaily.name, this.melliHive.getHiveSelect().idApiary, this.melliHive.getDailyChartInstance(), this.melliDate.getRangeForReqest(true));
        break;
      default:
        break;
    }
  }



  /**
   *
   *
   * @param {*} event
   * @memberof DailyComponent
   */
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
  getlabelByType(type: string): Array<any> {
    return this.typeData.filter(_filter => _filter.origin === type);
  }

  /**
   *
   *
   * @param {Tools} type
   * @memberof DailyComponent
   */
  setType(type: Tools): void {
    if (type.id !== this.currentTypeDaily.id) {
      this.renderer.removeClass(this.currentEltTypeDaily, 'active');
      this.currentEltTypeDaily = document.getElementById(type.id);
      this.currentTypeDaily = type;
      console.log(document.getElementById(type.id));
      this.renderer.addClass(this.currentEltTypeDaily, 'active');
      this.loadDailyData();
    }
  }

  /**
   *
   *
   * @memberof DailyComponent
   */
  exportToCsv(): void {
    const data = this.melliHive.getDailyChartInstance().getOption().series.map(_series => _series.data).flat();
    const ngCsv = new Angular5Csv(data, this.currentTypeDaily.name, this.optionCsv);
  }
}
