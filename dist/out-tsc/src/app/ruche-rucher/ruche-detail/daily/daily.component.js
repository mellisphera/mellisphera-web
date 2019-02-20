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
import { CalendrierTempIntService } from './service/calendrier-temp-int.service';
import { ActivatedRoute } from '@angular/router';
import { DailyRecordService } from '../../../accueil/Service/dailyRecordService';
import { DailyRecordsWService } from '../service/daily-records-w.service';
import { RucheService } from '../../../accueil/Service/ruche.service';
var DailyComponent = /** @class */ (function () {
    function DailyComponent(calendrierTempInt, activatedRoute, dailyRecordThService, dailyRecordWservice, rucheService) {
        this.calendrierTempInt = calendrierTempInt;
        this.activatedRoute = activatedRoute;
        this.dailyRecordThService = dailyRecordThService;
        this.dailyRecordWservice = dailyRecordWservice;
        this.rucheService = rucheService;
        this.message = "";
    }
    DailyComponent.prototype.ngOnInit = function () {
        /*this.rucheId = this.activatedRoute.snapshot.params.id;
        this.dailyRecordThService.getByIdHive(this.rucheId);
        this.dailyRecordWservice.getDailyRecordsWbyIdHive(this.rucheService.ruche.id);*/
    };
    DailyComponent = __decorate([
        Component({
            selector: 'app-daily',
            templateUrl: './daily.component.html',
            styleUrls: ['./daily.component.css']
        }),
        __metadata("design:paramtypes", [CalendrierTempIntService, ActivatedRoute,
            DailyRecordService,
            DailyRecordsWService,
            RucheService])
    ], DailyComponent);
    return DailyComponent;
}());
export { DailyComponent };
//# sourceMappingURL=daily.component.js.map