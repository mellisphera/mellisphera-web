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
import { DailyRecordsWService } from '../service/daily-records-w.service';
import { CalendrierPoidsService } from './service/calendrier-poids.service';
import { ActivatedRoute } from '@angular/router';
import { DailyStockHoneyService } from '../service/daily-stock-honey.service';
import { GrapheReserveMielService } from './service/graphe-reserve-miel.service';
import { RucheService } from '../../../accueil/Service/ruche.service';
var StockComponent = /** @class */ (function () {
    function StockComponent(dailyRecWService, calendrierPoids, dailyStockHoneyService, grapheMielService, activatedRoute, rucheService) {
        this.dailyRecWService = dailyRecWService;
        this.calendrierPoids = calendrierPoids;
        this.dailyStockHoneyService = dailyStockHoneyService;
        this.grapheMielService = grapheMielService;
        this.activatedRoute = activatedRoute;
        this.rucheService = rucheService;
        this.message = "";
    }
    StockComponent.prototype.ngOnInit = function () {
        /*this.rucheId = this.activatedRoute.snapshot.params.id;
        this.rucheName = this.activatedRoute.snapshot.params.name;
        this.dailyRecWService.getDailyRecordsWbyIdHive(this.rucheService.ruche.id);
        this.dailyStockHoneyService.getDailyStockHoneyByApiary(this.rucheService.ruche.id);*/
    };
    StockComponent.prototype.receiveMessage = function ($event) {
        this.message = $event;
    };
    StockComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.dailyRecWService.cleanQuery();
        this.dailyStockHoneyService.cleanQuery();
    };
    StockComponent.prototype.chartChange = function (event) {
    };
    StockComponent = __decorate([
        Component({
            selector: 'app-stock',
            templateUrl: './stock.component.html',
            styleUrls: ['./stock.component.css']
        }),
        __metadata("design:paramtypes", [DailyRecordsWService,
            CalendrierPoidsService,
            DailyStockHoneyService,
            GrapheReserveMielService,
            ActivatedRoute,
            RucheService])
    ], StockComponent);
    return StockComponent;
}());
export { StockComponent };
//# sourceMappingURL=stock.component.js.map