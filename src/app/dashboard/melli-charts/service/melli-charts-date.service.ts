import { Injectable } from '@angular/core';
import { DataRange } from '../../apiary/ruche-rucher/ruche-detail/service/Record/data-range';
import { MyDate } from '../../../class/MyDate';

@Injectable({
  providedIn: 'root'
})
export class MelliChartsDateService {


  private rangeDateForRequest: Date[];
  private ranges: DataRange[];
  public rangeUserSelect: DataRange;
  constructor() {
    this.ranges = [
      { scale: 1, type: 'HOURS'},
      { scale: 6, type: 'HOURS'},
      { scale: 12, type: 'HOURS'},
      { scale: 1, type: 'DAYS'},
      { scale: 3, type: 'DAYS' },
      { scale: 7, type: 'DAYS' },
      { scale: 15, type: 'DAYS' },
      { scale: 30, type: 'DAYS' },
      { scale: 3, type: 'MONTHS' },
      { scale: 6, type: 'MONTHS' },
      { scale: 1, type: 'YEAR' }
    ];
    this.rangeUserSelect = this.ranges[6];
  }

  
  setRange(scale: DataRange): void {
    let date = new Date();
    switch(scale.type){
      case 'DAYS':
        date.setDate((new Date().getDate() - scale.scale));
        break;
      case 'MONTHS':
        date.setMonth((new Date().getMonth() - scale.scale));
        break;
      case 'YEAR':
        date.setFullYear(new Date().getFullYear() - 1);
        break;
      case 'HOURS':
        date.setHours(scale.scale);
        break;
      default:
        date.setDate(date.getDate() - 15);
    }
    this.rangeDateForRequest = MyDate.getRange(date);
  }
}
