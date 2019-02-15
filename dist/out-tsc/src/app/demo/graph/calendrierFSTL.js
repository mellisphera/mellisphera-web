var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { MyDate } from '../../class/MyDate';
import { Injectable } from '@angular/core';
var CalendrierFSTLervice = /** @class */ (function () {
    function CalendrierFSTLervice() {
        this.option = {
            title: {
                top: 5,
                text: 'Poids journalier',
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return new MyDate(params.data[0]).getIso() + '<br/>' + params.seriesName + ' : ' + params.data[1];
                }
            },
            legend: {
                top: 30,
                data: ['gain', 'loss'],
                textStyle: {
                    color: 'black'
                }
            },
            calendar: [{
                    top: 100,
                    bottom: 10,
                    left: 'center',
                    /*width : '92%',
                    height:'60%',*/
                    cellSize: [20, 20],
                    range: ['2019-01-01', '2019-02-28'],
                    orient: 'horizontal',
                    /*cellSize: 'auto',
                    height:'200',*/
                    //  width:'95%',
                    // top:70,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#000',
                            width: 4,
                            type: 'solid'
                        }
                    },
                    dayLabel: {
                        nameMap: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        firstDay: 1,
                    },
                    yearLabel: {
                        formatter: '{start}-{end}',
                        show: false,
                        margin: 40,
                        textStyle: {
                            color: 'black'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'lightgrey',
                            borderWidth: 1,
                            borderColor: '#111'
                        }
                    }
                }],
            series: [
                {
                    name: 'gain',
                    type: 'effectScatter',
                    coordinateSystem: 'calendar',
                    data: '',
                    symbolSize: function (val) {
                        if (val[1] >= 0) {
                            return 0.5 * Math.sqrt(1000 * val[1]);
                        }
                        else {
                            return 0;
                        }
                    },
                    showEffectOn: 'emphasis',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    itemStyle: {
                        normal: {
                            color: '#00FE0C'
                        }
                    }
                },
                {
                    name: 'loss',
                    type: 'effectScatter',
                    coordinateSystem: 'calendar',
                    data: '',
                    symbolSize: function (val) {
                        if (val[1] < 0) {
                            return 0.5 * Math.sqrt(Math.abs(1000 * val[1]));
                        }
                        else {
                            return 0;
                        }
                    },
                    showEffectOn: 'emphasis',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    itemStyle: {
                        normal: {
                            color: '#FE0000'
                        }
                    }
                },
            ]
        };
    }
    CalendrierFSTLervice = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], CalendrierFSTLervice);
    return CalendrierFSTLervice;
}());
export { CalendrierFSTLervice };
//# sourceMappingURL=calendrierFSTL.js.map