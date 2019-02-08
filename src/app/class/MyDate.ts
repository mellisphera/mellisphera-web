export class MyDate {
    
    private date: Date;

    constructor(date: Date) {
        if (date) {
            this.date = new Date(date);
        }
    }

    getMonth(): number {
        return this.date.getMonth();
    }

    getMyIso() {
        let jour = '' + this.date.getDate();
        let mois = '' + (this.date.getMonth() + 1);
        const annee = this.date.getFullYear();
        if (parseInt(jour) < 10 ) { jour = '0' + jour; }
        if (parseInt(mois) < 10 ) { mois = '0' + mois; }
        return annee + '-' + mois + '-' + jour;
    }
    getDay() {
        return this.date.getDay();
    }
}