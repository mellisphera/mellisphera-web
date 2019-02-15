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
import { UserloggedService } from '../../userlogged.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { ObservationService } from '../../ruche-rucher/ruche-detail/observation/service/observation.service';
import { MeteoService } from '../../meteo/Service/MeteoService';
var httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
var RucheService = /** @class */ (function () {
    function RucheService(user, http, observationService, meteoService) {
        this.user = user;
        this.http = http;
        this.observationService = observationService;
        this.meteoService = meteoService;
        this.ruches = [];
        this.initRuche();
        this.getRucheByUsername(this.user.currentUser().username);
    }
    RucheService.prototype.initRuche = function () {
        this.ruche = {
            id: null,
            name: '',
            description: '',
            username: '',
            idApiary: '',
            hivePosX: '',
            hivePosY: '',
            sharingUser: []
        };
        this.rucheUpdate = this.ruche;
    };
    RucheService.prototype.getRucheByApiary = function (username, idApiary) {
        var _this = this;
        this.ruches = [];
        this.ruchesObs = this.http.get(CONFIG.URL + 'hives/' + username + '/' + idApiary);
        this.ruchesObs.subscribe(function (data) {
            _this.ruche = data[data.length - 1];
            _this.ruches = data;
            console.log(_this.ruches);
        }, function (err) {
            console.log(err);
        }, function () {
            if (_this.ruches.length > 0) {
                _this.observationService.getObservationByIdApiary(idApiary);
            }
        });
    };
    RucheService.prototype.getRucheByUsername = function (username) {
        var _this = this;
        this.ruchesAllApiary = [];
        this.ruchesObs = this.http.get(CONFIG.URL + 'hives/' + username);
        this.ruchesObs.subscribe(function (data) {
            _this.ruchesAllApiary = data;
        }, function (err) {
            console.log(err);
        });
    };
    RucheService.prototype.updateCoordonneesRuche = function (ruche) {
        var _this = this;
        this.rucheObs = this.http.put(CONFIG.URL + 'hives/update/coordonnees/' + ruche.id, ruche, httpOptions);
        this.rucheObs.subscribe(function () {
            _this.getRucheByApiary(_this.user.currentUser().username, ruche.idApiary);
        }, function (err) {
            console.log(err);
        });
    };
    RucheService.prototype.updateRuche = function (lastIdApiary) {
        var _this = this;
        this.rucheObs = this.http.put(CONFIG.URL + 'hives/update/' + this.ruche.id, this.ruche, httpOptions);
        this.rucheObs.subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.getRucheByApiary(_this.user.currentUser().username, lastIdApiary);
        });
    };
    RucheService.prototype.cleanRuches = function () {
        this.ruches = [];
    };
    RucheService.prototype.createRuche = function () {
        var _this = this;
        this.rucheObs = this.http.post(CONFIG.URL + 'hives', this.ruche, httpOptions);
        this.rucheObs.subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.getRucheByApiary(_this.user.currentUser().username, _this.ruche.idApiary);
        });
    };
    RucheService.prototype.deleteRuche = function () {
        var _this = this;
        this.rucheObs = this.http.delete(CONFIG.URL + 'hives/' + this.ruche.id);
        this.rucheObs.subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.getRucheByApiary(_this.user, _this.ruche.idApiary);
        });
    };
    RucheService.prototype.findRucheById = function (idHive, navHive, callback) {
        var _this = this;
        if (navHive === void 0) { navHive = false; }
        this.ruches.forEach(function (element) {
            if (element.id == idHive) {
                if (navHive) {
                    console.log(element);
                    _this.ruche = element;
                }
                else if (!navHive) {
                    _this.rucheUpdate = element;
                }
            }
        });
    };
    RucheService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [UserloggedService, HttpClient, ObservationService, MeteoService])
    ], RucheService);
    return RucheService;
}());
export { RucheService };
//# sourceMappingURL=ruche.service.js.map