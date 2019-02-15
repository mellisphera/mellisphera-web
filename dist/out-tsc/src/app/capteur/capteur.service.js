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
import { CONFIG } from '../../config';
import { UserloggedService } from '../userlogged.service';
var httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
var CapteurService = /** @class */ (function () {
    function CapteurService(http, user) {
        this.http = http;
        this.user = user;
        this.getCapteurs();
        this.getUserCapteurs();
        this.getSoldDevicesByUser();
        this.initCapteur();
    }
    CapteurService.prototype.initCapteur = function () {
        this.capteur = {
            id: null,
            reference: '',
            name: '',
            type: '',
            description: '',
            username: '',
            idHive: '',
            idApiary: '',
            hiveName: '',
            apiaryName: ''
        };
    };
    // pour créer un capteur
    CapteurService.prototype.createCapteur = function () {
        var _this = this;
        this.capteurObs = this.http.post(CONFIG.URL + 'sensors', this.capteur, httpOptions);
        this.capteurObs.subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.getUserCapteurs();
        });
    };
    //get all sensors 
    CapteurService.prototype.getCapteurs = function () {
        var _this = this;
        this.capteursObs = this.http.get(CONFIG.URL + 'sensors/all');
        this.capteursObs.subscribe(function (data) {
            _this.capteurs = data;
            _this.capteur = data[0];
        }, function (err) {
            console.log(err);
        });
    };
    CapteurService.prototype.getSoldDevicesByUser = function () {
        var _this = this;
        this.capteursObs = this.http.get(CONFIG.URL + 'sold_devices/username/' + this.user.currentUser().username);
        this.capteursObs.subscribe(function (data) {
            console.log(data);
            _this.capteurAcheter = data;
        }, function (err) {
            console.log(err);
        });
    };
    CapteurService.prototype.getUserCapteurs = function () {
        var _this = this;
        this.capteursObs = this.http.get(CONFIG.URL + 'sensors/' + this.user.currentUser().username);
        this.capteursObs.subscribe(function (data) {
            _this.capteursByUser = data;
            console.log(_this.capteursByUser);
        }, function (err) {
            console.log(err);
        });
    };
    CapteurService.prototype.deleteCapteur = function () {
        var _this = this;
        this.capteurObs = this.http.delete(CONFIG.URL + 'sensors/' + this.capteur.id);
        this.capteurObs.subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.getUserCapteurs();
        });
    };
    CapteurService.prototype.updateCapteur = function () {
        var _this = this;
        this.capteurObs = this.http.put(CONFIG.URL + 'sensors/update/' + this.capteur.id, this.capteur, httpOptions);
        this.capteurObs.subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.getUserCapteurs();
        });
    };
    CapteurService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, UserloggedService])
    ], CapteurService);
    return CapteurService;
}());
export { CapteurService };
//# sourceMappingURL=capteur.service.js.map