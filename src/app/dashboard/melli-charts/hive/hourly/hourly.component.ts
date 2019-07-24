import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { HourlyManagerService } from '../service/hourly-manager.service';
import { MelliChartsHiveService } from '../../service/melli-charts-hive.service';
import { MelliChartsDateService } from '../../service/melli-charts-date.service';
import * as echarts from 'echarts';


interface Tools {
  name: string;
  id: string;
  origin: string;
  unit?: string;
  class: string;
  icons?: string;
}

@Component({
  selector: 'app-hourly',
  templateUrl: './hourly.component.html',
  styleUrls: ['./hourly.component.css']
})
export class HourlyComponent implements OnInit {

  private typeData: Tools[];
  private currentTypeHourly: Tools[];
  constructor(
    public hourlyManager: HourlyManagerService,
    private melliHive: MelliChartsHiveService,
    private melliDate: MelliChartsDateService) {
    this.currentTypeHourly = [];
    this.typeData = [
      { name: 'WEIGHT', id: 'WEIGHT_HOURLY', unit: 'W', origin: 'DEVICE', class: 'item-type active' },
      { name: 'TEMP_INT', id: 'TEMP_INT_HOURLY', unit: 'T', origin: 'DEVICE', class: 'item-type' },
      { name: 'TEMP_EXT', id: 'TEMP_EXT_HOURLY', unit: 'T', origin: 'DEVICE', class: 'item-type' },
      { name: 'HRIN', id: 'HRIN_HOURLY', unit: 'P', origin: 'DEVICE', class: 'item-type' },
      { name: 'BAT_INT', id: 'BAT_INT_HOURLY', unit: 'P', origin: 'DEVICE', class: 'item-type' },
      { name: 'BAT_EXT', id: 'BAT_EXT_HOURLY', unit: 'P', origin: 'DEVICE', class: 'item-type' },
      { name: 'TEMP_WEATHER', id: 'TEMP_WEATHER', unit: 'T', origin: 'OTHER', class: 'item-type' },
      { name: 'HWEATHER', id: 'HWEATHER', unit: 'P', origin: 'OTHER', class: 'item-type' }
    ];
    this.currentTypeHourly.push(this.typeData[0]);

  }

  ngOnInit() {
    this.melliHive.setHourlyChartInstance(echarts.init(<HTMLDivElement>document.getElementById("hourly-chart")));
    this.melliHive.getHourlyChartInstance().setOption(this.hourlyManager.baseOpions);
  }

