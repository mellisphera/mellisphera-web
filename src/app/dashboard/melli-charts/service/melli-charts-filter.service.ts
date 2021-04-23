import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MelliChartsFilterService {

  private filters: any = {};

  constructor() { 
    this.filters;
  }
}
