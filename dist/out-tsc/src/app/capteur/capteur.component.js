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
import { CapteurService } from './capteur.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RucherService } from '../ruche-rucher/rucher.service';
import { UserloggedService } from '../userlogged.service';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { selectedRucherService } from '../accueil/_shared-services/selected-rucher.service';
var CapteurComponent = /** @class */ (function () {
    function CapteurComponent(data, _router, formBuilder, rucherService, capteurService, _selectedRucherService) {
        this.data = data;
        this._router = _router;
        this.formBuilder = formBuilder;
        this.rucherService = rucherService;
        this.capteurService = capteurService;
        this._selectedRucherService = _selectedRucherService;
        //variable to store ruches
        this.ruches = [];
        this.message = "";
        this.username = data.currentUser().username;
        this.initForm();
    }
    CapteurComponent.prototype.ngOnInit = function () {
    };
    CapteurComponent.prototype.onChangeCapteur = function ($event) {
        this.capteurService.capteur = $event.target.value;
    };
    CapteurComponent.prototype.selectCapteur = function (capteur) {
        this.capteurService.capteur = capteur;
        /* Assigne les données du capteurs au formulaire pour modification*/
        var donnee = {
            checkbox: '',
            description: this.capteurService.capteur.description,
        };
        this.editCapteurForm.setValue(donnee);
        this.editCapteurCheckbox = !(this.capteurService.capteur.idHive == null || this.capteurService.capteur.idApiary == null);
        if (this.editCapteurCheckbox) {
            this.rucherService.findRucherById(this.capteurService.capteur.idApiary);
            this.rucherService.rucheService.findRucheById(this.capteurService.capteur.idHive);
        }
    };
    CapteurComponent.prototype.receiveMessage = function ($event) {
        this.message = $event;
    };
    CapteurComponent.prototype.onchange = function (event) {
        this.editCapteurCheckbox = (event.target.value === 'ruche');
    };
    //CREATE CAPTEUR
    CapteurComponent.prototype.createCapteur = function () {
        var formValue = this.newCapteurForm.value;
        var tempType = this.capteurService.capteur.type;
        this.capteurService.initCapteur();
        //this.capteurService.capteur = formValue;
        if (formValue.checkbox != "stock") {
            this.capteurService.capteur.idHive = this.rucherService.rucheService.ruche.id;
            this.capteurService.capteur.idApiary = this.rucherService.rucher.id;
            this.capteurService.capteur.apiaryName = this.rucherService.rucher.name;
            this.capteurService.capteur.hiveName = this.rucherService.rucheService.ruche.name;
        }
        else {
            this.capteurService.capteur.idHive = null;
            this.capteurService.capteur.idApiary = null;
            this.capteurService.capteur.apiaryName = null;
            this.capteurService.capteur.hiveName = null;
        }
        this.capteurService.capteur.description = formValue.description;
        this.capteurService.capteur.username = this.username;
        this.capteurService.capteur.reference = formValue.reference;
        this.capteurService.capteur.type = tempType;
        this.initForm();
        this.capteurService.createCapteur();
    };
    CapteurComponent.prototype.getTypeAffectation = function () {
        return this.newCapteurForm.get('checkbox');
    };
    CapteurComponent.prototype.getTypeAffectationFormUpdate = function () {
        return this.editCapteurForm.get('checkbox');
    };
    CapteurComponent.prototype.getSensorRef = function () {
        return this.newCapteurForm.get('reference');
    };
    //DELETE CAPTEUR
    CapteurComponent.prototype.deleteCapteur = function (capteur) {
        this.capteurService.capteur = capteur;
        this.capteurService.deleteCapteur();
    };
    CapteurComponent.prototype.updateCapteur = function () {
        var formValue = this.editCapteurForm.value;
        var tempType = this.capteurService.capteur.type;
        var idTemp = this.capteurService.capteur.id;
        this.capteurService.initCapteur();
        //this.capteurService.capteur = formValue;
        if (formValue.checkbox != "stock") {
            this.capteurService.capteur.idHive = this.rucherService.rucheService.rucheUpdate.id;
            this.capteurService.capteur.idApiary = this.rucherService.rucherUpdate.id;
            this.capteurService.capteur.apiaryName = this.rucherService.rucherUpdate.name;
            this.capteurService.capteur.hiveName = this.rucherService.rucheService.rucheUpdate.name;
        }
        else {
            this.capteurService.capteur.idHive = null;
            this.capteurService.capteur.idApiary = null;
            this.capteurService.capteur.apiaryName = null;
            this.capteurService.capteur.hiveName = null;
        }
        this.capteurService.capteur.description = formValue.description;
        this.capteurService.capteur.id = idTemp;
        this.capteurService.capteur.type = tempType;
        this.initForm();
        this.capteurService.updateCapteur();
    };
    CapteurComponent.prototype.onSelectRucher = function () {
        this.rucherService.rucheService.getRucheByApiary(this.username, this.rucherService.rucherUpdate.id);
    };
    CapteurComponent.prototype.initForm = function () {
        this.newCapteurForm = this.formBuilder.group({
            'reference': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
            'description': [null],
            'checkbox': '',
        });
        this.editCapteurForm = this.formBuilder.group({
            'description': [null],
            'checkbox': ''
        });
    };
    CapteurComponent = __decorate([
        Component({
            selector: 'app-capteur',
            templateUrl: './capteur.component.html',
            styleUrls: ['./capteur.component.scss']
        }),
        __metadata("design:paramtypes", [UserloggedService,
            Router,
            FormBuilder,
            RucherService,
            CapteurService,
            selectedRucherService])
    ], CapteurComponent);
    return CapteurComponent;
}());
export { CapteurComponent };
//# sourceMappingURL=capteur.component.js.map