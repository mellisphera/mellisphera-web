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
import * as moment from 'moment';

export class MyDate {
    private date: Date;
    /**
     *
     *
     * @static
     * @param {Date} [min]
     * @returns {Date[]}
     * @memberof MyDate
     */
    static getRange(start: Date): Date[] {
        const end = new Date();
        return new Array(start, end);
    }

    /**
     *getWekitDate
     *
     * @static
     * @param {string} dt
     * @returns {Date}
     * @memberof MyDate
     */
    static getWekitDate(dt: string): Date {
        try{
            const tmp = dt.split('-');
            const date = new Date();
            date.setFullYear(parseInt(tmp[0]));
            date.setMonth(parseInt(tmp[1])-1);
            date.setDate(parseInt(parseInt(tmp[2][0]) + '' + parseInt(tmp[2][1])));
            const hourly = tmp[2].split('T')[1].split(':');
            date.setHours(parseInt(hourly[0]));
            date.setMinutes(parseInt(hourly[1]));
            // date.setHours()
            return date;
        } catch{}
    }


    static compareToDailyDate(dt1: any, dt2: any) {
        let date1: Date;
        let date2: Date;
        if (/-/g.test(dt1)) {
            date1 = new Date(dt1.replace(/-/g, '/').split('T')[0]);
        } else {
            date1 = new Date(dt1);
        }
        if (/-/g.test(dt2) && !/GMT/g.test(dt2)) {
            date2 = new Date(dt2.replace(/-/g, '/').split('T')[0]);
        } else {
            date2 = new Date(dt2);
        }
        const day1 = date1.getDate();
        const day2 = date2.getDate();
        return (day1 === day2) &&
                (date1.getMonth() === date2.getMonth()) &&
                (date1.getFullYear() === date2.getFullYear());
    }

   static convertDate(date: Date){
        let jour = '' + date.getDate();
        let mois = '' + (date.getMonth() + 1);
        let anee = date.getFullYear();
        if (parseInt(jour, 10) < 10 ) { jour = '0' + jour; }
        if (parseInt(mois, 10) < 10 ) { mois = '0' + mois; }
        return anee + '-' + mois + '-' + jour;
      }

    static getRangeForCalendar(){
        let max = new Date();
        let tmp = (max.getFullYear() - 1) + '-' + (max.getMonth() + 1) + '-' + max.getDate();
        let min = (max.getFullYear() - 1) + '-' + (max.getMonth() + 1) + '-' + max.getDate();
        let rangeCalendar = [min, MyDate.convertDate(max)];
        return rangeCalendar;
      }

      static getRangeForCalendarHome(){
        let max = new Date();
        let tmp = (max.getFullYear()) + '-' + (max.getMonth()-1) + '-' + max.getDate();
        let min = (max.getFullYear()) + '-' + (max.getMonth()-1) + '-' + max.getDate();
        let rangeCalendar = [min, MyDate.convertDate(max)];
        return rangeCalendar;
      }

      /**
       *
       *
       * @static
       * @returns {Date[]}
       * @memberof MyDate
       */
      static getRangeForCalendarAlerts(): Date[]{
        const day: number[] = [34, 28, 29, 30, 31, 32, 33];
        let max = new Date();
        let min = new Date();
        let nbDay = day[min.getDay()];
        min.setDate(min.getDate() - nbDay);
        //min.setDate(max.getDate() + 7);

        max.setDate(max.getDate());
        return [min, max];
      }
    
/*     static getRangeFromDate(date: Date[]) {

    } */
    /**
     *
     *
     * @static
     * @param {Date} date
     * @returns {Date}
     * @memberof MyDate
     */
    static calcLastYear(date: Date): Date {
        const newDate = date;
        newDate.setFullYear(date.getFullYear() - 1);
        return newDate;
    }

    /**
     *
     *
     * @param {Date} date
     * @returns {Date}
     * @memberof MyDate
     */
    static getLocalDate(date: Date): Date {
        return new Date(date.toLocaleString());
      }

    /**
     *
     *
     * @static
     * @param {Date} date
     * @returns {string}
     * @memberof MyDate
     */
    static getIsoFromDate(date: Date): string {
        return  (date.getFullYear()) + '-' + (date.getMonth()) + '-' + date.getDate();
    }

    constructor(date: Date) {
        this.date = new Date(date);
    }

    /**
     *
     *
     * @returns {number}
     * @memberof MyDate
     */
    getMonth(): number {
        return this.date.getMonth();
    }
    /**
     *
     *
     * @returns {string}
     * @memberof MyDate
     */
    getIso(): string {
        let jour = '' + this.date.getDate();
        let mois = '' + (this.date.getMonth() + 1);
        const annee = this.date.getFullYear();
        if (parseInt(jour, 10) < 10 ) { jour = '0' + jour; }
        if (parseInt(mois ,10) < 10 ) { mois = '0' + mois; }
        return annee + '-' + mois + '-' + jour;
    }

    /**
     *
     *
     * @returns {number}
     * @memberof MyDate
     */
    getDay(): number {
        return this.date.getDay();
    }

    /**
     *
     *
     * @returns {number}
     * @memberof MyDate
     */
    getYear(): number {
        return this.date.getFullYear();
    }


}