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
var GraphiqueFloraisonService = /** @class */ (function () {
    function GraphiqueFloraisonService() {
        this.currentYear = new Date().getFullYear();
        this.option = {
            //Défini le titre du graphique
            title: {
                text: '',
            },
            //Défini la légende du graph
            grid: {
                left: 2,
                bottom: 10,
                right: 10,
                containLabel: true
            },
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'line'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            //Le pointeur ne bouge qu'avec la souris
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return params.data[0] + '<br/>' + params.data[1];
                }
            },
            //Défini l'axe ou les axes abscisse(s)
            xAxis: [
                {
                    type: 'time',
                    min: this.currentYear + '-01-01',
                    max: this.currentYear + '-12-31',
                    //Option pour le pointeu
                    label: {},
                    splitNumber: '11',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#999',
                            type: 'dotted'
                        }
                    },
                    axisLine: {
                        show: false
                    },
                }
            ],
            //Défini l'axe ou les axes ordonnée(s)
            yAxis: {
                type: 'category',
                show: false,
                axisLine: {
                    show: false
                }
            },
        };
    }
    GraphiqueFloraisonService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], GraphiqueFloraisonService);
    return GraphiqueFloraisonService;
}());
export { GraphiqueFloraisonService };
//# sourceMappingURL=graphique-floraison.service.js.map