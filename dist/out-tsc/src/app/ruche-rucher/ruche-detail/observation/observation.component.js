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
import { RucherService } from '../../rucher.service';
import { DailyRecordsWService } from '../service/daily-records-w.service';
import { ActivatedRoute } from '@angular/router';
import { DailyStockHoneyService } from '../service/daily-stock-honey.service';
import { RecordService } from '../service/Record/record.service';
import { ObservationService } from './service/observation.service';
import { FormBuilder, Validators } from '@angular/forms';
import { RucheService } from '../../../accueil/Service/ruche.service';
var ObservationComponent = /** @class */ (function () {
    //observationsHive : ProcessReport[] = [];
    function ObservationComponent(rucherService, formBuilder, dailyRecWService, activatedRoute, dailyStockHoneyService, recordService, observationService, rucheService) {
        this.rucherService = rucherService;
        this.formBuilder = formBuilder;
        this.dailyRecWService = dailyRecWService;
        this.activatedRoute = activatedRoute;
        this.dailyStockHoneyService = dailyStockHoneyService;
        this.recordService = recordService;
        this.observationService = observationService;
        this.rucheService = rucheService;
        this.optionsDate = {
            weekday: 'short', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric',
        };
        this.initForm();
    }
    ObservationComponent.prototype.ngOnInit = function () {
        /*this.rucheId = this.activatedRoute.snapshot.params.id;
        this.rucheName = this.activatedRoute.snapshot.params.name;
        this.observationService.getObservationByIdHive(this.rucheService.ruche.id);*/
    };
    ObservationComponent.prototype.initForm = function () {
        this.ObservationForm = this.formBuilder.group({
            'sentence': [null, Validators.compose([Validators.required])],
            'type': '',
            'date': new Date()
        });
    };
    ObservationComponent.prototype.createObservation = function () {
        var formValue = this.ObservationForm.value;
        this.observationService.observation = formValue;
        this.observationService.observation.idHive = this.rucheService.ruche.id;
        this.observationService.observation.idLHive = [this.rucheService.ruche.id];
        this.initForm();
        this.observationService.createObservation();
    };
    ObservationComponent.prototype.onSelectObsR = function (hiveOBS) {
        this.observationService.observation = hiveOBS;
        var donnée = {
            sentence: this.observationService.observation.sentence,
            type: this.observationService.observation.type,
            date: this.observationService.observation.date
        };
        this.ObservationForm.setValue(donnée);
    };
    ObservationComponent.prototype.onEditObservation = function () {
        var formValue = this.ObservationForm.value;
        this.observationService.observation.sentence = formValue.sentence;
        this.observationService.updateObservation();
    };
    ObservationComponent.prototype.deleteObsR = function (hiveObs) {
        this.observationService.observation = hiveObs;
        this.observationService.deleteObservation();
    };
    ObservationComponent.prototype.resetObservationForm = function () {
        this.ObservationForm.get('sentence').reset();
    };
    ObservationComponent = __decorate([
        Component({
            selector: 'app-observation',
            templateUrl: './observation.component.html',
            styleUrls: ['./observation.component.css']
        }),
        __metadata("design:paramtypes", [RucherService,
            FormBuilder,
            DailyRecordsWService,
            ActivatedRoute,
            DailyStockHoneyService,
            RecordService,
            ObservationService,
            RucheService])
    ], ObservationComponent);
    return ObservationComponent;
}());
export { ObservationComponent };
//# sourceMappingURL=observation.component.js.map