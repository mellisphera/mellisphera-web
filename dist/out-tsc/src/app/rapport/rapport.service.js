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
import { Observable } from 'rxjs/Observable';
import { CONFIG } from '../../config';
import { UserloggedService } from '../userlogged.service';
import { ObservationService } from '../ruche-rucher/ruche-detail/observation/service/observation.service';
var httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
var RapportService = /** @class */ (function () {
    function RapportService(http, username, observationService) {
        this.http = http;
        this.username = username;
        this.observationService = observationService;
        this.rapport = {
            id: '',
            Lruche: [],
            date: '',
            idApiary: '',
            idLHive: [],
            nluScore: 0,
            sentence: '',
            type: '',
            username: ''
        };
    }
    //to save in processReportTemp
    RapportService.prototype.getNluResult = function (texte, idApiary) {
        var _this = this;
        var body = JSON.stringify({ "texte": texte.texte, "idApiary": idApiary });
        //LOCAL
        //return this.http.post('http://localhost:5000/nlu/nluAnalyse',body, httpOptions);
        //SERVEUR
        this.http.post(CONFIG.API_PY + '/nlu/nluAnalyse', body, httpOptions).subscribe(function (data) {
            console.log(data);
            _this.rapport = data;
            console.log(_this.rapport);
        }, function (err) {
            console.log(err);
        }, function () {
            _this.getRapportTemp(_this.username.currentUser().username);
        });
    };
    RapportService.prototype.nluSave = function (rucher) {
        var _this = this;
        this.http.get(CONFIG.URL + 'report_temp/add/' + this.username.currentUser().username).subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.observationService.getObservationByIdApiary(rucher.id);
        });
    };
    RapportService.prototype.getRapportTemp = function (username) {
        var _this = this;
        this.http.get(CONFIG.URL + 'report_temp/' + username).subscribe(function (data) {
            _this.rapports = data;
            console.log(_this.rapports);
        }, function (err) {
            console.log(err);
        });
    };
    RapportService.prototype.deleteObsTemp = function (rapport) {
        var _this = this;
        console.log(rapport);
        this.http.delete(CONFIG.URL + 'report_temp/delete/' + rapport.id).subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.getRapportTemp(_this.username.currentUser().username);
        });
    };
    // error handling
    RapportService.prototype.errorHandler = function (error) {
        return Observable.throw(error.message || "server error");
    };
    RapportService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, UserloggedService, ObservationService])
    ], RapportService);
    return RapportService;
}());
export { RapportService };
//# sourceMappingURL=rapport.service.js.map