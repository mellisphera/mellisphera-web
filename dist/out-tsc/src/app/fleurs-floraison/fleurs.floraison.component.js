var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FleursFloraisonService } from './service/fleurs.floraison.service';
import { Rucher } from '../ruche-rucher/rucher';
import { UserloggedService } from '../userlogged.service';
import { GraphiqueFloraisonService } from './service/graphique-floraison.service';
var FleursFloraisonComponent = /** @class */ (function () {
    function FleursFloraisonComponent(formBuilder, location, router, 
    //public rucherService : RucherService,
    fleursFloraisonService, grahFleur, data) {
        this.formBuilder = formBuilder;
        this.location = location;
        this.router = router;
        this.fleursFloraisonService = fleursFloraisonService;
        this.grahFleur = grahFleur;
        this.data = data;
        //Variable pour les informations du rucher
        this.nameApiary = new Rucher();
        this.message = "";
        //variable to store fleurs
        this.fleursTest = [];
        //Variable pour le rucher selectionné
        this.selectedRucher = new Rucher();
        //Variable pour le type selectionné
        //La date d'aujourd'hui
        this.date = new Date();
        //L'année en cours
        this.currentYear = this.date.getFullYear();
        this.username = data.currentUser().username;
        this.selectedType = '';
        this.currentMonth = 0;
        //this.currentMonthStr = ['','Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'];
        this.currentMonthStr = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }
    //Au chargement de la page on execute ces fonctions
    FleursFloraisonComponent.prototype.ngOnInit = function () {
    };
    //On récupères les dates de flo observée de la plante "name"
    FleursFloraisonComponent.prototype.getOneDateOb = function (databis, fleur, i, annee) {
        this.fleursFloraisonService.getFloraisonObFlowers(fleur, annee).subscribe(function (data) { databis[i] = data; });
    };
    //Change le rucher selectionné
    FleursFloraisonComponent.prototype.onSelectRucher = function () {
        this.fleursFloraisonService.fleursByRucher = null;
        this.fleursFloraisonService.mergeOption = null;
        this.fleursFloraisonService.getUserFleur(this.fleursFloraisonService.rucherService.rucher.id);
        //this.fleursFloraisonService.rucherService.getRucherDetails();
    };
    FleursFloraisonComponent.prototype.onEditFleur = function (fleur) {
        this.selectedFlo = fleur.id;
    };
    FleursFloraisonComponent.prototype.saveValue = function (fleur) {
        this.fleursFloraisonService.updateFleurFin(this.currentYear, fleur);
        this.selectedFlo = null;
    };
    FleursFloraisonComponent.prototype.receiveMessage = function ($event) {
        this.message = $event;
    };
    FleursFloraisonComponent = __decorate([
        Component({
            selector: 'app-fleurs-floraison',
            templateUrl: './fleurs.floraison.component.html',
            styleUrls: ['./fleurs.floraison.component.scss']
        }),
        __metadata("design:paramtypes", [FormBuilder,
            Location,
            Router,
            FleursFloraisonService,
            GraphiqueFloraisonService,
            UserloggedService])
    ], FleursFloraisonComponent);
    return FleursFloraisonComponent;
}());
export { FleursFloraisonComponent };
//# sourceMappingURL=fleurs.floraison.component.js.map