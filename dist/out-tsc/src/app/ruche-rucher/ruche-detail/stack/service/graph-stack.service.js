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
var GraphStackService = /** @class */ (function () {
    function GraphStackService() {
        this.option = {
            title: {
                text: 'Stack',
                x: 'center',
                top: -5
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false
                }
            },
            legend: {
                orient: 'horizontal',
                data: ['Tint', 'Text', 'Hint', 'Hext', 'Batery-int', 'Batery-ext'],
                x: '5%',
                y: '2%'
            },
            toolbox: {
                orient: 'horizontal',
                //right: '0',
                left: '80%',
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none',
                    },
                    dataView: { readOnly: false },
                    magicType: { type: ['line', 'bar'] },
                    restore: {},
                    saveAsImage: {}
                }
            },
            axisPointer: {
                link: { xAxisIndex: 'all' }
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 80,
                    end: 100,
                    bottom: -1,
                    xAxisIndex: [0, 1, 2]
                },
                {
                    type: 'inside',
                    filterMode: 'empty',
                    realtime: true,
                    xAxisIndex: [0, 1, 2]
                },
                {
                    type: 'inside',
                    filterMode: 'empty',
                    realtime: true,
                    yAxisIndex: 0,
                    left: 'left'
                },
                {
                    type: 'inside',
                    filterMode: 'empty',
                    realtime: true,
                    yAxisIndex: 1,
                    left: 'left'
                }
            ],
            grid: [
                { x: '4%', y: '5%', width: '95%', height: '28%' },
                { x: '4%', y: '38%', width: '95%', height: '25%' },
                { x: '4%', y: '69%', width: '95%', height: '25%' },
            ],
            /*visualMap: {
              top: 10,
              right: 10,
              seriesIndex : [4,5],
              pieces: [{
                  gt: 0,
                  lte: 20,
                  color: 'red'
              }],
              target: {
                outOfRange: {
                    color: ['red'],
                    symbolSize: [60, 200]
                }
            },
              },*/
            xAxis: [
                {
                    //Temp
                    type: 'time',
                    boundaryGap: false,
                    axisLine: { onZero: true },
                    position: 'bottom',
                    gridIndex: 0,
                    splitLine: {
                        show: false
                    },
                },
                {
                    //Humdity
                    type: 'time',
                    boundaryGap: false,
                    axisLine: { onZero: true },
                    position: 'bottom',
                    gridIndex: 1,
                    splitLine: {
                        show: false
                    }
                },
                {
                    //batery
                    type: 'time',
                    boundaryGap: false,
                    axisLine: { onZero: true },
                    position: 'bottom',
                    gridIndex: 2,
                    splitLine: {
                        show: false
                    }
                },
            ],
            yAxis: [
                {
                    name: 'Temp',
                    type: 'value',
                    min: 0,
                    max: 40,
                },
                {
                    gridIndex: 1,
                    name: 'Humidity',
                    type: 'value',
                    inverse: false
                },
                {
                    gridIndex: 2,
                    name: 'Batery',
                    type: 'value',
                    inverse: false
                }
            ],
            series: [
                {
                    name: 'Tint',
                    type: 'line',
                    //symbolSize: 8,
                    showSymbol: false,
                },
                {
                    name: 'Text',
                    type: 'line',
                    //symbolSize: 8,
                    showSymbol: false,
                },
                {
                    name: 'Hint',
                    type: 'line',
                    //symbolSize: 8,
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    showSymbol: false,
                },
                {
                    name: 'Hext',
                    type: 'line',
                    //symbolSize: 8,
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    showSymbol: false,
                },
                {
                    name: "Batery-int",
                    type: "bar",
                    //symbolSize: 8,
                    xAxisIndex: 2,
                    yAxisIndex: 2,
                    showSymbol: false,
                    //hoverAnimation: true,
                    color: 'red',
                    large: true,
                    largeThreshold: 10,
                    barGap: '30%'
                },
                {
                    name: "Batery-ext",
                    type: "bar",
                    //symbolSize: 8,
                    xAxisIndex: 2,
                    yAxisIndex: 2,
                    showSymbol: false,
                    //hoverAnimation: true,
                    color: 'blue',
                    large: true,
                    largeThreshold: 10,
                    barGap: '30%'
                }
            ]
        };
    }
    GraphStackService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], GraphStackService);
    return GraphStackService;
}());
export { GraphStackService };
//# sourceMappingURL=graph-stack.service.js.map