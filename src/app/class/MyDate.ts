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
    static getRange(min?: Date): Date[] {
        let start = new Date();
        if (!min) {
            start.setDate((start.getDate() - 15));
        } else {
            start = min;
        }
        console.log(new Array(start, new Date()));
        return new Array(start, new Date());
    }

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
     * @static
     * @param {Date} date
     * @returns {string}
     * @memberof MyDate
     */
    static getIsoFromDate(date: Date): string {
        return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
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
        if (parseInt(jour) < 10 ) { jour = '0' + jour; }
        if (parseInt(mois) < 10 ) { mois = '0' + mois; }
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