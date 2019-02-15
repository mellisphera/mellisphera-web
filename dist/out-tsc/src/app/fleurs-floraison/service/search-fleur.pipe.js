var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
var SearchFleurPipe = /** @class */ (function () {
    function SearchFleurPipe() {
    }
    SearchFleurPipe.prototype.transform = function (values, filtre) {
        if (!values || !values.length)
            return [];
        if (!filtre)
            return values;
        return values.filter(function (v) {
            if (v.flowerApi.francais) {
                return v.flowerApi.francais.toLowerCase().indexOf(filtre) >= 0;
            }
        });
    };
    SearchFleurPipe = __decorate([
        Pipe({
            name: 'searchFleur'
        })
    ], SearchFleurPipe);
    return SearchFleurPipe;
}());
export { SearchFleurPipe };
var searchFleurByType = /** @class */ (function () {
    function searchFleurByType() {
    }
    searchFleurByType.prototype.transform = function (values, filtre) {
        if (!values || !values.length)
            return [];
        if (!filtre)
            return values;
        return values.filter(function (v) {
            if (v.type) {
                return v.type.indexOf(filtre) >= 0;
            }
        });
    };
    searchFleurByType = __decorate([
        Pipe({
            name: 'searchFleurByType'
        })
    ], searchFleurByType);
    return searchFleurByType;
}());
export { searchFleurByType };
var searchFleurByDate = /** @class */ (function () {
    function searchFleurByDate() {
    }
    searchFleurByDate.prototype.transform = function (values, filtre) {
        if (!values || !values.length || values == 0)
            return [];
        if (!filtre)
            return values;
        return values.filter(function (v) {
            var dateValue = new Date();
            dateValue.setFullYear(new Date().getFullYear());
            dateValue.setMonth((v.flowerApi.flomind.split("-"))[0]);
            dateValue.setDate((v.flowerApi.flomind.split("-"))[1]);
            if (v.flowerApi.flomind) {
                return dateValue.getMonth() + '' == filtre;
            }
        });
    };
    searchFleurByDate = __decorate([
        Pipe({
            name: 'searchFleurByDate'
        })
    ], searchFleurByDate);
    return searchFleurByDate;
}());
export { searchFleurByDate };
//# sourceMappingURL=search-fleur.pipe.js.map