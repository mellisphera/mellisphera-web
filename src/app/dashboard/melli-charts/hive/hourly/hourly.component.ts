import { Component, OnInit, Renderer2 } from '@angular/core';
import { HourlyManagerService } from '../service/hourly-manager.service';
import { MelliChartsHiveService } from '../../service/melli-charts-hive.service';
import { MelliChartsDateService } from '../../service/melli-charts-date.service';

interface Tools {
  name: string;
  id: string;
  type: string;
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
  private currentTypeHourly: Tools;
  private currentEltTypeHourly: HTMLElement;
  constructor(private hourlyManager: HourlyManagerService,
    private renderer: Renderer2,
    private melliHive: MelliChartsHiveService,
    private melliDate: MelliChartsDateService) {
    this.typeData = [
      { name: 'WINCOME', id: 'WINCOME_HOURLY', type: 'HOURLY', class: 'item-type' },
      { name: 'TEMP_INT', id: 'TEMP_INT_MAX_HOURLY', type: 'HOURLY', class: 'item-type active' },
      { name: 'TEMP_INT_MAX', id: 'TEMP_INT_MAX_HOURLY', type: 'HOURLY', class: 'item-type' },
      { name: 'TEMP_INT_MIN', id: 'TEMP_INT_MIN_HOURLY', type: 'HOURLY', class: 'item-type' },
      { name: 'TEMP_EXT_MAX', id: 'TEMP_EXT_MAX_HOURLY', type: 'HOURLY', class: 'item-type' },
      { name: 'TEMP_EXT_MIN', id: 'TEMP_EXT_MIN_HOURLY', type: 'HOURLY', class: 'item-type' },
      { name: 'HRIN', id: 'HRIN_HOURLY', type: 'HOURLY', class: 'item-type' },
      { name: 'BAT', id: 'BAT_HOURLY', type: 'HOURLY', class: 'item-type' }
    ];
    this.currentTypeHourly = this.typeData[6];

 }

  ngOnInit() {
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
  ngAfterViewInit(): void {
    this.currentEltTypeHourly = document.getElementById(this.currentTypeHourly[0].id);
  }

  setType(type: any): void{
    this.currentEltTypeHourly = document.getElementById(type.id);
    if (!this.ifTypeHourlyContains(type.name)) {
      // this.currentTypeHourly.push(type);
      this.renderer.addClass(this.currentEltTypeHourly, 'active');
      this.loadHourlyData();
    } else {
      this.renderer.removeClass(this.currentEltTypeHourly, 'active');
     // this.removeTypeHourly(type);
    }
  }

  // removeTypeHourly(type: any): void {
  //   const index = this.currentTypeHourly.map(_type => _type.id).indexOf(type.id);
  //   this.currentTypeHourly.splice(index, 1);
  // }

  ifTypeHourlyContains(labelType: string): boolean {
   //  return this.currentTypeHourly.filter(_filter => _filter.name === labelType).length > 0;
   return true;
  }

  onHourlyChartInit(event: any) {
    this.melliHive.setHourlyChartInstnace(event);
  }

  getlabelByType(): Array<any> {
    return this.typeData;
  }


}
