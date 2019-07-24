import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { DailyManagerService } from '../service/daily-manager.service';
import { MelliChartsHiveService } from '../../service/melli-charts-hive.service';
import { MelliChartsDateService } from '../../service/melli-charts-date.service';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import * as echarts from 'echarts';


interface Tools {
  name: string;
  id: string;
  origin: string;
  type?: string;
  unit?: string;
  class: string;
  icons?: string;
}
const DEVICE = 'DEVICE';
const OTHER = 'OTHER';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css']
})
export class DailyComponent implements OnInit, AfterViewInit {

  private currentEltTypeDaily: HTMLElement;
  private currentTypeDailyDevice: Tools;
  private currentTypeDailyOther: Tools;
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
      { name: 'WEATHER', id: 'WHEATHER', origin: 'OTHER', class: 'item-type active', icons: '' },
      { name: 'WEIGHT_MAX', id: 'WEIGHT_MAX', origin: 'DEVICE', class: 'item-type', icons: '' },
      { name: 'HRIN', id: 'HRIN', origin: 'DEVICE', class: 'item-type', icons: '' },
      { name: 'BROOD', id: 'BROOD', origin: 'DEVICE', class: 'item-type', icons: '' },
      { name: 'ASTRO', id: 'ASTRO', origin: 'OTHER', class: 'item-type', icons: ''},
      { name: 'RAIN', id: 'RAIN', origin: 'OTHER', class: 'item-type', icons: ''}
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
    this.dailyManager.setCurrentRange(this.melliDate.getRangeForReqest());
    this.currentTypeDailyDevice = this.typeData.filter(_filter => _filter.origin === DEVICE)[0];
    this.currentTypeDailyOther = this.typeData.filter(_filter => _filter.origin === OTHER)[0];
  }
  

  ngOnInit() {
    this.melliHive.setDailyDeviceChartInstance(echarts.init(<HTMLDivElement>document.getElementById('calendar-device')));
    this.melliHive.setDailyOtherChartInstance(echarts.init(<HTMLDivElement>document.getElementById('calendar-other')));
  }


  onResize(event: any) {
    this.melliHive.getHourlyChartInstance().resize({
      width: 'auto',
      height: 'auto'
    });
  }

  ngAfterViewInit(): void {
  }

  loadDailyDeviceData(rangeChange: boolean): void {
    switch (this.currentTypeDailyDevice.name) {
      case 'WINCOME':
        this.dailyManager.getChartWeightincome(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id, 
        this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(),rangeChange);
        break;
      case 'TEMP_EXT_MAX':
        this.dailyManager.getChartTextMax(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id, 
        this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'TEMP_EXT_MIN':
        this.dailyManager.getChartTextMin(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id, this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest());
        break;
      case 'TEMP_INT_MAX':
          this.dailyManager.getChartTintMax(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id, this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest());
        break;
      case 'TEMP_INT_MIN':
        this.dailyManager.getChartTminInt(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id, this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest());
        break;
      case 'HRIN':
        this.dailyManager.getChartHint(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id, this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest());
        break;
      case 'BROOD':
        this.dailyManager.getChartBrood(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id, this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest());
        break;
      case 'WEIGHT_MAX':
        this.dailyManager.getChartWeight(this.currentTypeDailyDevice, this.melliHive.getHiveSelect().id, this.melliHive.getDailyDeviceChartInstance(), this.melliDate.getRangeForReqest());
        break;
      default:
        break;
    }
   // this.dailyManager.setOriginChartOption(this.currentTypeDailyDevice.origin);
    
  }

  loadDailyOtherData(rangeChange: boolean) {
    switch (this.currentTypeDailyOther.name) {
      case 'WEATHER':
        this.dailyManager.getChartDailyWeather(this.currentTypeDailyOther, this.melliHive.getHiveSelect().idApiary, 
        this.melliHive.getDailyOtherChartInstance(), this.melliDate.getRangeForReqest(), rangeChange)
        break;
      case 'ASTRO':
        this.dailyManager.getChartAstro(this.currentTypeDailyOther, this.melliHive.getHiveSelect().idApiary, 
        this.melliHive.getDailyOtherChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
        break;
      case 'RAIN':
        this.dailyManager.getRainByApiary(this.currentTypeDailyOther, this.melliHive.getHiveSelect().idApiary, 
        this.melliHive.getDailyOtherChartInstance(), this.melliDate.getRangeForReqest(), rangeChange)
        break;
      default:
        break;
    }
    // this.dailyManager.setOriginChartOption(this.currentTypeDailyOther.origin);
  }



/*   onDailyDeviceChartInit(event: any): void {
    this.melliHive.checkifDailyDeviceInstanceChart().then(success => {
      console.log(this.melliHive.getDailyDeviceChartInstance().getWidth());
    }).catch(err => {
      this.melliHive.setDailyDeviceChartInstance(event);

      console.log(this.melliHive.getDailyDeviceChartInstance().getWidth());
    });
  }

  onDailyOtherChartInit(event: any): void {
    this.melliHive.checkifOtherInstanceChart().then(success => {
      console.log(this.melliHive.getDailyOtherChartInstance().getWidth());
    }).catch(err => {
      this.melliHive.setDailyOtherChartInstance(event);
    });
  } */
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
    if (type.origin === DEVICE) {
      let oldIndex: number = this.typeData.map(_type => _type.id).indexOf(this.currentTypeDailyDevice.id);
      if (type.id !== this.currentTypeDailyDevice.id) {
        this.typeData[oldIndex].class = this.typeData[oldIndex].class.replace(/active/g, '');
        let newIndex: number = this.typeData.map(_type => _type.id).indexOf(type.id);
        this.typeData[newIndex].class += ' active';
        this.currentTypeDailyDevice = type;
        this.loadDailyDeviceData(false);
    }
  } else {
    if (type.id !== this.currentTypeDailyOther.id) {
      let oldIndex: number = this.typeData.map(_type => _type.id).indexOf(this.currentTypeDailyOther.id);
      if (type.id !== this.currentTypeDailyDevice.id) {
        this.typeData[oldIndex].class = this.typeData[oldIndex].class.replace(/active/g, '');
        let newIndex: number = this.typeData.map(_type => _type.id).indexOf(type.id);
        this.typeData[newIndex].class += ' active';
        this.currentTypeDailyOther = type;
        this.loadDailyOtherData(false);
    }
  }
}
}



/**
 *
 *
 * @memberof DailyComponent
 */
afterRangeChange(): void {
  this.dailyManager.setCurrentRange(this.melliDate.getRangeForReqest());
}

  /**
   *
   *
   * @memberof DailyComponent
   */
  exportToCsv(origin: string): void {
    if (origin === DEVICE) {
      const data = this.melliHive.getDailyDeviceChartInstance().getOption().series.map(_series => _series.data).flat();
      let csv = new Angular5Csv(data, this.currentTypeDailyDevice.name, this.optionCsv);
    } else {
      const data = this.melliHive.getDailyOtherChartInstance().getOption().series.map(_series => _series.data).flat();
      let csv = new Angular5Csv(data, this.currentTypeDailyOther.name, this.optionCsv);
    }
  }
}
