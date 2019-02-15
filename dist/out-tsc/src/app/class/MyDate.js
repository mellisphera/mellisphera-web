var MyDate = /** @class */ (function () {
    function MyDate(date) {
        this.date = new Date(date);
    }
    MyDate.prototype.getMonth = function () {
        return this.date.getMonth();
    };
    MyDate.prototype.getIso = function () {
        var jour = '' + this.date.getDate();
        var mois = '' + (this.date.getMonth() + 1);
        var annee = this.date.getFullYear();
        if (parseInt(jour) < 10) {
            jour = '0' + jour;
        }
        if (parseInt(mois) < 10) {
            mois = '0' + mois;
        }
        return annee + '-' + mois + '-' + jour;
    };
    MyDate.prototype.getDay = function () {
        return this.date.getDay();
    };
    MyDate.prototype.getYear = function () {
        return this.date.getFullYear();
    };
    return MyDate;
}());
export { MyDate };
//# sourceMappingURL=MyDate.js.map