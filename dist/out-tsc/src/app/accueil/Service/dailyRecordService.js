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
import { CONFIG } from '../../../config';
import { UserloggedService } from '../../userlogged.service';
var DailyRecordService = /** @class */ (function () {
    function DailyRecordService(http, user) {
        this.http = http;
        this.user = user;
        this.status = "Inconnu";
        this.dailyRecords = null;
        this.statusLoading = false;
        this.getDailyRecThByApiary(sessionStorage.getItem("idApiaryUpdate"));
    }
    DailyRecordService.prototype.getDailyRecThByIdHivelas = function (idHive) {
        var _this = this;
        this.dailyRecObs = this.http.get(CONFIG.URL + '/dailyRecordsTH/last/' + idHive);
        this.dailyRecObs.subscribe(function (data) {
            _this.dailyRecord = data;
        }, function (err) {
            console.log(err);
        });
    };
    DailyRecordService.prototype.getByIdHive = function (idHive) {
        var _this = this;
        this.dailyRecords = [];
        this.dailyRecObsArray = this.http.get(CONFIG.URL + '/dailyRecordsTH/hive/' + idHive);
        this.dailyRecObsArray.subscribe(function (data) {
            _this.dailyRecords = data;
            _this.dailyRecordToArray();
        }, function (err) {
            console.log(err);
        });
    };
    DailyRecordService.prototype.dailyRecordToArray = function () {
        var _this = this;
        this.arrayTempInt = [];
        this.arrayHint = [];
        this.arrayHealth = [];
        this.dailyRecords.forEach(function (element) {
            _this.arrayTempInt.push([element.recordDate, element.temp_int_max]);
            _this.arrayHint.push([element.recordDate, element.humidity_int_max]);
            _this.arrayHealth.push([element.recordDate, element.health_status, element.health_trend]);
        });
        this.mergeOptionCalendarHealth = {
            series: {
                data: this.arrayHealth
            }
        };
        this.mergeOptionTint = {
            series: {
                data: this.arrayTempInt
            },
            title: {
                text: 'Internal Temperature (max)'
            },
            visualMap: {
                calculable: true,
                min: -10,
                max: 40,
                inRange: {
                    color: ['#abd9e9', '#CC0000']
                }
            },
        };
        this.mergeOptionHint = {
            series: {
                data: this.arrayHint
            },
            title: {
                text: 'Internal Relative Humidity (max)'
            },
            visualMap: {
                orient: 'horizontal',
                top: 20,
                //itemWidth : 0,
                right: '3%',
                type: 'piecewise',
                pieces: [
                    // Range of a piece can be specified by property min and max,
                    // where min will be set as -Infinity if ignored,
                    // and max will be set as Infinity if ignored.
                    { min: 20, max: 50 },
                    { min: 50, max: 75 },
                    { min: 75, max: 87 },
                    { min: 87, max: 100 },
                ],
                inRange: {
                    color: ["#97A6C5", "#6987C5", '#3C68C5', '#05489B'],
                },
            },
        };
        this.statusLoading = true;
    };
    DailyRecordService.prototype.getDailyRecThByApiary = function (idApiary) {
        var _this = this;
        this.dailyRecTabObs = this.http.get(CONFIG.URL + 'dailyRecordsTH/' + this.user.getUser() + '/' + idApiary);
        this.dailyRecords = [];
        this.dailyRecTabObs.subscribe(function (data) {
            if (data[0] != null) {
                _this.dailyRecords = data;
                console.log(_this.dailyRecords);
            }
        }, function (err) {
            console.log(err);
        });
    };
    DailyRecordService.prototype.getStatus = function (id) {
        this.status = "ruche Inconnu";
        this.verifId(id);
        return this.status;
    };
    DailyRecordService.prototype.verifId = function (id) {
        var _this = this;
        this.dailyRecords.forEach(function (element, index) {
            if (element.idHive == id) {
                _this.status = "ruche " + element.health_status + element.health_trend;
            }
        });
    };
    DailyRecordService.prototype.convertDate = function (date) {
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
    DailyRecordService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, UserloggedService])
    ], DailyRecordService);
    return DailyRecordService;
}());
export { DailyRecordService };
//# sourceMappingURL=dailyRecordService.js.map