  onResize(event: any): void {
    this.melliHive.getHourlyChartInstance().resize({
      width: 'auto',
      height: 'auto'
    });
    /*
          width: event.target.innerWidth,
      height: event.target.innerWidth
    */
  }
  /**
   *
   *
   * @param {boolean} newHive
   * @param {boolean} newType
   * @memberof HourlyComponent
   */
  loadHourlyData(newHive: boolean, newType: string, rangeChange: boolean ): void {
    console.log(rangeChange);
    this.hourlyManager.setNbChartSelected((newType !== '' )? 1: this.currentTypeHourly.length);
    this.currentTypeHourly.forEach(_type => {
      switch (_type.name) {
        case 'WEIGHT':
          if ((rangeChange || newHive) && this.ifTypeHourlyContains(_type.name) || ( !rangeChange && !newHive && newType === _type.name)) {
            console.error(_type.name);
            this.hourlyManager.getChartWeight(_type,
              this.melliHive.getHiveSelect().id, this.melliHive.getHourlyChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
          }
          break;
        case 'TEMP_INT':
          if ((rangeChange || newHive) && this.ifTypeHourlyContains(_type.name) || (!rangeChange && !newHive && newType === _type.name)) {
            console.error(_type.name);
            this.hourlyManager.getChartTempInt(_type,
              this.melliHive.getHiveSelect().id, this.melliHive.getHourlyChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
          }
          break;
        case 'TEMP_EXT':
          if ((rangeChange || newHive) && this.ifTypeHourlyContains(_type.name) || (!rangeChange && !newHive && newType === _type.name)) {
            console.error(_type.name);
            this.hourlyManager.getChartTempExt(_type,
              this.melliHive.getHiveSelect().id, this.melliHive.getHourlyChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
          }
          break;
        case 'HRIN':
          if ((rangeChange || newHive) && this.ifTypeHourlyContains(_type.name) || (!rangeChange && !newHive && newType === _type.name)) {
            console.error(_type.name);
            this.hourlyManager.getChartHint(_type,
              this.melliHive.getHiveSelect().id, this.melliHive.getHourlyChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
          }
          break;
        case 'BAT_INT':
          if ((rangeChange || newHive) && this.ifTypeHourlyContains(_type.name) || (!rangeChange && !newHive && newType === _type.name)) {
            console.error(_type.name);
            this.hourlyManager.getChartBatInt(_type,
              this.melliHive.getHiveSelect().id, this.melliHive.getHourlyChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
          }
          break;
        case 'BAT_EXT':
          if ((rangeChange || newHive) && this.ifTypeHourlyContains(_type.name) || (!rangeChange && !newHive && newType === _type.name)) {
            console.error(_type.name);
            this.hourlyManager.getChartBatExt(_type,
              this.melliHive.getHiveSelect().id, this.melliHive.getHourlyChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
          }
          break;
        case 'TEMP_WEATHER':
            if ((rangeChange || newHive) && this.ifTypeHourlyContains(_type.name) || (!rangeChange && !newHive && newType === _type.name)) {
              console.error(_type.name);
              this.hourlyManager.getTempHourlyWeather(_type,
                this.melliHive.getHiveSelect().idApiary, this.melliHive.getHourlyChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
            }
            break;
        case 'HWEATHER':
            if ((rangeChange || newHive) && this.ifTypeHourlyContains(_type.name) || (!rangeChange && !newHive && newType === _type.name)) {
              console.error(_type.name);
              this.hourlyManager.getHextHourlyWeather(_type,
                this.melliHive.getHiveSelect().idApiary, this.melliHive.getHourlyChartInstance(), this.melliDate.getRangeForReqest(), rangeChange);
            }
          break;
        default:
          break;
      }
    });

    this.hourlyManager.getCountChartSubject().subscribe(() => {}, () => {}, () => {
      console.error('COMPLETE');
      console.log(this.hourlyManager.baseOpions);
      console.log(this.melliDate.getRangeForReqest());
      if (rangeChange) {
        this.hourlyManager.setNewRange(this.melliDate.getRangeForReqest());
      }
      this.hourlyManager.resetCountSubject();
    })
  }


  getLastSelectedType(): string {
    const length = this.currentTypeHourly.length;
    return this.currentTypeHourly[length - 1].name;
  }

  setType(type: Tools): void {
    const toolIndex: number = this.typeData.map(_type => _type.id).indexOf(type.id);
    console.log(this.currentTypeHourly);
    if (!this.ifTypeHourlyContains(type.name)) {
      this.typeData[toolIndex].class += ' active';
      this.addType(type);
      console.log(this.currentTypeHourly);
      this.loadHourlyData(false, type.name, false);
    } else {
      this.typeData[toolIndex].class = this.typeData[toolIndex].class.replace(/active/g, '');
      console.log(this.typeData[toolIndex]);
      this.removeTypeHourly(type);
    }
  }

  /**
   *
   *
   * @param {*} type
   * @memberof HourlyComponent
   */
  removeTypeHourly(type: Tools): void {
    const index = this.currentTypeHourly.map(_type => _type.id).indexOf(type.id);
    this.currentTypeHourly.splice(index, 1);
    this.hourlyManager.removeSeriesFromChartInstance(this.melliHive.getHourlyChartInstance(), type.name);
  }

  addType(type: Tools) {
    if (this.currentTypeHourly.length > 0) {
      const nbSimilarType: Tools[] = this.currentTypeHourly.filter(_filter => _filter.unit === type.unit);
      if (nbSimilarType.length < 1) { // Si je n'ai pas d'unité similaire
        this.currentTypeHourly.forEach(_type => {
          let toolIndex: number = this.typeData.map(_map => _map.id).indexOf(_type.id);
          this.typeData[toolIndex].class = this.typeData[toolIndex].class.replace(/active/g, '');
          console.log(this.melliHive.getHourlyChartInstance().getOption());
          this.hourlyManager.removeSeriesFromChartInstance(this.melliHive.getHourlyChartInstance(), _type.name);

        });
        this.currentTypeHourly = new Array();
      }
      console.log(this.currentTypeHourly);
    }
    this.currentTypeHourly.push(type);

  }

  /**
   *
   *
   * @param {string} labelType
   * @returns {boolean}
   * @memberof HourlyComponent
   */
  ifTypeHourlyContains(labelType: string): boolean {
    return this.currentTypeHourly.filter(_filter => _filter.name === labelType).length > 0;
  }

  checkSeriesAlreadyExist(serieName: string): Boolean {
    return this.melliHive.getHourlyChartInstance().getOption().series.filter(_serie => _serie.name === serieName).length > 0;

  }

  onHourlyChartInit(event: any) {
    console.log('ok');
    this.melliHive.setHourlyChartInstance(event);
    console.log(event);
  }

  /**
   *
   *
   * @param {string} type
   * @returns {Array<any>}
   * @memberof HourlyComponent
   */
  getlabelByType(type: string): Array<any> {
    return this.typeData.filter(_filter => _filter.origin === type);
  }

  /**
   *
   *
   * @memberof HourlyComponent
   */
  cleanSerie(): void {
    this.hourlyManager.baseOpions.series = new Array();
  }

}
