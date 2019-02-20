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
var GraphHoneyService = /** @class */ (function () {
    function GraphHoneyService() {
        this.option = {
            title: {
                text: 'Stock de miel',
                left: 'center',
                top: '-5'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                top: 40
            },
            series: [],
            dataZoom: [
                /*{
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                },*/
                {
                    type: 'inside',
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                }
            ],
            grid: {
                left: '5%',
                right: '2%',
                top: 70,
                bottom: 0,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'time',
                    splitLine: {
                        show: false
                    },
                    min: 'dataMin',
                    max: 'dataMax'
                }
            ],
            yAxis: {
                name: 'Poids (kg)',
                type: 'value'
            }
        };
    }
    GraphHoneyService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], GraphHoneyService);
    return GraphHoneyService;
}());
export { GraphHoneyService };
//# sourceMappingURL=graph-honey.service.js.map