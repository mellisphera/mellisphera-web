import { filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';

const ALERTS_CHART_PATH = '../../../../assets/pictos_alerts/charts/';

const ALERTS_ICONS_PATH = '../../../../assets/pictos_alerts/charts/';

@Injectable({
  providedIn: 'root'
})
export class MelliChartsFilterService {

  public alertsDisplay:any[] = [
    {name:'Dead', show: true, code: '406'},
    {name:'Hmax', show: true, code: '306'},
    {name:'Hmin', show: true, code: '307'},
    {name:'Honeydew', show: true, code: '311'},
    {name:'LowBrood', show: true, code: '305'},
    {name:'Oxalic', show: true, code: '205'},
    {name:'Rswarm', show: true, code: '322'},
    {name:'Stolen', show: true, code: '405'},
    {name:'Super+', show: true, code: '323'},
    {name:'Super-', show: true, code: '324'},
    {name:'Swarm', show: true, code: '321'},
    {name:'Tmax', show: true, code: '301'},
    {name:'Tmin', show: true, code: '302'},
    {name:'WIneg', show: true, code: '304'},
    {name:'WIpos', show: true, code: '303'},
    {name:'Wlim', show: true, code: '312'},
  ];

  private filters: any = {
    alert: true,
    insp: true,
    event: true,
    display:{
      Dead: true,
      Hmax: true,
      Hmin: true,
      Honeydew: true,
      LowBrood: true,
      Oxalic: true,
      Rswarm: true,
      Stolen: true,
      SuperMore: true,
      SuperLess: true,
      Swarm: true,
      Tmax: true,
      Tmin: true,
      WIneg: true,
      WIpos: true,
      Wlim: true,
      default: true
    }
  };

  constructor() {
  }

  changeFilter(filter: string, bool: boolean): void{
    this.filters[filter] = bool;
    return;
  }

  changeDisplay(icon: string, bool: boolean): void{
    this.filters.display[icon] = bool;
    return;
  }

  getFilters(): any{
    return this.filters;
  }

  getShowAlert(): boolean{
    return this.filters.alert;
  }

  getShowInsp(): boolean{
    return this.filters.insp;
  }

  getShowEvent(): boolean{
    return this.filters.event;
  }

  getShowAlertIcon(icon: string): boolean{
    if(icon == 'Super+'){
      return this.filters.display['SuperMore'];
    }
    if(icon == 'Super-'){
      return this.filters.display['SuperLess'];
    }
    return this.filters.display[icon];
  }

  getEventArrayFilter(): Array<string>{
    let arr = [];
    if(this.filters.insp){
      arr.push('apiary');
    }
    if(this.filters.event){
      arr.push('hive');
    }
    return arr;
  }

  getPictosArrayFilter(): Array<string>{
    let arr = [];
    arr = this.alertsDisplay.filter(disp => disp.show).map(disp => disp.name);
    arr.push('default');
    return arr;
  }

}
