var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/*
    class dont les fonctions éxécute les requetes
*/
var Requete = /** @class */ (function () {
    function Requete(httpClient) {
        this.httpClient = httpClient;
        this.city = 'Pau';
    }
    /*
    Recupere l'url depuis laquelle on va faire la requete
    */
    Requete.prototype.setUrl = function (url) {
        this.urlRequete = url;
    };
    /*
        Exécute la requete
    */
    Requete.prototype.exeRequete = function () {
        var _this = this;
        this.httpClient.get(this.urlRequete).subscribe(function (reponse) {
            _this.data = reponse;
        });
    };
    Requete.prototype.getDataRequete = function () {
        return this.data;
    };
    Requete = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], Requete);
    return Requete;
}());
export { Requete };
//# sourceMappingURL=Requete.js.map