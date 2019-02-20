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
import { DailyRecordsWService } from '../../service/daily-records-w.service';
import { MyDate } from '../../../../class/MyDate';
var CalendrierPoidsService = /** @class */ (function () {
    function CalendrierPoidsService(dailyRec) {
        this.dailyRec = dailyRec;
        this.option = {
            //backgroundColor: 'white',
            title: {
                top: 5,
                text: 'Daily weight incomes',
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return new MyDate(params.data[0]).getIso() + '<br/>' + params.seriesName + ' : ' + params.data[1];
                }
            },
            toolbox: {
                orient: 'vertical',
                itemSize: 15,
                top: 'middle',
                feature: {
                    dataView: {
                        show: true,
                        readOnly: true,
                        optionToContent: function (opt) {
                            var series = opt.series;
                            //var table = '<table style="width:100%;">';
                            var table = '<textarea style="width:100%; height:500px;" >';
                            table += series[0].name + "\n";
                            var data;
                            series[0].data.forEach(function (element) {
                                table += new MyDate(element[0]).getIso() + ' => ' + element[1] + '\n';
                            });
                            table += series[1].name + "\n";
                            series[1].data.forEach(function (element) {
                                table += new MyDate(element[0]).getIso() + ' => ' + element[1] + '\n';
                            });
                            table += '</textarea>';
                            return table;
                        }
                    },
                    restore: { show: true },
                    saveAsImage: { show: true }
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
                    bottom: '3%',
                    left: '3%',
                    right: '2%',
                    width: '92%',
                    //right: '4%',
                    height: '45%',
                    //height:'auto',
                    cellSize: ['20', '20'],
                    range: null,
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
    CalendrierPoidsService.prototype.convertDate = function (date) {
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
    CalendrierPoidsService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [DailyRecordsWService])
    ], CalendrierPoidsService);
    return CalendrierPoidsService;
}());
export { CalendrierPoidsService };
//# sourceMappingURL=calendrier-poids.service.js.map