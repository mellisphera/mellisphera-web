import { filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { inspect } from 'util';

const ALERTS_CHART_PATH = '../../../../assets/pictos_alerts/charts/';

const ALERTS_ICONS_PATH = '../../../../assets/pictos_alerts/charts/';

@Injectable({
  providedIn: 'root'
})
export class MelliChartsFilterService {

  public alertsDisplay:any = [
    {name:'Dead', show: true},
    {name:'Hmax', show: true},
    {name:'Hmin', show: true},
    {name:'Honeydew', show: true},
    {name:'LowBrood', show: true},
    {name:'Oxalic', show: true},
    {name:'Rswarm', show: true},
    {name:'Stolen', show: true},
    {name:'SuperMore', show: true},
    {name:'SuperLess', show: true},
    {name:'Swarm', show: true},
    {name:'Tmax', show: true},
    {name:'Tmin', show: true},
    {name:'WIneg', show: true},
    {name:'WIpos', show: true},
    {name:'Wlim', show: true},
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
      Wlim: true
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

}
