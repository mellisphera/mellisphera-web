import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MelliChartsFilterService {

  private filters: any = [
    {'Inspection': true},
    {'Events': true},
    {'Alerts': true},
  ];

  constructor() {
  }

  changeFilter(filter: string, bool: boolean): void{
    this.filters[filter] = bool;
  }
}
