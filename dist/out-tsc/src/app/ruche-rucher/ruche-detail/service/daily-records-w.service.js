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
import { CONFIG } from '../../../../config';
var httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
var DailyRecordsWService = /** @class */ (function () {
    function DailyRecordsWService(http) {
        this.http = http;
        this.mergeOption = null;
        this.rangeCalendar = [];
        var max = new Date();
        var min = new Date((max.getFullYear() - 1) + '-' + (max.getMonth() + 1) + '-' + max.getDate());
        this.rangeCalendar = [this.convertDate(min), this.convertDate(max)];
        console.log(this.rangeCalendar);
        this.dailyRecArray = [];
        this.updateCalendar();
    }
    DailyRecordsWService.prototype.getDailyRecordsWbyIdHive = function (idHive) {
        var _this = this;
        this.currentIdHive = idHive;
        this.dailyRecArray = [];
        this.arrayTempExt = [];
        this.dailyRec = [];
        this.dailyObs = this.http.get(CONFIG.URL + 'dailyRecordsW/hive/' + idHive);
        this.dailyObs.subscribe(function (data) {
            if (data.length > 0) {
                _this.dailyRec = data;
                _this.getArray();
                _this.updateCalendar();
            }
        }, function (err) {
            console.log(err);
        });
    };
    DailyRecordsWService.prototype.updateCalendar = function () {
        this.mergeOption = {
            series: [
                {
                    data: this.dailyRecArray,
                },
                {
                    data: this.dailyRecArray,
                },
            ]
        };
        this.mergeOptionTempExt = {
            series: {
                data: this.arrayTempExt
            },
            title: {
                text: 'External Temperature (max)'
            },
            visualMap: {
                min: -10,
                max: 40,
                calculable: true,
                inRange: {
                    color: ['#abd9e9', '#CC0000']
                },
            }
        };
    };
    DailyRecordsWService.prototype.cleanQuery = function () {
        this.dailyRec = [];
        this.dailyRecArray = [];
        this.dailyObs = null;
        this.mergeOption = null;
    };
    DailyRecordsWService.prototype.convertDate = function (date) {
        var jour = '' + date.getDate();
        var mois = '' + (date.getMonth() + 1);
        var anee = date.getFullYear();
        if (parseInt(jour) < 10) {
            jour = '0' + jour;
        }
        if (parseInt(mois) < 10) {
            mois = '0' + mois;
        }
        return anee + '-' + mois + '-' + jour;
    };
    DailyRecordsWService.prototype.getMonth = function (date) {
        return (new Date(date).getMonth() + 1);
    };
    DailyRecordsWService.prototype.getYear = function (date) {
        return new Date(date).getFullYear();
    };
    DailyRecordsWService.prototype.getArray = function () {
        var _this = this;
        this.timeLine = [];
        var lastMonth = null;
        this.dailyRec.forEach(function (element, index) {
            _this.arrayTempExt.push([element.recordDate, element.temp_ext_max]);
            if (_this.getMonth(element.recordDate) != lastMonth) {
                _this.timeLine.push(element.recordDate);
            }
            _this.dailyRecArray.push([
                element.recordDate,
                element.weight_income_gain
            ]);
            lastMonth = _this.getMonth(element.recordDate);
        });
    };
    DailyRecordsWService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], DailyRecordsWService);
    return DailyRecordsWService;
}());
export { DailyRecordsWService };
//# sourceMappingURL=daily-records-w.service.js.map