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
import { CONFIG } from '../../../config';
import { RucherService } from '../../ruche-rucher/rucher.service';
import { UserloggedService } from '../../userlogged.service';
var httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
var FleursFloraisonService = /** @class */ (function () {
    function FleursFloraisonService(http, rucherService, userService) {
        var _this = this;
        this.http = http;
        this.rucherService = rucherService;
        this.userService = userService;
        this.cleanTemplate();
        this.initFleurObservees();
        this.rucherService.ruchersObs.subscribe(function () { }, function () { }, function () {
            _this.getUserFleur(_this.rucherService.rucher.id);
        });
        this.getFleurTest();
    }
    //Récupère la liste des fleurs théoriques
    FleursFloraisonService.prototype.getFleurTest = function () {
        var _this = this;
        this.http.get(CONFIG.URL + 'flowersTh/all').subscribe(function (data) {
            _this.fleurThs = data;
        }, function (err) {
            console.log(err);
        }, function () {
            _this.getType();
        });
    };
    FleursFloraisonService.prototype.initFleurObservees = function () {
        this.newFlower = {
            id: '',
            nom: '',
            dateDebutd: null,
            dateFind: null,
            dateDebutdate: null,
            dateFindate: null,
            dateThDebutd: '',
            dateThFind: '',
            dateThDebutdate: '',
            dateThFindate: '',
            presence: '',
            username: '',
            idApiary: '',
            photo: ''
        };
    };
    FleursFloraisonService.prototype.sortTheoricalFlower = function () {
        var _this = this;
        this.nomFleur = [];
        var date = new Date();
        this.fleursByRucher.forEach(function (element) {
            _this.tabFleurByDateGraph.push([
                [date.getFullYear() + '-' + element.dateThDebutd, element.nom],
                [date.getFullYear() + '-' + element.dateThFind, element.nom]
            ]);
            _this.templateSerie.name = element.nom;
            _this.templateSerie.data = _this.tabFleurByDateGraph[_this.tabFleurByDateGraph.length - 1];
            _this.mergeOption.series.push(_this.templateSerie);
            _this.nomFleur.push(element.nom);
            _this.cleanTemplate();
        });
        this.mergeOption.legend.data = this.nomFleur;
        this.mergeOption.yAxis.data = this.nomFleur;
    };
    //Service permettant de récuperer les fleurs du rucher selectionné d'un utilisateur x
    FleursFloraisonService.prototype.getUserFleur = function (idRucher) {
        var _this = this;
        console.log(idRucher);
        this.tabFleurByDateGraph = new Array();
        this.fleursObs = this.http.get(CONFIG.URL + 'flowersOb/' + idRucher);
        this.fleursObs.subscribe(function (data) {
            _this.fleursByRucher = data;
        }, function (err) {
            console.log(err);
        }, function () {
            _this.cleanTemplate();
            _this.cleanMerge();
            if (_this.fleursByRucher.length > 0) {
                _this.sortTheoricalFlower();
            }
            else {
                //throw 'Empty';
                console.log("Aucune");
            }
        });
    };
    FleursFloraisonService.prototype.cleanTemplate = function () {
        this.templateSerie = {
            name: '',
            type: 'line',
            color: '#509B21',
            symbolSize: 12,
            data: [],
            label: {
                show: 'true',
                position: 'top',
                formatter: '{a}'
            }
        };
        this.templateLegend = {
            left: 'center',
            data: []
        };
    };
    FleursFloraisonService.prototype.cleanMerge = function () {
        this.mergeOption = {
            series: new Array(),
            yAxis: {
                data: new Array()
            },
            legend: {
                left: 'center',
                data: new Array()
            }
        };
    };
    //Récupère la liste des fleurs théoriques
    FleursFloraisonService.prototype.getType = function () {
        var _this = this;
        this.http.get(CONFIG.URL + 'flowersTh/types').subscribe(function (data) {
            _this.typesFleur = data;
            _this.typeFleurDef = _this.typesFleur[0];
        }, function (err) {
            console.log(err);
        });
    };
    //Récupère le noms des fleurs du rucher
    FleursFloraisonService.prototype.getNamesFlowers = function (idRucher) {
        var _this = this;
        this.http.get(CONFIG.URL + 'flowersOb/namesflowers/' + idRucher).subscribe(function (data) {
            _this.nomFleur = data;
        }, function (err) {
            console.log(err);
        });
    };
    //Récupère le dates de floraisons théoriques des fleurs du rucher
    FleursFloraisonService.prototype.getFloraisonThFlowers = function (fleur) {
        var _this = this;
        this.http.get(CONFIG.URL + 'flowersOb/datesthflowersd/' + fleur.id).subscribe(function (data) {
            _this.datesFleur = data;
        }, function (err) {
            console.log(err);
        });
    };
    //Récupère les dates de floraisons observées des fleurs du rucher
    FleursFloraisonService.prototype.getFloraisonObFlowers = function (fleur, annee) {
        return this.http.get(CONFIG.URL + 'flowersOb/datesobflowersd/' + fleur.id + '/' + annee);
    };
    //Ajoute une fleur à un rucher de l'utilisateur
    FleursFloraisonService.prototype.addFlower = function (fleur) {
        var _this = this;
        this.newFlower.nom = fleur.flowerApi.francais;
        this.newFlower.dateDebutd = fleur.flowerApi.flomind;
        this.newFlower.dateFind = fleur.flowerApi.flomaxd;
        this.newFlower.dateThDebutd = fleur.flowerApi.flomind;
        this.newFlower.dateThFind = fleur.flowerApi.flomaxd;
        this.newFlower.dateThDebutdate = fleur.flowerApi.flomindate;
        this.newFlower.dateThFindate = fleur.flowerApi.flomaxdate;
        this.newFlower.presence = "";
        this.newFlower.username = this.userService.currentUser().username;
        this.newFlower.photo = fleur.photo;
        this.http.put(CONFIG.URL + 'flowersOb/add/' + this.rucherService.rucher.id, this.newFlower).subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.getUserFleur(_this.rucherService.rucherSelectUpdate.id);
        });
    };
    //Change la date de début de floraison obserevée d'une fleur
    FleursFloraisonService.prototype.updateFleurDebut = function (/*id,annee,dateDebut*/ fleur, currentyear) {
        var _this = this;
        this.http.put(CONFIG.URL + 'flowersOb/updateDebd/' + fleur.id + '/' + currentyear, fleur.dateDebutdate[currentyear]).subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.updatePresence(fleur);
        });
    };
    //Change la date de fin de floraison obserevée d'une fleur
    FleursFloraisonService.prototype.updateFleurFin = function (currentyear, fleur) {
        var _this = this;
        fleur.dateDebutdate[currentyear] = (fleur.dateDebutdate[currentyear] == '') ? 'null' : fleur.dateDebutdate[currentyear];
        fleur.dateFindate[currentyear] = (fleur.dateFindate[currentyear] == '') ? 'null' : fleur.dateFindate[currentyear];
        this.http.put(CONFIG.URL + 'flowersOb/updateFind/' + fleur.id + '/' + currentyear, fleur.dateFindate[currentyear]).subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.updateFleurDebut(fleur, currentyear);
        });
    };
    //Change le pourcentage d'une fleur dans le rucher
    FleursFloraisonService.prototype.updatePresence = function (fleur) {
        this.http.put(CONFIG.URL + 'flowersOb/updatePresence/' + fleur.id, fleur.presence).subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
        });
    };
    //on supprime une fleur de la bibliothèque
    FleursFloraisonService.prototype.deleteFleur = function (fleur) {
        var _this = this;
        this.http.delete(CONFIG.URL + 'flowersOb/' + fleur.id).subscribe(function () { }, function (err) {
            console.log(err);
        }, function () {
            _this.getUserFleur(_this.rucherService.rucher.id);
        });
    };
    FleursFloraisonService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, RucherService, UserloggedService])
    ], FleursFloraisonService);
    return FleursFloraisonService;
}());
export { FleursFloraisonService };
//# sourceMappingURL=fleurs.floraison.service.js.map