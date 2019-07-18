import { Component, OnInit, Renderer2 } from '@angular/core';
import { HourlyManagerService } from '../service/hourly-manager.service';
import { MelliChartsHiveService } from '../../service/melli-charts-hive.service';
import { MelliChartsDateService } from '../../service/melli-charts-date.service';

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
  private currentEltTypeHourly: HTMLElement;
  constructor(
    private hourlyManager: HourlyManagerService,
    private melliHive: MelliChartsHiveService,
    private melliDate: MelliChartsDateService) {
    this.currentTypeHourly = [];
    this.typeData = [
      { name: 'WEIGHT', id: 'WEIGHT_HOURLY', unit: 'W', origin: 'DEVICE', class: 'item-type active' },
      { name: 'TEMP_INT', id: 'TEMP_INT_HOURLY', unit: 'T', origin: 'DEVICE', class: 'item-type' },
      { name: 'TEMP_EXT', id: 'TEMP_EXT_HOURLY', unit: 'T', origin: 'DEVICE', class: 'item-type' },
      { name: 'HRIN', id: 'HRIN_HOURLY', unit: 'P',  origin: 'DEVICE', class: 'item-type' },
      { name: 'BAT', id: 'BAT_HOURLY', unit: 'P', origin: 'DEVICE', class: 'item-type' },
      { name: 'TEMP_WEATHER', id: 'TEMP_WEATHER', unit: 'T', origin: 'OTHER',  class: 'item-type'},
      { name: 'HWEATHER', id: 'HWEATHER', unit: 'P', origin: 'OTHER', class: 'item-type'}
    ];
    this.currentTypeHourly.push(this.typeData[0]);

 }

  ngOnInit() {
  }

  /**
   *
   *
   * @param {boolean} newHive
   * @param {boolean} newType
   * @memberof HourlyComponent
   */
  loadHourlyData(newHive: boolean, newType: string): void {
    const lengthIndex = this.currentTypeHourly.length;
     this.currentTypeHourly.forEach(_type => {
      console.log(newType === _type.name);
       switch(_type.name) {
         case 'WEIGHT':
           if (newHive && this.ifTypeHourlyContains('WEIGHT')  || (!newHive || newType === _type.name)) {
            this.hourlyManager.getChartWeight(_type,
              this.melliHive.getHiveSelect().id, this.melliHive.getHourlyChartInstance(), this.melliDate.getRangeForReqest());
           }
           break;
          case 'TEMP_INT':
            if (newHive && this.ifTypeHourlyContains('TEMP_INT') || !newHive || newType === _type.name) {
              this.hourlyManager.getChartTempInt(_type,
                this.melliHive.getHiveSelect().id, this.melliHive.getHourlyChartInstance(), this.melliDate.getRangeForReqest());
            }
            break;
          case 'TEMP_EXT':
            if (newHive && this.ifTypeHourlyContains('TEMP_EXT') || !newHive || newType === _type.name) {
              this.hourlyManager.getChartTempExt(_type,
                this.melliHive.getHiveSelect().id, this.melliHive.getHourlyChartInstance(), this.melliDate.getRangeForReqest());
            }
            break;
          default:
            break;
       }
     })
    // if ((this.getLastSelectedType() === 'WEIGHT' && !newHive) || (newHive && this.ifTypeHourlyContains('WEIGHT'))) {
 
    // }
    // if ((this.getLastSelectedType() === 'TEMP_INT'  && !newHive) || (newHive && this.ifTypeHourlyContains('TEMP_INT'))) {
    //   console.error('TEMP_INT');

    // }
    // if ((this.getLastSelectedType() === 'TEMP_EXT' && !newHive) || (newHive && this.ifTypeHourlyContains('TEMP_EXT'))) {
    //   console.error('TEMP_EXT');

    // }
  }
  ngAfterViewInit(): void {
    this.currentEltTypeHourly = document.getElementById(this.currentTypeHourly[0].id);
  }

  getLastSelectedType(): string {
    const length = this.currentTypeHourly.length;
    return this.currentTypeHourly[length - 1].name;
  }

  setType(type: Tools): void {
    const toolIndex: number = this.typeData.map(_type => _type.id).indexOf(type.id);
    this.currentEltTypeHourly = document.getElementById(type.id);
    console.log(this.currentTypeHourly);
    if (!this.ifTypeHourlyContains(type.name)) {
      this.typeData[toolIndex].class += ' active';
      this.addType(type);
      console.log(this.currentTypeHourly);
      this.loadHourlyData(false, type.name);
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

        });
        this.currentTypeHourly = new Array();
      }
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

  onHourlyChartInit(event: any) {
    this.melliHive.setHourlyChartInstnace(event);
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
