var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
var CalendrierService = /** @class */ (function () {
    function CalendrierService() {
        this.rangeCalendar = [];
        var max = new Date();
        var min = new Date((max.getFullYear() - 1) + '-' + (max.getMonth() + 1) + '-' + max.getDate());
        this.rangeCalendar = [this.convertDate(min), this.convertDate(max)];
        console.log(this.rangeCalendar);
    }
    CalendrierService.prototype.convertDate = function (date) {
        var jour = '' + date.getDate();
        var mois = '' + (date.getMonth() + 1);
        var anee = date.getFullYear();
        if (parseInt(jour) < 10) {
            jour = '0' + jour;
        }
        if (parseInt(mois) < 10) {
            mois = '0' + mois;
        }
        return anee + '-' + mois + '-' + jour;
    };
    CalendrierService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], CalendrierService);
    return CalendrierService;
}());
export { CalendrierService };
//# sourceMappingURL=calendrier.service.js.map