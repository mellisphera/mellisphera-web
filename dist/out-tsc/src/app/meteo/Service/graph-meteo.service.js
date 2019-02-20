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
var GraphMeteoService = /** @class */ (function () {
    function GraphMeteoService() {
        this.option = {
            title: {
                left: "10%",
                text: 'Température Moyenne | Humidité'
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
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
                data: ['Temp-Moyenne', 'Humidité']
            },
            series: [{
                    name: 'Temp-Moyenne',
                    type: 'line',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                }, {
                    name: 'Humidité',
                    type: 'line',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                }
            ],
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 20,
                    end: 85
                },
                {
                    type: 'inside',
                    show: true,
                    realtime: true,
                    start: 20,
                    end: 85
                }
            ],
        };
    }
    GraphMeteoService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], GraphMeteoService);
    return GraphMeteoService;
}());
export { GraphMeteoService };
//# sourceMappingURL=graph-meteo.service.js.map