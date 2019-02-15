var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { CONFIG } from '../../../../../config';
import { CalendrierService } from '../../service/calendrier.service';
//import { ECharts } from 'echarts';
var CalendrierHealthService = /** @class */ (function (_super) {
    __extends(CalendrierHealthService, _super);
    function CalendrierHealthService() {
        var _this = _super.call(this) || this;
        _this.option = {
            backgroundColor: 'white',
            title: {
                top: 70,
                text: 'Brood level',
                left: 'center',
                textStyle: {
                    color: 'black'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return params.data[0] + '<br/>' + params.seriesName;
                }
            },
            toolbox: {
                feature: {
                    /*dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'line']},
                    restore: {show: true},*/
                    saveAsImage: { show: true }
                }
            },
            legend: {
                top: '30',
                textStyle: {
                    color: 'black'
                }
            },
            calendar: [{
                    top: 140,
                    left: '2%',
                    right: '4%',
                    height: '20%',
                    width: '93%',
                    range: null,
                    orient: 'horizontal',
                    cellSize: ['auto', '40'],
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#000',
                            width: 4,
                            type: 'solid'
                        }
                    },
                    dayLabel: {
                        //nameMap: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
                        nameMap: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        firstDay: 1,
                    },
                    monthLabel: {
                        margin: 10,
                        nameMap: [
                            'Jan.', 'Feb.', 'Mar.',
                            'Apr.', 'May', 'Jun.',
                            'Jul.', 'Aug.', 'Sep.',
                            'Oct.', 'Nov.', 'Dec.'
                        ]
                    },
                    yearLabel: {
                        formatter: '{start}-{end}',
                        show: false,
                        margin: 50,
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
            series: {
                type: 'custom',
                coordinateSystem: 'calendar',
                renderItem: _this.renderItem,
            }
        };
        return _this;
    }
    CalendrierHealthService.prototype.renderItem = function (params, api) {
        var cellPoint = api.coord(api.value(0), api.value(1));
        var cellWidth = params.coordSys.cellWidth;
        var cellHeight = params.coordSys.cellHeight;
        var img;
        var value = api.value(1);
        if (isNaN(cellPoint[0]) || isNaN(cellPoint[1])) {
            return;
        }
        switch (api.value(1)) {
            case 'statusC':
                if (api.value(2) == "Fluctuation") {
                    img = 'wfbfl.png';
                }
                else if (api.value(2) == "Decline") {
                    img = 'wfbde.png';
                }
                else if (api.value(2) == "Stable") {
                    img = 'wfbst.png';
                }
                else if (api.value(2) == "Improve") {
                    img = 'wfbim.png';
                }
                break;
            case 'statusB':
                if (api.value(2) == "Fluctuation") {
                    img = 'wnbfl.png';
                }
                else if (api.value(2) == "Decline") {
                    img = 'wnbde.png';
                }
                else if (api.value(2) == "Stable") {
                    img = 'wnbst.png';
                }
                else if (api.value(2) == "Improve") {
                    img = 'wnbim.png';
                }
                break;
            case 'statusA':
                if (api.value(2) == "Fluctuation") {
                    img = 'wobfl.png';
                }
                else if (api.value(2) == "Improve") {
                    img = 'wobim.png';
                }
                break;
            default:
                img = 'wos.png';
        }
        img = CONFIG.URL_FRONT + 'assets/icons/' + img;
        //img = CONFIG.URL_FRONT+'assets/icons/'+this.getIcon(api.value(1),api.value(2));
        var group = {
            type: 'group',
            children: [{
                    type: 'image',
                    //scale : ['horizontal scale factor', 'vertical scale factor'],
                    style: {
                        image: img,
                        width: cellWidth / 3,
                        //heigth:30, // et hauteur de l'image
                        /*placement de l'image (x,y) avec les coordonnées */
                        x: cellPoint[0] - cellWidth / 2 + 5,
                        y: cellPoint[1] - cellHeight / 2 + 3
                    },
                }],
        };
        return group;
    };
    CalendrierHealthService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], CalendrierHealthService);
    return CalendrierHealthService;
}(CalendrierService));
export { CalendrierHealthService };
//# sourceMappingURL=calendrier-health.service.js.map