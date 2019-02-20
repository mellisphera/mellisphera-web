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
import { MeteoService } from './Service/MeteoService';
//import * as echarts from '../../../assets/echarts';
import { UserloggedService } from '../userlogged.service';
import { RucherService } from '../ruche-rucher/rucher.service';
//import * as echarts from 'node_modules/echarts/dist/echarts.min.js'
import { CalendrierService } from './Service/calendrier.service';
import { GraphMeteoService } from './Service/graph-meteo.service';
var MeteoComponent = /** @class */ (function () {
    function MeteoComponent(rucherService, meteoService, login, calendrier, graphMeteo) {
        this.rucherService = rucherService;
        this.meteoService = meteoService;
        this.login = login;
        this.calendrier = calendrier;
        this.graphMeteo = graphMeteo;
        this.calendrierInit = null;
        this.message = "";
    }
    MeteoComponent.prototype.receiveMessage = function ($event) {
        this.message = $event;
    };
    MeteoComponent.prototype.ngOnInit = function () {
        this.username = this.login.currentUser().username;
        // this.meteoService.getWeather(this.rucherService.rucher.ville);
    };
    MeteoComponent.prototype.onSelectRucher = function ($event) {
        this.meteoService.getWeather(this.rucherService.rucher.ville);
    };
    MeteoComponent.prototype.onMouseouver = function ($event) {
    };
    MeteoComponent.prototype.onClick = function ($event) {
    };
    MeteoComponent.prototype.ngDoCheck = function () {
        try {
        }
        catch (e) {
            console.log(e);
        }
    };
    MeteoComponent = __decorate([
        Component({
            selector: 'app-meteo',
            templateUrl: './meteo.component.html',
            styleUrls: ['./meteo.component.scss']
        }),
        __metadata("design:paramtypes", [RucherService, MeteoService,
            UserloggedService,
            CalendrierService,
            GraphMeteoService])
    ], MeteoComponent);
    return MeteoComponent;
}());
export { MeteoComponent };
//# sourceMappingURL=meteo.component.js.map