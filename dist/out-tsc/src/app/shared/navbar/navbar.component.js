var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CONFIG } from './../../../config';
import { Component, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { UserloggedService } from '../../userlogged.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/Service/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { RucherService } from '../../ruche-rucher/rucher.service';
import { RucheService } from '../../accueil/Service/ruche.service';
import { FleursFloraisonService } from '../../fleurs-floraison/service/fleurs.floraison.service';
import { MeteoService } from '../../meteo/Service/MeteoService';
import { ObservationService } from '../../ruche-rucher/ruche-detail/observation/service/observation.service';
import { AtokenStorageService } from '../../auth/Service/atoken-storage.service';
import { DailyRecordService } from '../../accueil/Service/dailyRecordService';
var NavbarComponent = /** @class */ (function () {
    function NavbarComponent(location, element, data, router, authService, rucherService, rucheService, meteoService, fleursFloraisonService, observationService, formBuilder, tokenService, dailyRecordService) {
        this.element = element;
        this.data = data;
        this.router = router;
        this.authService = authService;
        this.rucherService = rucherService;
        this.rucheService = rucheService;
        this.meteoService = meteoService;
        this.fleursFloraisonService = fleursFloraisonService;
        this.observationService = observationService;
        this.formBuilder = formBuilder;
        this.tokenService = tokenService;
        this.dailyRecordService = dailyRecordService;
        this.hasBaseDropZoneOver = false;
        try {
            this.lastConnexion = this.authService.lastConnection.toDateString();
        }
        catch (e) { }
        this.location = location;
        this.sidebarVisible = false;
        this.username = data.currentUser().username;
    }
    NavbarComponent.prototype.initForm = function () {
        this.rucherForm = this.formBuilder.group({
            'nom': [null, Validators.compose([Validators.required])],
            'description': [null],
            'ville': [null, Validators.compose([Validators.required])],
            'codePostal': [null, Validators.compose([Validators.required])],
            'validate': "",
        });
    };
    NavbarComponent.prototype.logout = function () {
        this.authService.isAuthenticated = false;
        this.tokenService.signOut();
        this.authService.connexionStatus.next(false);
        this.router.navigate(['/login']);
    };
    NavbarComponent.prototype.onPictureLoad = function (next) {
        var _this = this;
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            _this.rucherService.rucher.photo = fileReader.result;
        };
        fileReader.onloadend = function () {
            next();
        };
        fileReader.readAsDataURL(this.photoApiary);
        console.log(this.rucherService.rucher);
    };
    NavbarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.listTitles = ROUTES.filter(function (listTitle) { return listTitle; });
        var navbar = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        console.log(this.toggleButton);
        this.data.currentMessage.subscribe(function (message) { return _this.message = message; });
        this.initForm();
    };
    NavbarComponent.prototype.onSelectRucher = function () {
        console.log(this.rucherService.rucher);
        this.rucheService.getRucheByApiary(this.username, this.rucherService.rucher);
        this.rucherService.getRucherDetails();
        this.fleursFloraisonService.getUserFleur(this.rucherService.rucher.id);
        this.meteoService.getWeather(this.rucherService.rucher.ville);
        this.observationService.getObservationByIdApiary(this.rucherService.rucher.id);
        this.rucheService.getRucheByApiary(this.username, this.rucherService.rucher.id);
        this.dailyRecordService.getDailyRecThByApiary(this.rucherService.rucher.id);
        this.rucherService.saveCurrentApiaryId(this.rucherService.rucher.id);
    };
    NavbarComponent.prototype.sidebarOpen = function () {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');
        this.sidebarVisible = true;
    };
    NavbarComponent.prototype.sidebarClose = function () {
        var body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    NavbarComponent.prototype.sidebarToggle = function () {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        }
        else {
            this.sidebarClose();
        }
    };
    NavbarComponent.prototype.getTitle = function () {
        var title = this.location.prepareExternalUrl(this.location.path());
        title = title.split('/').pop();
        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === title) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    };
    NavbarComponent.prototype.apiarySubmit = function () {
        var formValue = this.rucherForm.value;
        if (this.photoApiary == null) {
            this.rucherService.rucher.photo = CONFIG.URL_FRONT + 'assets/imageClient/testAccount.png';
        }
        console.log(this.rucherService.rucher.photo);
        this.rucherService.rucher.id = null;
        this.rucherService.rucher.description = formValue.description;
        this.rucherService.rucher.name = formValue.nom;
        this.rucherService.rucher.ville = formValue.ville;
        this.rucherService.rucher.codePostal = formValue.codePostal;
        this.rucherService.rucher.createdAt = new Date();
        this.rucherService.rucher.username = this.username;
        console.log(this.rucherService.rucher);
        this.initForm();
        this.rucherService.createRucher();
    };
    NavbarComponent = __decorate([
        Component({
            // moduleId: module.id,
            selector: 'navbar-cmp',
            templateUrl: 'navbar.component.html',
            styleUrls: ['./navbar.component.scss']
        }),
        __metadata("design:paramtypes", [Location,
            ElementRef,
            UserloggedService,
            Router,
            AuthService,
            RucherService,
            RucheService,
            MeteoService,
            FleursFloraisonService,
            ObservationService,
            FormBuilder,
            AtokenStorageService,
            DailyRecordService])
    ], NavbarComponent);
    return NavbarComponent;
}());
export { NavbarComponent };
//# sourceMappingURL=navbar.component.js.map