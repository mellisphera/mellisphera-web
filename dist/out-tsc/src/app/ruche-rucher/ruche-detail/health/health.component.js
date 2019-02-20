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
import { ActivatedRoute } from '@angular/router';
import { CalendrierHealthService } from './service/calendrier-health.service';
import { DailyRecordService } from '../../../accueil/Service/dailyRecordService';
var HealthComponent = /** @class */ (function () {
    function HealthComponent(activatedRoute, calendrierHealthService, dailyRecordThService) {
        this.activatedRoute = activatedRoute;
        this.calendrierHealthService = calendrierHealthService;
        this.dailyRecordThService = dailyRecordThService;
        this.message = "";
    }
    HealthComponent.prototype.ngOnInit = function () {
        /*9this.rucheId = this.activatedRoute.snapshot.params.id;
        this.rucheName = this.activatedRoute.snapshot.params.name;
        this.dailyRecordThService.getByIdHive(this.rucheId);*/
    };
    HealthComponent.prototype.receiveMessage = function ($event) {
        this.message = $event;
    };
    HealthComponent.prototype.ngOnDestroy = function () {
    };
    HealthComponent = __decorate([
        Component({
            selector: 'app-health',
            templateUrl: './health.component.html',
            styleUrls: ['./health.component.css']
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            CalendrierHealthService,
            DailyRecordService])
    ], HealthComponent);
    return HealthComponent;
}());
export { HealthComponent };
//# sourceMappingURL=health.component.js.map