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
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { ProcessReport } from './processedReport';
import { RucherService } from './rucher.service';
import { UserloggedService } from '../userlogged.service';
import { selectedRucherService } from '../accueil/_shared-services/selected-rucher.service';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { RapportService } from '../rapport/rapport.service';
import { RucheService } from '../accueil/Service/ruche.service';
import { AuthService } from '../auth/Service/auth.service';
var RucheRucherComponent = /** @class */ (function () {
    function RucheRucherComponent(formBuilder, location, router, rucherService, data, _selectedRucherService, _rapportService, rucheService, authService) {
        this.formBuilder = formBuilder;
        this.location = location;
        this.router = router;
        this.rucherService = rucherService;
        this.data = data;
        this._selectedRucherService = _selectedRucherService;
        this._rapportService = _rapportService;
        this.rucheService = rucheService;
        this.authService = authService;
        this.username = "";
        //
        this.newObs = new ProcessReport();
        this.type = 'ApiaryObs';
        this.message = "";
        this.optionsDate = {
            weekday: 'short', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric',
        };
        this.username = data.currentUser().username;
        this.currentRucherID = localStorage.getItem("currentRucher");
        this.rucheRucherID = localStorage.getItem("rucheRucherID");
    }
    RucheRucherComponent.prototype.ngOnInit = function () {
        this.initForm();
    };
    RucheRucherComponent.prototype.clickOnRuche = function (ruche) {
        localStorage.setItem("clickedRuche", this.localStorageRuche);
        //localStorage.setItem("selectedRucheName",  this.selectedRuche.name);
    };
    RucheRucherComponent.prototype.resetForm = function () {
        this.newRucherForm.reset();
    };
    RucheRucherComponent.prototype.addUserShare = function (event) {
        //console.log(event);
        if (event.code == 'Enter') {
            console.log(this.authService.user);
        }
    };
    //Fonction pour créer le rucher
    RucheRucherComponent.prototype.createRucher = function () {
        var formValue = this.rucherForm.value;
        this.rucherService.rucher = {
            id: null,
            latitude: '',
            longitude: '',
            name: '',
            description: '',
            createdAt: null,
            photo: null,
            username: '',
            codePostal: '',
            ville: ''
        };
        this.rucherService.rucher.id = null;
        this.rucherService.rucher.description = formValue.description;
        this.rucherService.rucher.name = formValue.nom;
        this.rucherService.rucher.ville = formValue.ville;
        this.rucherService.rucher.codePostal = formValue.codePostal;
        this.rucherService.rucher.createdAt = new Date();
        this.rucherService.rucher.username = this.username;
        this.initForm();
        this.rucherService.createRucher();
    };
    //delete rucher
    RucheRucherComponent.prototype.deleteRucher = function () {
        this.rucherService.deleteRucher();
    };
    //Editer Rucher
    RucheRucherComponent.prototype.onEditerRucher = function () {
        var formValue = this.rucherForm.value;
        this.rucherService.detailsRucher.description = formValue.description;
        this.rucherService.detailsRucher.name = formValue.nom;
        this.rucherService.detailsRucher.ville = formValue.ville;
        this.rucherService.detailsRucher.codePostal = formValue.codePostal;
        this.initForm();
        this.rucherService.updateRucher();
        this.updateRucherInput = false;
    };
    RucheRucherComponent.prototype.onSelectRucher = function () {
        this.rucheService.getRucheByApiary(this.username, this.rucherService.rucher.id);
        this.rucherService.getRucherDetails();
    };
    //Quand on Edite une ruche
    RucheRucherComponent.prototype.onSelectObs = function (obs) {
        this.rucherService.observationService.observation = obs;
        var donnée = {
            sentence: this.rucherService.observationService.observation.sentence,
            date: this.rucherService.observationService.observation.date
        };
        this.observationForm.setValue(donnée);
    };
    //Pour effacer une ruche
    RucheRucherComponent.prototype.deleteRuche = function (ruche) {
        this.rucheService.ruche = ruche;
        this.rucheService.deleteRuche();
    };
    //Pour créer une ruche
    RucheRucherComponent.prototype.createRuche = function () {
        var formValue = this.newRucheForm.value;
        this.rucheService.initRuche();
        this.rucheService.ruche.id = null;
        this.rucheService.ruche.idApiary = this.rucherService.rucher.id;
        this.rucheService.ruche.description = formValue.descriptionRuche;
        this.rucheService.ruche.name = formValue.nomRuche;
        this.rucheService.ruche.username = this.username;
        this.initForm();
        this.rucheService.createRuche();
    };
    RucheRucherComponent.prototype.onSelectRuche = function (ruche) {
        this.rucheService.ruche = ruche;
        var donnée = {
            nomRuche: this.rucheService.ruche.name,
            descriptionRuche: this.rucheService.ruche.description,
        };
        this.newRucheForm.setValue(donnée);
    };
    // pour editer une ruche
    RucheRucherComponent.prototype.onEditeRuche = function () {
        var formValue = this.newRucheForm.value;
        var lastIdApiary = this.rucheService.ruche.idApiary;
        this.rucheService.ruche.idApiary = this.rucherService.rucherSelectUpdate.id;
        this.rucheService.ruche.name = formValue.nomRuche;
        this.rucheService.ruche.description = formValue.descriptionRuche;
        this.rucheService.updateRuche(lastIdApiary);
    };
    RucheRucherComponent.prototype.editRucherClicked = function () {
        this.updateRucherInput = true;
        var donnée = {
            nom: this.rucherService.rucher.name,
            description: this.rucherService.rucher.description,
            ville: this.rucherService.rucher.ville,
            codePostal: this.rucherService.rucher.codePostal,
            validate: ''
        };
        this.rucherForm.setValue(donnée);
    };
    //Pour créer une observation
    RucheRucherComponent.prototype.createObservation = function () {
        var formValue = this.observationForm.value;
        this.rucherService.observationService.observation = formValue;
        this.rucherService.observationService.observation.idApiary = this.rucherService.rucher.id;
        this.rucherService.observationService.observation.type = "ApiaryObs";
        this.initForm();
        this.rucherService.observationService.createObservation();
    };
    RucheRucherComponent.prototype.deleteObs = function (obsApiary) {
        this.rucherService.observationService.observation = obsApiary;
        this.rucherService.observationService.deleteObservation();
    };
    RucheRucherComponent.prototype.onEditObservation = function () {
        var formValue = this.observationForm.value;
        this.rucherService.observationService.observation.sentence = formValue.sentence;
        this.rucherService.observationService.updateObservation();
    };
    RucheRucherComponent.prototype.resetRucheForm = function () {
        this.newRucheForm.reset();
    };
    RucheRucherComponent.prototype.initForm = function () {
        this.observationForm = this.formBuilder.group({
            'sentence': [null, Validators.compose([Validators.required])],
            'date': new Intl.DateTimeFormat('fr-FR', this.optionsDate).format(new Date()),
        });
        this.newRucheForm = this.formBuilder.group({
            'nomRuche': [null, Validators.compose([Validators.required])],
            'descriptionRuche': [null],
        });
        this.rucherForm = this.formBuilder.group({
            'nom': [null, Validators.compose([Validators.required])],
            'description': [null],
            'ville': [null, Validators.compose([Validators.required])],
            'codePostal': [null, Validators.compose([Validators.required])],
            'validate': ""
        });
    };
    RucheRucherComponent.prototype.cancelUpdateRucher = function () {
        this.updateRucherInput = false;
        this.initForm();
    };
    RucheRucherComponent.prototype.receiveMessage = function ($event) {
        this.message = $event;
    };
    __decorate([
        ViewChild('closeBtn'),
        __metadata("design:type", ElementRef)
    ], RucheRucherComponent.prototype, "closeBtn", void 0);
    RucheRucherComponent = __decorate([
        Component({
            selector: 'app-ruche-rucher',
            templateUrl: './ruche.rucher.component.html',
            styleUrls: ['./ruche.rucher.component.scss']
        }),
        __metadata("design:paramtypes", [FormBuilder,
            Location,
            Router,
            RucherService,
            UserloggedService,
            selectedRucherService,
            RapportService,
            RucheService,
            AuthService])
    ], RucheRucherComponent);
    return RucheRucherComponent;
}());
export { RucheRucherComponent };
//# sourceMappingURL=ruche.rucher.component.js.map