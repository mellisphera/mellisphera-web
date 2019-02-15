var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
// Pipe de traitement des listes
var PipeCapteur = /** @class */ (function () {
    function PipeCapteur() {
    }
    PipeCapteur.prototype.transform = function (values, filtre) {
        if (!values || !values.length)
            return [];
        if (!filtre)
            return values;
        return values.filter(function (v) {
            if (v.reference) {
                return v.reference.indexOf(filtre.toUpperCase()) >= 0;
            }
        });
    };
    PipeCapteur = __decorate([
        Pipe({ name: 'capteurPipe' })
    ], PipeCapteur);
    return PipeCapteur;
}());
export { PipeCapteur };
var SearchCapteur = /** @class */ (function () {
    function SearchCapteur() {
    }
    SearchCapteur.prototype.transform = function (values, filtre) {
        if (!values || !values.length)
            return [];
        if (!filtre)
            return values;
        var filtreOrigin = filtre.split(":");
        this.typeSearch = filtreOrigin[0];
        this.searchValue = filtreOrigin[1];
        if (this.typeSearch == "hname") {
            this.currentFilter == "hiveName";
        }
        else if (this.typeSearch == "aname") {
            this.currentFilter == "apiaryName";
        }
        return values.filter(function (v) {
            if (v.type) {
                return v.type.indexOf(filtre) >= 0;
            }
        });
    };
    SearchCapteur = __decorate([
        Pipe({ name: 'searchCapteur' })
    ], SearchCapteur);
    return SearchCapteur;
}());
export { SearchCapteur };
//# sourceMappingURL=capteur.pipe.js.map