/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { Injectable } from '@angular/core';
import { DataRange } from '../../../_model/data-range';
import { MyDate } from '../../../class/MyDate';
import { ReactiveFormsModule } from '@angular/forms';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

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
/*       { scale: 1, type: 'HOUR'},
      { scale: 6, type: 'HOURS'},
      { scale: 12, type: 'HOURS'}, */
      { scale: 1, type: 'DAY', typeFr: 'JOUR', typeEs: 'Día'},
      { scale: 3, type: 'DAY', typeFr: 'JOUR', typeEs: 'Día'},
      { scale: 7, type: 'DAY', typeFr: 'JOUR', typeEs: 'Día'},
      { scale: 15, type: 'DAY', typeFr: 'JOUR', typeEs: 'Día'},
      { scale: 1, type: 'MONTH', typeFr: 'MOIS', typeEs: 'Mes'},
      { scale: 2, type: 'MONTH', typeFr: 'MOIS', typeEs: 'Mes'},
      { scale: 3, type: 'MONTH', typeFr: 'MOIS', typeEs: 'Mes'},
      { scale: 6, type: 'MONTH', typeFr: 'MOIS', typeEs: 'Mes'},
      { scale: 9, type: 'MONTH', typeFr: 'MOIS', typeEs: 'Mes'},
      { scale: 1, type: 'YEAR', typeFr: 'AN', typeEs: 'Año'}
    ];
    this.setRange(this.ranges[4]);
  }


  setRange(scale: DataRange): void {
    let date = new Date();
    switch(scale.type){
      case 'DAY':
        date.setDate((new Date().getDate() - scale.scale));
        break;
      case 'MONTH':

        switch (scale.scale) {

          case 1:
            date.setDate((new Date().getDate() - 28)); // 28 days (1month)
            break;
          case 2:
            date.setDate((new Date().getDate() - 36)); // 36 days (2month)
            break;
          case 3:
            date.setDate((new Date().getDate() - (28 * 3))); // 84 days (3month)
            break;
          case 6:
            date.setDate((new Date().getDate() - (28 * 6))); // 168 days (6month)
            break;
          case 9:
            date.setDate((new Date().getDate() -  (28 * 9))); // 252 days (9month)
            break;
        }
        break;
      case 'YEAR':
        date.setFullYear(new Date().getFullYear() - 1);
        break;
      case 'HOUR':
        date.setHours(new Date().getHours() - scale.scale);
        break;
      default:
        date.setDate(date.getDate() - 15);
    }
    if (scale.type !== 'DAY') { // skip starting from monday for day (1day and 3daya)
      date = this.getDateBeginMonday(date);
    }

    this.rangeDateForRequest = MyDate.getRange(date);
    this.rangeDateForRequest[0].setHours(0);
    this.rangeDateForRequest[0].setMinutes(0);
    this.rangeDateForRequest[0].setSeconds(0);

    //this.rangeDateForRequest[1].setDate(this.rangeDateForRequest[0].getDate() + 1);
    this.rangeDateForRequest[1].setHours(23);
    this.rangeDateForRequest[1].setMinutes(0);
    this.rangeDateForRequest[1].setSeconds(0);
    console.log(this.rangeDateForRequest);
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

  getDateBeginMonday(date: Date): Date {
    const dayInf: boolean = date.getDate() <= 6;
    while (date.getDay() !== 1) {
      if (dayInf) {
        date.setDate(date.getDate() + 1);
      } else {
        date.setDate(date.getDate() - 1);
      }
    }
    return date
  }

  getDayDiffRangeRequest() {
    const d1 = this.rangeDateForRequest[0].getTime() / 86400000;
    const d2 = this.rangeDateForRequest[1].getTime() / 86400000;
    return (d2 - d1).toFixed(0);
  }


  setRangeForRequest(_range: Date[] ) {
    const range: Date[] = [new Date(_range[0]), new Date(_range[1])];
    range[0].setHours(0);
    range[0].setMinutes(0);
    range[0].setSeconds(0);
    //range[1].setDate(range[1].getDate());
    range[1].setHours(23);
    range[1].setMinutes(0);
    range[1].setSeconds(0);
    this.rangeDateForRequest = [range[0], range[1]];
    console.log(this.rangeDateForRequest);
    this.start = this.rangeDateForRequest[0];
    this.end = this.rangeDateForRequest[1];
  }

}
