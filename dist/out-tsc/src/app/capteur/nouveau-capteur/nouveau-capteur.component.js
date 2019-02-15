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
import { CapteurService } from '../capteur.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RucherService } from '../../ruche-rucher/rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { Rucher } from '../../ruche-rucher/rucher';
import { Ruche } from '../../ruche-rucher/ruche';
import { Capteur } from '../capteur';
import { Observable } from 'rxjs/Rx';
var NouveauCapteurComponent = /** @class */ (function () {
    /*
                 private formBuilder: FormBuilder,
                 public location: Location,
                 public router: Router,
                 private capteurService : CapteurService
    */
    function NouveauCapteurComponent(data, formBuilder, _router, rucherService, capteurService) {
        this.data = data;
        this.formBuilder = formBuilder;
        this._router = _router;
        this.rucherService = rucherService;
        this.capteurService = capteurService;
        this.ruchers = [];
        this.capteurs = [];
        this.selectedRucher = new Rucher();
        this.selectedRuche = new Ruche();
        this.selectedCapteur = new Capteur();
        //variable to store ruches
        this.ruches = [];
        this.capteur = new Capteur();
        this.reference = '';
        this.type = '';
        this.description = '';
        this.message = "";
        this.radioRuche = false;
        this.radioStock = true;
        this.selectedRucher = null;
        this.selectedRuche = null;
        this.newCapteurForm = formBuilder.group({
            'reference': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
            'type': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(400)])],
            'description': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(400)])],
            'selectedRucher': [null],
            'selectedRuche': [null],
            'checkbox': [],
            'validate': ""
        });
        this.username = data.currentUser().username;
    }
    NouveauCapteurComponent.prototype.receiveMessage = function ($event) {
        this.message = $event;
    };
    NouveauCapteurComponent.prototype.selectRadioStock = function () {
        this.radioRuche = false;
        this.radioStock = true;
        this.selectedRucher = null;
        this.selectedRuche = null;
        this.newCapteurForm.get('selectedRuche').clearValidators();
        this.newCapteurForm.get('selectedRuche').updateValueAndValidity();
    };
    NouveauCapteurComponent.prototype.selectRadioRuche = function () {
        this.radioRuche = true;
        this.radioStock = false;
        console.log("radio stock : " + this.radioStock);
        console.log("radio ruche : " + this.radioRuche);
        this.newCapteurForm.get('selectedRuche').setValidators([Validators.required]);
        this.newCapteurForm.get('selectedRuche').updateValueAndValidity();
    };
    NouveauCapteurComponent.prototype.getAllCapteur = function () {
        /* console.log("this username :"+  this.username);
        
         this.capteurService.getUserCapteurs(String(this.username)).subscribe(
           data => {this.capteurs=data;},
           err  => {console.log(err)},
           () => console.log('done loading sensors')
         );*/
    };
    //CREATE CAPTEUR
    NouveauCapteurComponent.prototype.createCapteur = function (capteur) {
        /*this.capteur.reference=this.reference;
        this.capteur.type=this.type;
        this.capteur.description=this.description;
        var idRuche = String(this.selectedRuche);
        this.capteur.idHive = idRuche;
        this.capteur.idApiary = String(this.selectedRucher);

        if(this.radioStock==true){
            this.capteur.idHive = "stock";
            this.capteur.idApiary = "stock";
        }


        this.capteurService.createCapteur(this.capteur).subscribe(
            data => {}
        );
        this._router.navigate['/capteurs'];
        this.newCapteurForm.reset();
       
    
        alert("Votre Capteur a été créé");
        //this.subscribeToData();*/
    };
    //DELETE CAPTEUR
    NouveauCapteurComponent.prototype.getUserRuchers = function () {
        console.log("this username :" + this.username);
        /*this.rucherService.getUserRuchers(this.username).subscribe(
            data => { this.ruchers = data },
            err => console.error(err),
            () => console.log('done loading ruchers')
        );*/
    };
    NouveauCapteurComponent.prototype.onSelectRucher = function (event) {
        this.selectedRucher = event.target.value;
        console.log("Selected Rucher : " + this.selectedRucher);
        this.getRucheDuRucher();
        //this.getDetailsRucher();
    };
    NouveauCapteurComponent.prototype.onSelectRuche = function (event) {
        this.selectedRuche = event.target.value;
        console.log("L'ID de la ruche selectionnée : " + this.selectedRuche);
        this.getRucheDuRucher();
        //this.getDetailsRucher();
    };
    NouveauCapteurComponent.prototype.getRucheDuRucher = function () {
        console.log("this username :" + this.username);
        /* this.rucherService.getUserRuches(this.username,this.selectedRucher).subscribe(
         data => { this.ruches = data },
         
         () => console.log('Done loading RUCHES ')
         );*/
    };
    NouveauCapteurComponent.prototype.onCancelClicked = function () {
        this.newCapteurForm.reset();
        this.radioRuche = false;
        this.radioStock = true;
    };
    NouveauCapteurComponent.prototype.subscribeToData = function () {
        var _this = this;
        this.timerSubscription = Observable.timer(1000).first().subscribe(function () { return _this.getAllCapteur(); });
    };
    NouveauCapteurComponent.prototype.ngOnInit = function () {
        this.getUserRuchers();
        console.log("liste capteurs :" + this.capteurs);
    };
    NouveauCapteurComponent = __decorate([
        Component({
            selector: 'app-capteur',
            templateUrl: './nouveau-capteur.component.html',
            styleUrls: ['./nouveau-capteur.component.scss']
        }),
        __metadata("design:paramtypes", [UserloggedService,
            FormBuilder,
            Router,
            RucherService,
            CapteurService])
    ], NouveauCapteurComponent);
    return NouveauCapteurComponent;
}());
export { NouveauCapteurComponent };
//# sourceMappingURL=nouveau-capteur.component.js.map