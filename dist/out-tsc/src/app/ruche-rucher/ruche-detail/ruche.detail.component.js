var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserloggedService } from '../../userlogged.service';
import { DailyRecordsWService } from './service/daily-records-w.service';
import { DailyStockHoneyService } from './service/daily-stock-honey.service';
import { RecordService } from './service/Record/record.service';
import { DailyRecordService } from '../../accueil/Service/dailyRecordService';
import { RucheService } from '../../accueil/Service/ruche.service';
import { ObservationService } from './observation/service/observation.service';
import { CONFIG } from '../../../config';
import { CalendrierTempIntService } from './daily/service/calendrier-temp-int.service';
import { AtokenStorageService } from '../../auth/Service/atoken-storage.service';
var RucheDetailComponent = /** @class */ (function () {
    function RucheDetailComponent(activatedRoute, route, rucheService, observationService, dailyRecordThService, dailyRecordWservice, dailyStockHoneyService, recordService, userService, tokenService, calendrierTempInt) {
        this.activatedRoute = activatedRoute;
        this.route = route;
        this.rucheService = rucheService;
        this.observationService = observationService;
        this.dailyRecordThService = dailyRecordThService;
        this.dailyRecordWservice = dailyRecordWservice;
        this.dailyStockHoneyService = dailyStockHoneyService;
        this.recordService = recordService;
        this.userService = userService;
        this.tokenService = tokenService;
        this.calendrierTempInt = calendrierTempInt;
        this.message = "";
        this.rucheId = null;
        this.compteurHive = 0;
        this.currentTab = 'notes';
        this.img = CONFIG.URL_FRONT + "assets/icons/next-button-4.png";
    }
    RucheDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rucheId = this.activatedRoute.snapshot.params.id;
        this.rucheName = this.activatedRoute.snapshot.params.name;
        console.log(this.rucheId);
        this.rucheService.ruchesObs.subscribe(function () { }, function () { }, function () {
            if (_this.rucheService.ruches.length < 1) {
                _this.rucheService.getRucheByApiary(_this.userService.getUser(), window.sessionStorage.getItem("currentApiary"));
                _this.rucheService.ruchesObs.subscribe(function () { }, function () { }, function () {
                    _this.observationService.getObservationByIdHive(_this.rucheId);
                    _this.rucheService.findRucheById(_this.rucheId, true);
                    console.log(_this.rucheService.ruche);
                    _this.compteurHive = _this.rucheService.ruches.indexOf(_this.rucheService.ruche);
                });
            }
            else {
                _this.observationService.getObservationByIdHive(_this.rucheId);
                _this.rucheService.findRucheById(_this.rucheId, true);
                console.log(_this.rucheService.ruche);
                _this.compteurHive = _this.rucheService.ruches.indexOf(_this.rucheService.ruche);
            }
        });
        //this.route.navigate(['/ruche-detail/'+this.rucheId+'/'+this.rucheName+'/observation/'+this.rucheId+'/'+this.rucheName]);
    };
    RucheDetailComponent.prototype.receiveMessage = function ($event) {
        this.message = $event;
    };
    RucheDetailComponent.prototype.previousHive = function () {
        if (this.compteurHive != 0 && this.compteurHive != -1) {
            this.compteurHive--;
            this.rucheService.ruche = this.rucheService.ruches[this.compteurHive];
            this.rucheId = this.rucheService.ruche.id;
            this.rucheName = this.rucheService.ruche.name;
            this.exeData();
        }
    };
    RucheDetailComponent.prototype.nextHive = function () {
        if (this.compteurHive != this.rucheService.ruches.length - 1) {
            this.compteurHive++;
        }
        this.rucheService.ruche = this.rucheService.ruches[this.compteurHive];
        this.rucheId = this.rucheService.ruche.id;
        this.rucheName = this.rucheService.ruche.name;
        this.exeData();
    };
    RucheDetailComponent.prototype.onTab = function (event) {
        this.currentTab = event;
        console.log(this.currentTab);
        this.exeData();
    };
    RucheDetailComponent.prototype.exeData = function () {
        if (this.currentTab.indexOf("notes") != -1) {
            this.observationService.getObservationByIdHive(this.rucheId);
        }
        else if (this.currentTab.indexOf("daily") != -1) {
            this.dailyRecordThService.getByIdHive(this.rucheId);
            this.dailyRecordWservice.getDailyRecordsWbyIdHive(this.rucheId);
        }
        else if (this.currentTab.indexOf("stock") != -1) {
            if (this.dailyStockHoneyService.cuurrentIdHive != this.rucheId) {
                console.log("graph");
                //this.dailyRecordWservice.getDailyRecordsWbyIdHive(this.rucheService.ruche.id);
                this.dailyStockHoneyService.getDailyStockHoneyByApiary(this.rucheId);
            }
            if (this.dailyRecordWservice.currentIdHive != this.rucheId) {
                console.log("calendrier");
                this.dailyRecordWservice.getDailyRecordsWbyIdHive(this.rucheId);
            }
        }
        else if (this.currentTab.indexOf("hourly") != -1) {
            if (this.recordService.currentIdHive != this.rucheId) {
                this.recordService.getRecordByIdHive(this.rucheId);
            }
        }
        else if (this.currentTab.indexOf("health") != -1) {
            this.dailyRecordThService.getByIdHive(this.rucheId);
        }
        else if (this.currentTab.indexOf("stack") != -1) {
            if (this.recordService.currentIdHive != this.rucheId) {
                this.recordService.getRecordByIdHive(this.rucheId);
            }
        }
        console.log(this.rucheService.ruche);
    };
    RucheDetailComponent = __decorate([
        Component({
            selector: 'app-ruche-detail',
            templateUrl: './ruche.detail.component.html',
            styleUrls: ['./ruche.detail.component.scss']
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            Router,
            RucheService,
            ObservationService,
            DailyRecordService,
            DailyRecordsWService,
            DailyStockHoneyService,
            RecordService,
            UserloggedService,
            AtokenStorageService,
            CalendrierTempIntService])
    ], RucheDetailComponent);
    return RucheDetailComponent;
}());
export { RucheDetailComponent };
//# sourceMappingURL=ruche.detail.component.js.map