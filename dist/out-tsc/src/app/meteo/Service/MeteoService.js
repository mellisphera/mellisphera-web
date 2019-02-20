var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserloggedService } from '../../userlogged.service';
import { CalendrierService } from './calendrier.service';
import { GraphMeteoService } from './graph-meteo.service';
/*
    class dont les fonctions éxécute les requetes
*/
var MeteoService = /** @class */ (function () {
    function MeteoService(celendrier, httpClient, login, graphMeteo) {
        this.celendrier = celendrier;
        this.httpClient = httpClient;
        this.login = login;
        this.graphMeteo = graphMeteo;
        this.data = null;
        this.meteo = null;
        this.arrayMeteo = [];
        this.mergeOption = null;
        this.mergeOptionGraph = null;
        this.meteo = [];
    }
    MeteoService.prototype.getWeather = function (city) {
        var _this = this;
        this.status = false;
        this.ville = city;
        this.arrayMeteo = [];
        this.meteoObs = this.httpClient.get('https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&appid=110ff02ed24ccd819801248373c3b208');
        this.meteoObs.subscribe(function (data) {
            var date = null;
            var premierElement = data['list'][0];
            _this.meteo = [];
            _this.meteo.push({
                date: _this.convertDate(premierElement.dt_txt),
                humidity: premierElement.main.humidity,
                icons: premierElement.weather[0].icon,
                tempMin: Math.round(premierElement.main.temp_min),
                tempMax: Math.round(premierElement.main.temp_max),
                tempMoy: (premierElement.main.temp_min + premierElement.main.temp_max) / 2
            });
            data['list'].forEach(function (element) {
                var heure = new Date(element.dt_txt).getHours();
                date = new Date(element.dt_txt);
                if (heure == 12 && date.getDate() != new Date().getDate()) {
                    _this.meteo.push({
                        date: _this.convertDate(element.dt_txt),
                        humidity: element.main.humidity,
                        icons: element.weather[0].icon,
                        tempMin: Math.round(element.main.temp_min),
                        tempMax: Math.round(element.main.temp_max),
                        tempMoy: (element.main.temp_min + element.main.temp_max) / 2
                    });
                }
            });
            _this.getArray();
            _this.mergeOption = {
                series: [{
                        data: _this.arrayMeteo
                    },
                ],
            };
            _this.mergeOptionGraph = {
                xAxis: {
                    type: 'category',
                    data: _this.tabDate
                },
                series: [
                    {
                        data: _this.tabTempMoy
                    },
                    {
                        data: _this.tabHumidty
                    }
                ]
            };
            _this.status = true;
        }, function (err) {
            console.log(err);
        }, function () {
        });
    };
    MeteoService.prototype.convertDate = function (date) {
        var dateIso = new Date(date);
        var jour = '' + dateIso.getDate();
        var mois = '' + (dateIso.getMonth() + 1);
        var anee = dateIso.getFullYear();
        if (parseInt(jour) < 10) {
            jour = '0' + jour;
        }
        if (parseInt(mois) < 10) {
            mois = '0' + mois;
        }
        return anee + '-' + mois + '-' + jour;
    };
    MeteoService.prototype.getArray = function () {
        var _this = this;
        this.tabHumidty = [];
        this.tabTempMoy = [];
        this.tabDate = [];
        this.tabHeatmap = [];
        this.meteo.forEach(function (element) {
            _this.arrayMeteo.push([element.date, element.icons, element.tempMin, element.tempMax]);
            _this.tabTempMoy.push(element.tempMoy.toFixed(2));
            _this.tabDate.push(element.date);
            _this.tabHeatmap.push([element.date, element.humidity]);
            _this.tabHumidty.push(element.humidity);
        });
    };
    MeteoService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CalendrierService, HttpClient, UserloggedService, GraphMeteoService])
    ], MeteoService);
    return MeteoService;
}());
export { MeteoService };
//# sourceMappingURL=MeteoService.js.map