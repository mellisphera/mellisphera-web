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
// import { AnonymousSubscription } from "rxjs/Subscription";
import { HttpClient } from '@angular/common/http';
import { RapportService } from './rapport.service';
import { Rucher } from '../ruche-rucher/rucher';
import { UserloggedService } from '../userlogged.service';
import { RucherService } from '../ruche-rucher/rucher.service';
import { FormBuilder, Validators } from '@angular/forms';
var RapportComponent = /** @class */ (function () {
    //nomRuche;
    function RapportComponent(formBuilder, http, rapportService, data, rucherService) {
        this.formBuilder = formBuilder;
        this.http = http;
        this.rapportService = rapportService;
        this.data = data;
        this.rucherService = rucherService;
        this.selectedRucher = new Rucher();
        this.message = "";
        this.rapportForm = formBuilder.group({
            'texte': [null, Validators.compose([Validators.required])],
        });
    }
    RapportComponent.prototype.ngOnInit = function () {
        this.btnAnalyse = true;
    };
    RapportComponent.prototype.getAnalyseTemp = function () {
        var formValue = this.rapportForm.value;
        this.rapportService.getNluResult(formValue, this.rucherService.rucher.id);
    };
    RapportComponent.prototype.onSelectRucher = function (event) {
        localStorage.setItem("currentRucher", String(this.selectedRucher));
    };
    RapportComponent.prototype.receiveMessage = function ($event) {
        this.message = $event;
    };
    RapportComponent = __decorate([
        Component({
            selector: 'app-rapport',
            templateUrl: './rapport.component.html',
            styleUrls: ['./rapport.component.scss']
        }),
        __metadata("design:paramtypes", [FormBuilder,
            HttpClient,
            RapportService,
            UserloggedService,
            RucherService])
    ], RapportComponent);
    return RapportComponent;
}());
export { RapportComponent };
//# sourceMappingURL=rapport.component.js.map