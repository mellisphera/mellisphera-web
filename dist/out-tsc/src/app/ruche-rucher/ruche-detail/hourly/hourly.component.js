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
import { RecordService } from '../service/Record/record.service';
import { GraphRecordService } from './service/graph-record.service';
import { RucheService } from '../../../accueil/Service/ruche.service';
var HourlyComponent = /** @class */ (function () {
    function HourlyComponent(activatedRoute, recordService, graphRecordService, rucheService) {
        this.activatedRoute = activatedRoute;
        this.recordService = recordService;
        this.graphRecordService = graphRecordService;
        this.rucheService = rucheService;
        this.message = "";
    }
    HourlyComponent.prototype.ngOnInit = function () {
        /*this.rucheId = this.activatedRoute.snapshot.params.id;
        this.rucheName = this.activatedRoute.snapshot.params.name;
        this.recordService.getRecordByIdHive(this.rucheService.ruche.id);*/
    };
    HourlyComponent.prototype.receiveMessage = function ($event) {
        this.message = $event;
    };
    HourlyComponent = __decorate([
        Component({
            selector: 'app-hourly',
            templateUrl: './hourly.component.html',
            styleUrls: ['./hourly.component.css']
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            RecordService,
            GraphRecordService,
            RucheService])
    ], HourlyComponent);
    return HourlyComponent;
}());
export { HourlyComponent };
//# sourceMappingURL=hourly.component.js.map