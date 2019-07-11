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
    static getRange(min?: Date, max?: Date): Date[] {
        let start = new Date();
        if (!min) {
            start.setDate((start.getDate() - 15));
        } else {
            start = min;
        }
        const end = max ? max : new Date();
        return new Array(start, end);
    }

    /**
     *
     *
     * @static
     * @param {string} dt
     * @returns {Date}
     * @memberof MyDate
     */
    static getWekitDate(dt: string): Date {
        const tmp = dt.split('-');
        const date = new Date();
        date.setFullYear(parseInt(tmp[0], 10));
        date.setMonth(parseInt(tmp[1], 10));
        date.setDate(parseInt(parseInt(tmp[2][0], 10) + '' + parseInt(tmp[2][1], 10), 10));
        return date;
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