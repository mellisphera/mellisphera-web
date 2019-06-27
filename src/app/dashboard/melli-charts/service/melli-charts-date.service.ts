import { Injectable } from '@angular/core';
import { DataRange } from '../../apiary/ruche-rucher/ruche-detail/service/Record/data-range';
import { MyDate } from '../../../class/MyDate';
import { ReactiveFormsModule } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MelliChartsDateService {


  private rangeDateForRequest: Date[]; // for request
  /* Display */
  public start: Date;
  public end: Date;

  public ranges: DataRange[];
  constructor() {
    this.ranges = [
      { scale: 1, type: 'HOUR'},
      { scale: 6, type: 'HOURS'},
      { scale: 12, type: 'HOURS'},
      { scale: 1, type: 'DAY'},
      { scale: 3, type: 'DAYS' },
      { scale: 7, type: 'DAYS' },
      { scale: 15, type: 'DAYS' },
      { scale: 1, type: 'MONTH' },
      { scale: 3, type: 'MONTHS' },
      { scale: 6, type: 'MONTHS' },
      { scale: 1, type: 'YEAR' }
    ];
    this.setRange(this.ranges[6]);
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
        date.setHours(new Date().getHours() - scale.scale);
        break;
      default:
        date.setDate(date.getDate() - 15);
    }
    this.rangeDateForRequest = MyDate.getRange(date);
    this.start = this.rangeDateForRequest[0];
    this.end = this.rangeDateForRequest[1];
  }

  /**
   *
   *
   * @returns {Date[]}
   * @memberof MelliChartsDateService
   */
  getRangeForReqest(): Date[] {
    return this.rangeDateForRequest;
  }

  nextDate() {
    
  }

  previousDate() {

  }
}
