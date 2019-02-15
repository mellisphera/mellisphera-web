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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../../../config';
var httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
var DailyStockHoneyService = /** @class */ (function () {
    function DailyStockHoneyService(http) {
        this.http = http;
        this.mergeOption = null;
        this.loadingOpts = {
            text: 'Loading',
            color: '#00bdfc',
            textColor: '#ff0000',
            maskColor: 'rgba(255, 255, 255, 0.6)',
            zlevel: 0
        };
        this.cleanTemplate();
        this.loading = false;
        this.dailyStock = [];
        this.cuurrentIdHive = null;
    }
    ;
    /* Requete API*/
    DailyStockHoneyService.prototype.getDailyStockHoneyByApiary = function (idHive) {
        var _this = this;
        this.cuurrentIdHive = idHive;
        this.loading = false;
        this.dailyStock = [];
        this.dailyStockObs = this.http.get(CONFIG.URL + 'dailyStockHoney' + '/hive/' + idHive);
        this.dailyStockObs.subscribe(function (data) {
            _this.dailyStock = data;
            _this.cleanMerge();
        }, function (err) {
            //this.templateSerie.show = false;
            _this.templateSerie.data = null;
            _this.cleanMerge();
            _this.mergeOption.series.push(_this.templateSerie);
            console.log(_this.mergeOption);
        }, function () {
            if (_this.dailyStock.length > 1) {
                _this.nextQuery();
            }
        });
    };
    DailyStockHoneyService.prototype.nextQuery = function () {
        /* Mise à jour du template avec les info récupèrer */
        this.countFlower();
        this.dailyStockByFleur();
        console.log(this.dailyStockByFlower);
        for (var elt in this.dailyStockByFlower) {
            this.templateSerie.name = elt;
            this.templateSerie.data = [];
            this.templateSerie.data = this.dailyStockByFlower[elt];
            this.mergeOption.series.push(this.templateSerie);
            this.cleanTemplate();
        }
        this.mergeOption.legend.data = this.typeFlower;
        //this.mergeOption.xAxis[0].min = new MyDate(this.arrayDate[0]).getIso();
        //this.mergeOption.xAxis[0].max = new MyDate(this.arrayDate[this.arrayDate.length - 1]).getIso();
        console.log(this.mergeOption.xAxis);
        this.loading = !this.loading;
    };
    DailyStockHoneyService.prototype.convertDate = function (date) {
        var dateIso = new Date(date);
        var jour = '' + dateIso.getDate();
        var mois = '' + (dateIso.getMonth() + 1);
        var anee = dateIso.getFullYear();
        if (parseInt(jour) < 10) {
            jour = '0' + jour;
        }
        if (parseInt(mois) < 10) {
            mois = '0' + mois;
        }
        return anee + '-' + mois + '-' + jour;
    };
    DailyStockHoneyService.prototype.cleanTemplate = function () {
        this.templateSerie = {
            name: '',
            show: true,
            type: 'line',
            stack: 'fleurs',
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: [],
            showSymbol: false,
            smooth: 'true',
            label: {
                normal: {
                    show: false,
                    position: 'top'
                }
            },
        };
    };
    DailyStockHoneyService.prototype.cleanMerge = function () {
        this.typeFlower = new Array();
        this.mergeOption = {
            /*xAxis: [{
              min:'',
              max:''
            }],*/
            legend: {
                data: []
            },
            series: []
        };
    };
    /* Trie les données obtenue par fleur */
    DailyStockHoneyService.prototype.dailyStockByFleur = function () {
        var _this = this;
        this.arrayDate = [];
        this.dailyStockByFlower = [];
        this.typeFlower.forEach(function (element) {
            _this.dailyStockByFlower['' + element] = [];
        });
        this.dailyStock.forEach(function (element, index) {
            if (_this.arrayDate.indexOf(element) == -1) {
                _this.arrayDate.push(new Date(element.date));
            }
        });
        this.dailyStock.forEach(function (element, index) {
            if (_this.arrayDate.indexOf(element.date) == -1) {
                _this.arrayDate.push(element.date);
            }
            _this.dailyStockByFlower['' + element.nom].push({ name: element.date, value: [
                    element.date, element.stockJ * 10
                ] });
        });
        /*for(var elt in this.dailyStockByFlower){
          this.arrayDate.forEach(element=>{
            this.dailyStockByFlower[elt].push({name : element});
          });
        }*/
        /* this.dailyStock.forEach(elt=>{// Parcour le tableau total
           for(var element in this.dailyStockByFlower){// Pour chaque serie de fleur(element nom d'une fleur donc une serie est un tableau)
             this.dailyStockByFlower[element].forEach(obj=>{// je parcour ce tableau
               if(element == elt.nom){//index de l'objet
                 if(obj.name.getDate() == new Date(elt.date).getDate() && obj.name.getMonth() == new Date(elt.date).getMonth()){
                   obj['value'] = [elt.date, elt.stockJ]
                 }
               }
             });
           }
         })*/
    };
    DailyStockHoneyService.prototype.cleanQuery = function () {
        this.dailyStock = [];
        this.arrayDate = [];
        this.typeFlower = [];
        this.cleanTemplate();
        // this.mergeOption = [];
    };
    /* Recupère tout les types de fleurs de la requete */
    DailyStockHoneyService.prototype.countFlower = function () {
        var _this = this;
        this.typeFlower = [];
        var fleur = null;
        this.dailyStock.forEach(function (element, index) {
            if (_this.typeFlower.indexOf(element.nom) == -1) {
                _this.typeFlower.push(element.nom);
            }
        });
    };
    DailyStockHoneyService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], DailyStockHoneyService);
    return DailyStockHoneyService;
}());
export { DailyStockHoneyService };
/*    if(this.dailyStock.length > 1){
      this.countFlower();
      this.dailyStockByFleur();
      for(var elt in this.dailyStockByFlower){
        this.templateSerie.name = elt;
        this.templateSerie.data = [];
        this.templateSerie.data = this.dailyStockByFlower[elt];
        this.mergeOption.series.push(this.templateSerie)
        this.cleanTemplate();
        console.log(this.templateSerie)
      }
      this.mergeOption.legend.data = this.typeFlower;
    }
    else{
      console.log("clean");
      this.dailyStock = new Array();
      this.cleanTemplate();
      this.cleanMerge();
      console.log(this.templateSerie);
      console.log(this.mergeOption);
    }
    this.countFlower();
    this.dailyStockByFleur();*/ 
//# sourceMappingURL=daily-stock-honey.service.js.map