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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../config';
var httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
var RucheDetailService = /** @class */ (function () {
    function RucheDetailService(http) {
        this.http = http;
    }
    // -- RUCHER -- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER --
    // pour afficher tout les ruchers de l'utilsateur connecté
    RucheDetailService.prototype.getObservationsHive = function (idHive) {
        return this.http.get(CONFIG.URL + 'report/hive/' + idHive);
    };
    // pour afficher tout les ruchers de l'utilsateur connecté
    RucheDetailService.prototype.deleteReport = function (report) {
        return this.http.delete(CONFIG.URL + 'report/' + report.sentence);
    };
    RucheDetailService.prototype.errorHandler = function (error) {
        return Observable.throw(error.message || "server error");
    };
    RucheDetailService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], RucheDetailService);
    return RucheDetailService;
}());
export { RucheDetailService };
//# sourceMappingURL=ruche.detail.service.js.map