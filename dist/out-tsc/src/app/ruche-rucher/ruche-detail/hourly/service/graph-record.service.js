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
var GraphRecordService = /** @class */ (function () {
    function GraphRecordService() {
        this.option = {
            title: {
                text: 'Weight & Temperature',
                left: 'center',
                top: '-5'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            toolbox: {
                orient: 'horizontal',
                /*right: '0',
                left : '99%',*/
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: { readOnly: false },
                    magicType: { type: ['line', 'bar'] },
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'time',
                splitLine: {
                    show: false
                }
            },
            legend: {
                top: 30,
                data: ['Weight', 'Temp-int', 'Temp-ext']
            },
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 80,
                    end: 100,
                },
                {
                    type: 'inside',
                    filterMode: 'empty'
                },
                {
                    type: 'slider',
                    yAxisIndex: 0,
                    filterMode: 'empty',
                    left: 'left'
                },
                {
                    type: 'slider',
                    yAxisIndex: 1,
                    filterMode: 'empty'
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    name: 'Weight (kg)',
                    min: 0,
                    max: 80,
                    interval: 5,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: 'Temp.(°C)',
                    min: 0,
                    max: 40,
                    interval: 5,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: 'Weight',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: true,
                    data: '',
                    yAxisIndex: 0,
                    color: 'black'
                },
                {
                    name: 'Temp-int',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: true,
                    data: '',
                    yAxisIndex: 1,
                    color: 'red'
                },
                {
                    name: 'Temp-ext',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: true,
                    data: '',
                    yAxisIndex: 1,
                    color: 'blue'
                }
            ]
        };
    }
    GraphRecordService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], GraphRecordService);
    return GraphRecordService;
}());
export { GraphRecordService };
//# sourceMappingURL=graph-record.service.js.map