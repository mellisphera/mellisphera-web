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
import { RucheService } from '../accueil/Service/ruche.service';
import { DailyRecordService } from '../accueil/Service/dailyRecordService';
import { ObservationService } from './ruche-detail/observation/service/observation.service';
import { MeteoService } from '../meteo/Service/MeteoService';
var httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
var RucherService = /** @class */ (function () {
    function RucherService(http, user, rucheService, dailyRec, observationService, meteoService) {
        this.http = http;
        this.user = user;
        this.rucheService = rucheService;
        this.dailyRec = dailyRec;
        this.observationService = observationService;
        this.meteoService = meteoService;
        this.ruchers = null;
        if (sessionStorage.getItem('currentUser')) {
            this.getApiaryByUser(this.user.getUser());
        }
        this.initRuche();
    }
    RucherService.prototype.initRuche = function () {
        this.rucher = {
            id: null,
            latitude: '',
            longitude: '',
            name: '',
            description: '',
            createdAt: null,
            photo: 'void',
            username: '',
            codePostal: '',
            ville: ''
        };
        this.rucherUpdate = this.rucher;
        this.detailsRucher = this.rucher;
        this.rucherSelectUpdate = this.rucher;
    };
    // -- RUCHER -- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER --
    // pour créer un rucher
    RucherService.prototype.createRucher = function () {
        var _this = this;
        this.rucherObs = this.http.post(CONFIG.URL + 'apiaries', this.rucher);
        this.rucherObs.subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.getApiaryByUser(_this.user.getUser());
        });
    };
    // pour afficher tout les ruchers de l'utilsateur connecté
    RucherService.prototype.saveCurrentApiaryId = function (idApiary) {
        window.sessionStorage.removeItem('currentApiary');
        window.sessionStorage.setItem("currentApiary", idApiary);
    };
    RucherService.prototype.getCurrentApiary = function () {
        return window.sessionStorage.getItem('currentApiary');
    };
    RucherService.prototype.getApiaryByUser = function (username) {
        var _this = this;
        this.ruchersObs = this.http.get(CONFIG.URL + 'apiaries/' + username);
        this.ruchersObs.subscribe(function (data) {
            if (data.length > 0) {
                _this.rucher = data[data.length - 1];
                _this.currentBackground = _this.rucher.photo;
                _this.saveCurrentApiaryId(_this.rucher.id);
                _this.rucherSelectUpdate = data[data.length - 1];
                _this.ruchers = data;
            }
        }, function (err) {
            console.log(err);
        }, function () {
            if (_this.ruchers.length > 0) {
                _this.observationService.getObservationByIdApiary(_this.rucher.id);
                _this.rucheService.getRucheByApiary(_this.user.getUser(), _this.rucher.id);
                _this.getRucherDetails();
                console.log("APIARY");
                _this.dailyRec.getDailyRecThByApiary(_this.rucher.id);
                _this.meteoService.getWeather(_this.rucher.ville);
            }
        });
    };
    RucherService.prototype.getOneApiaryById = function (idApiary) {
        var _this = this;
        this.rucherObs = this.http.get(CONFIG.URL + 'apiaries/id/' + idApiary);
        this.rucherObs.subscribe(function (data) {
            _this.rucherDemo = data;
        }, function (err) {
            console.log(err);
        });
    };
    RucherService.prototype.getRucherDetails = function () {
        var _this = this;
        this.rucherObs = this.http.get(CONFIG.URL + 'apiaries/details/' + this.rucher.id);
        this.rucherObs.subscribe(function (data) {
            _this.detailsRucher = data;
        }, function (err) {
            console.log(err);
        });
    };
    RucherService.prototype.updateRucher = function () {
        var _this = this;
        this.rucherObs = this.http.put(CONFIG.URL + 'apiaries/update/' + this.detailsRucher.id, this.detailsRucher, httpOptions);
        this.rucherObs.subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.getApiaryByUser(_this.user.getUser());
        });
    };
    RucherService.prototype.deleteRucher = function () {
        var _this = this;
        this.rucherObs = this.http.delete(CONFIG.URL + 'apiaries/' + this.rucher.id);
        this.rucherObs.subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.getApiaryByUser(_this.user.getUser());
        });
    };
    RucherService.prototype.updateBackgroundApiary = function (idApiary) {
        var _this = this;
        this.http.put(CONFIG.URL + 'apiaries/update/background/' + idApiary, this.rucher.photo).subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.currentBackground = _this.rucher.photo;
        });
    };
    RucherService.prototype.errorHandler = function (error) {
        return Observable.throw(error.message || "server error");
    };
    RucherService.prototype.findRucherById = function (idApiary) {
        var _this = this;
        this.ruchers.forEach(function (element) {
            if (element.id == idApiary) {
                _this.rucherUpdate = element;
            }
        });
    };
    RucherService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, UserloggedService,
            RucheService,
            DailyRecordService,
            ObservationService,
            MeteoService])
    ], RucherService);
    return RucherService;
}());
export { RucherService };
//# sourceMappingURL=rucher.service.js.map