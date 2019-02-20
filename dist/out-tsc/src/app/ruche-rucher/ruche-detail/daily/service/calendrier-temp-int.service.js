var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { MyDate } from './../../../../class/MyDate';
import { Injectable } from '@angular/core';
var CalendrierTempIntService = /** @class */ (function () {
    function CalendrierTempIntService() {
        this.option = {
            title: {
                top: 28,
                left: 'center',
            },
            tooltip: {
                formatter: function (params) {
                    return new MyDate(params.data[0]).getIso() + '<br/>' + params.data[1];
                }
            },
            toolbox: {
                orient: 'vertical',
                top: 'middle',
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'line'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            visualMap: {
                orient: 'horizontal',
                top: 20,
                itemWidth: 30,
                itemHeight: 200,
                itemSymbol: 'diamond',
                left: 'right',
            },
            calendar: {
                top: 80,
                bottom: 10,
                left: 60,
                right: 30,
                height: 'auto',
                cellSize: ['20', '20'],
                range: null,
                itemStyle: {
                    normal: { borderWidth: 0.5 }
                },
                yearLabel: {
                    formatter: '{start}-{end}',
                    margin: 40,
                    show: false,
                    textStyle: {
                        color: 'black'
                    }
                },
                dayLabel: {
                    nameMap: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    firstDay: 1,
                },
            },
            series: {
                type: 'heatmap',
                coordinateSystem: 'calendar',
            }
        };
    }
    CalendrierTempIntService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], CalendrierTempIntService);
    return CalendrierTempIntService;
}());
export { CalendrierTempIntService };
//# sourceMappingURL=calendrier-temp-int.service.js.map