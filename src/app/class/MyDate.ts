export class MyDate {
    
    private date: Date;

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
    constructor(date: Date) {
        this.date = new Date(date);
    }

    getMonth(): number {
        return this.date.getMonth();
    }

    getIso(): string {
        let jour = '' + this.date.getDate();
        let mois = '' + (this.date.getMonth() + 1);
        const annee = this.date.getFullYear();
        if (parseInt(jour) < 10 ) { jour = '0' + jour; }
        if (parseInt(mois) < 10 ) { mois = '0' + mois; }
        return annee + '-' + mois + '-' + jour;
    }
    getDay(): number {
        return this.date.getDay();
    }

    getYear(): number {
        return this.date.getFullYear();
    }


}