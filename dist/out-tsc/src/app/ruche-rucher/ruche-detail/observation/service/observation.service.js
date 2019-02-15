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
import { CONFIG } from '../../../../../config';
var httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
var ObservationService = /** @class */ (function () {
    function ObservationService(http) {
        this.http = http;
    }
    ObservationService.prototype.getObservationByIdHive = function (idHive) {
        var _this = this;
        this.observationsObs = this.http.get(CONFIG.URL + 'report/hive/' + idHive);
        this.observationsObs.subscribe(function (data) {
            _this.observationsHive = data;
            console.log(_this.observationsHive);
        }, function (err) {
            console.log(err);
        });
    };
    ObservationService.prototype.getObservationByIdApiary = function (idApiary) {
        var _this = this;
        this.http.get(CONFIG.URL + 'report/apiary/' + idApiary).subscribe(function (data) {
            _this.observationsApiary = data;
        }, function (err) {
            console.log(err);
        });
    };
    ObservationService.prototype.createObservation = function () {
        var _this = this;
        this.observationObs = this.http.put(CONFIG.URL + 'report/insert', this.observation);
        this.observationObs.subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.getObservationByIdHive(_this.observation.idHive);
            _this.getObservationByIdApiary(_this.observation.idApiary);
        });
    };
    ObservationService.prototype.updateObservation = function () {
        var _this = this;
        this.observationObs = this.http.put(CONFIG.URL + 'report/update/' + this.observation.id, this.observation);
        this.observationObs.subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.getObservationByIdHive(_this.observation.idHive);
        });
    };
    ObservationService.prototype.deleteObservation = function () {
        var _this = this;
        this.observationObs = this.http.delete(CONFIG.URL + 'report/' + this.observation.id);
        this.observationObs.subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.getObservationByIdHive(_this.observation.idHive);
            _this.getObservationByIdApiary(_this.observation.idApiary);
        });
    };
    ObservationService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], ObservationService);
    return ObservationService;
}());
export { ObservationService };
//# sourceMappingURL=observation.service.js.map