var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { RucherService } from './../ruche-rucher/rucher.service';
import { GraphFlowerService } from './graph/graph-flower.service';
import { GraphHoneyService } from './graph/graph-honey.service';
import { Component } from '@angular/core';
import { FleursFloraisonService } from '../fleurs-floraison/service/fleurs.floraison.service';
import { DailyStockHoneyService } from '../ruche-rucher/ruche-detail/service/daily-stock-honey.service';
import { DailyRecordsWService } from '../ruche-rucher/ruche-detail/service/daily-records-w.service';
import { CalendrierFSTLervice } from './graph/calendrierFSTL';
import { RucheService } from '../accueil/Service/ruche.service';
var DemoComponent = /** @class */ (function () {
    function DemoComponent(fleursFloraisonService, dailyStockHoneyService, dailyRecWService, grahFleur, rucheService, grapheMielService, calendrierPoids, rucherService) {
        this.fleursFloraisonService = fleursFloraisonService;
        this.dailyStockHoneyService = dailyStockHoneyService;
        this.dailyRecWService = dailyRecWService;
        this.grahFleur = grahFleur;
        this.rucheService = rucheService;
        this.grapheMielService = grapheMielService;
        this.calendrierPoids = calendrierPoids;
        this.rucherService = rucherService;
        this.message = "";
    }
    DemoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rucherService.ruchersObs.subscribe(function () { }, function () { }, function () {
            _this.rucheService.ruchesObs.subscribe(function () { }, function () { }, function () {
                console.log(_this.rucherService.rucher);
                _this.dailyRecWService.getDailyRecordsWbyIdHive(_this.rucherService.rucheService.ruche.id);
                console.log(_this.dailyRecWService.dailyRec);
                _this.dailyStockHoneyService.getDailyStockHoneyByApiary(_this.rucherService.rucheService.ruche.id);
            });
        });
    };
    DemoComponent.prototype.receiveMessage = function ($event) {
        this.message = $event;
    };
    DemoComponent = __decorate([
        Component({
            selector: 'app-demo',
            templateUrl: './demo.component.html',
            styleUrls: ['./demo.component.css']
        }),
        __metadata("design:paramtypes", [FleursFloraisonService,
            DailyStockHoneyService,
            DailyRecordsWService,
            GraphFlowerService,
            RucheService,
            GraphHoneyService,
            CalendrierFSTLervice,
            RucherService])
    ], DemoComponent);
    return DemoComponent;
}());
export { DemoComponent };
//# sourceMappingURL=demo.component.js.map