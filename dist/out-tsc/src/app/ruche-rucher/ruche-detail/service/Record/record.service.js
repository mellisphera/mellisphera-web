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
import { CONFIG } from '../../../../../config';
var httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
var RecordService = /** @class */ (function () {
    function RecordService(http) {
        this.http = http;
        this.mergeOptionHourly = null;
        this.mergeOptionStack = null;
        this.currentIdHive = null;
        this.loading = false;
    }
    RecordService.prototype.getRecordByIdHive = function (idHive) {
        var _this = this;
        this.loading = false;
        this.currentIdHive = idHive;
        this.recArray = [];
        this.recordObs = this.http.get(CONFIG.URL + 'records/hive/' + idHive);
        this.recordObs.subscribe(function (data) {
            _this.recArray = data;
            _this.sortRecordByTemp();
            _this.updateMerge();
            _this.loading = !_this.loading;
        }, function (err) {
            console.log(err);
        });
    };
    RecordService.prototype.updateMerge = function () {
        this.mergeOptionHourly = {
            series: [
                {
                    data: this.recArrayWeight
                },
                {
                    data: this.recArrrayTint
                },
                {
                    data: this.recArrayText
                }
            ]
        };
        this.mergeOptionStack = {
            series: [
                {
                    data: this.recArrrayTint
                },
                {
                    data: this.recArrayText
                },
                {
                    data: this.recArrayHint
                },
                {
                    data: this.recArrayHext
                },
                {
                    data: this.recArrayBatteryInt
                },
                {
                    data: this.recArrayBatteryExt
                }
            ]
        };
    };
    RecordService.prototype.sortRecordByTemp = function () {
        var _this = this;
        this.recArrrayTint = [];
        this.recArrayText = [];
        this.recArrayDateInt = [];
        this.recArrayWeight = [];
        this.recArrayDateExt = [];
        this.recArrayBatteryExt = [];
        this.recArrayBatteryInt = [];
        this.recArrayHext = [];
        this.recArrayHint = [];
        this.recArray.forEach(function (element, index) {
            if (element.temp_ext != null) {
                var date = element.recordDate.split(" ");
                _this.recArrayText.push({ name: element.recordDate, value: [
                        element.recordDate, element.temp_ext
                    ] });
                _this.recArrayWeight.push({ name: element.recordDate, value: [
                        element.recordDate, element.weight
                    ] });
                _this.recArrayBatteryExt.push({ name: element.recordDate, value: [
                        element.recordDate, element.battery_ext
                    ] });
                _this.recArrayHext.push({ name: element.recordDate, value: [
                        element.recordDate, element.humidity_ext
                    ] });
                // this.recArrayDateExt.push(element.recordDate,element.recordDate);
            }
            else if (element.temp_int != null) {
                _this.recArrrayTint.push({ name: element.recordDate, value: [
                        element.recordDate, element.temp_int
                    ] });
                _this.recArrayBatteryInt.push({ name: element.recordDate, value: [
                        element.recordDate, element.battery_int
                    ] });
                _this.recArrayHint.push({ name: element.recordDate, value: [
                        element.recordDate, element.humidity_int
                    ] });
                //this.recArrayDateInt.push(element.recordDate);
            }
        });
    };
    RecordService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], RecordService);
    return RecordService;
}());
export { RecordService };
//# sourceMappingURL=record.service.js.map