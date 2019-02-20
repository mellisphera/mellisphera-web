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
var CalendrierService = /** @class */ (function () {
    function CalendrierService() {
        this.couleur = 'rgba(123,123,123,0.3)';
        this.options = {
            /* Proprieté */
            /*title:{
                bottom:"20",
                text : 'Calendrier'
            },*/
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return params.data[0] + ' :<br/> temp-min : ' + params.data[2] + ' °C<br/> temp-max : ' + params.data[3] + ' °C';
                }
            },
            calendar: {
                cellSize: [30, 30],
                orient: 'horizontal',
                width: '80%',
                splitLine: {
                    show: true,
                    lineStyle: {
                        width: 3,
                        opacity: 1,
                    }
                },
                itemStyle: {
                    normal: {
                        color: this.couleur,
                        borderWidth: 1,
                        borderColor: 'white'
                    }
                },
                dayLabel: {
                    nameMap: 'fr',
                    firstDay: 1
                    // firstDay
                },
                yearLabel: {
                    show: false // desactiver
                }
            },
            series: [{
                    type: 'custom',
                    coordinateSystem: 'calendar',
                    data: '',
                    renderItem: this.renderItem,
                },
            ],
            range: this.decomposeDate(new Date())
        };
    }
    CalendrierService.prototype.renderItem = function (params, api) {
        var cellPoint = api.coord([api.value(0), api.value(1)]); // utilise les valeurs des données pour obtenir des coordonnées
        var cellWidth = params.coordSys.cellWidth;
        var cellHeight = params.coordSys.cellHeight;
        var img; // variable pour chemin de l'image
        var jour;
        // var date=echarts.format.formatTime('yyyy-MM-dd',api.value(0));
        if (isNaN(api.value(0))) {
            return false;
        }
        img = "http://openweathermap.org/img/w/" + api.value(1) + ".png";
        jour = new Date(api.value(0)).getDate();
        var group = {
            type: 'group',
            children: [{
                    type: 'image',
                    style: {
                        image: img,
                        width: 40,
                        heigth: 30,
                        /*placement de l'image (x,y) avec les coordonnées */
                        x: cellPoint[0] - cellWidth / 2 + 6,
                        y: cellPoint[1] - cellHeight / 2 - 5
                    },
                },
                {
                    type: 'text',
                    style: {
                        /* placement */
                        x: cellPoint[0] + 6,
                        y: cellPoint[1] - 8,
                        text: jour,
                    }
                },
            ]
        };
        return group;
    };
    CalendrierService.prototype.decomposeDate = function (date) {
        var tabDate = [];
        date = new Date(date);
        tabDate.push(date.getDate());
        tabDate.push((date.getMonth() + 1));
        tabDate.push(date.getFullYear());
        return [tabDate[2] + '-' + tabDate[1], tabDate[2] + '-' + parseInt(tabDate[1] + 1) + '-' + 15];
    };
    CalendrierService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], CalendrierService);
    return CalendrierService;
}());
export { CalendrierService };
//# sourceMappingURL=calendrier.service.js.map