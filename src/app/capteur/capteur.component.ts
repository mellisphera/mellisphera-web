import { RucherModel } from './../_model/rucher-model';
import { RucheInterface } from './../_model/ruche';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CapteurService } from './capteur.service';
import { FormGroup, FormBuilder, Validators,FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RucherService } from '../ruche-rucher/rucher.service';
import { UserloggedService } from '../userlogged.service';

import { Observable, Subscription } from 'rxjs';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { selectedRucherService } from '../accueil/_shared-services/selected-rucher.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/first';

@Component({
  selector: 'app-capteur',
  templateUrl: './capteur.component.html',
  styleUrls: ['./capteur.component.scss']
})
export class CapteurComponent implements OnInit, OnDestroy {

  username: string;
  hiveSensorSelect: RucheInterface;
  apiarySensorSelect: RucherModel;
  editCapteurCheckbox: boolean;
  paternRef: RegExp;
  //variable to store ruches
  ruches: any [] = [];
  //for new sensor
  newCapteurForm: FormGroup;
  //to edit a sensor
  editCapteurForm: FormGroup;
  capteurSearch: string;

  message ="";
  editedSensorMsg: boolean;
  editedSensorMsgE: boolean;
  public errorMsg;
    constructor(
        private userService : UserloggedService,
        private _router : Router,
        private formBuilder: FormBuilder,
        public rucherService: RucherService,
        public capteurService: CapteurService,
        private _selectedRucherService: selectedRucherService, ) {
        this.paternRef = /[4][0-9]\:([a-z]|[A-Z]|[0-9])([A-Z]|[0-9])\:([A-Z]|[a-z]|[0-9])([a-z]|[A-Z]|[0-9])$/;
        this.username = userService.getUser();
        this.initForm();
    }


    ngOnInit() {
    }

    onChangeCapteur($event) {
        this.capteurService.capteur = $event.target.value;
    }
    selectCapteur(capteur) {
        this.capteurService.capteur = capteur;
        /* Assigne les données du capteurs au formulaire pour modification*/
        const donnee = {
            checkbox: '',
            description: this.capteurService.capteur.description,
        };
        this.editCapteurForm.setValue(donnee);
        this.editCapteurCheckbox = !(this.capteurService.capteur.idHive == null || this.capteurService.capteur.idApiary == null);
        if (this.editCapteurCheckbox) { // Si le capteur n'était pas en stock
            this.rucherService.findRucherById(this.capteurService.capteur.idApiary, (apiary) => {
                this.apiarySensorSelect = apiary;
            });
            this.rucherService.rucheService.findRucheById(this.capteurService.capteur.idHive, (hive) => {
                this.hiveSensorSelect = hive;
            });
        }

    }

    receiveMessage($event) {
        this.message = $event;
    }

    onchange(event) {
        this.editCapteurCheckbox = (event.target.value === 'ruche');
    } 

   //CREATE CAPTEUR
    createCapteur() {
        const formValue = this.newCapteurForm.value;
        /* POUR OBTENIR LE TYPË A CHANGER DES QUE POSSIVLE */
        const sensorType = document.querySelector('#typeSensor > option').innerHTML;
        const tempType = this.capteurService.capteur.type;
        this.capteurService.initCapteur();
        //this.capteurService.capteur = formValue;
        if (formValue.checkbox != 'stock') {
            this.capteurService.capteur.idHive = this.hiveSensorSelect.id;
            this.capteurService.capteur.idApiary = this.apiarySensorSelect.id;
            this.capteurService.capteur.apiaryName = this.apiarySensorSelect.name;
            this.capteurService.capteur.hiveName = this.hiveSensorSelect.name;
        }
        else{
            this.capteurService.capteur.idHive = null;
            this.capteurService.capteur.idApiary = null;
            this.capteurService.capteur.apiaryName = null;
            this.capteurService.capteur.hiveName = null;
        }
        this.capteurService.capteur.description = formValue.description;
        this.capteurService.capteur.username = this.username;
        this.capteurService.capteur.reference = formValue.reference;
        this.capteurService.capteur.type = sensorType;
        console.log(this.capteurService.capteur);
        this.initForm();
        this.capteurService.createCapteur();
    }
    getTypeAffectation() {
        return this.newCapteurForm.get('checkbox');
    }
    getTypeAffectationFormUpdate() {
        return this.editCapteurForm.get('checkbox');
    }
    getSensorRef() {
        return this.newCapteurForm.get('reference');
    }
    getSensorType () {
        console.log(this.newCapteurForm.get('type'));
        return this.newCapteurForm.get('type');
    }

    //DELETE CAPTEUR

    deleteCapteur(capteur){
       this.capteurService.capteur = capteur;
       this.capteurService.deleteCapteur();
    }

    updateCapteur() {
        const formValue = this.editCapteurForm.value;
        const idTemp = this.capteurService.capteur.id;
        this.capteurService.initCapteur();
        //this.capteurService.capteur = formValue;
        if (formValue.checkbox != 'stock') {
            this.capteurService.capteur.idHive = this.hiveSensorSelect.id;
            this.capteurService.capteur.idApiary = this.apiarySensorSelect.id;
            this.capteurService.capteur.apiaryName = this.apiarySensorSelect.name;
            this.capteurService.capteur.hiveName = this.hiveSensorSelect.name;
        }
        else {
            this.capteurService.capteur.idHive = null;
            this.capteurService.capteur.idApiary = null;
            this.capteurService.capteur.apiaryName = null;
            this.capteurService.capteur.hiveName = null;
        }
        this.capteurService.capteur.description = formValue.description;
        this.capteurService.capteur.type = formValue.type;
        this.capteurService.capteur.id = idTemp;
        console.log(this.capteurService.capteur);
        //this.capteurService.capteur.type = tempType;

        this.initForm();
        this.capteurService.updateCapteur();
    }

    onSelectRucher(){
        this.rucherService.rucheService.getRucheByApiary(this.apiarySensorSelect.id);
    }

    initForm(){
        this.newCapteurForm = this.formBuilder.group({
            'reference': [null, Validators.compose(
                [Validators.required, Validators.pattern(this.paternRef)]),
                this.validateSensorNotTaken.bind(this),
               /* Validators.pattern(this.paternRef)*/
            ],
            'description': [null],
            'checkbox':'',
        });

        this.editCapteurForm = this.formBuilder.group({
            'description': [null],
            'checkbox':''
        });
    }
    validateSensorNotTaken(control: AbstractControl) {
        if (!control.valueChanges) {
            return Observable.of(null);
          } else {
            return control.valueChanges
              .debounceTime(1000)
              .distinctUntilChanged()
              .switchMap(value => this.capteurService.checkSensorExist(value))
              .map(res => {
                  return res ? false : { sensorCheck: true };
              })
              .first();
          }
        /*
        return this.capteurService.checkSensorExist(control.value).map(res => {
            return res ? null : { sensorCheck: true };
        });*/

    }
    ngOnDestroy() {
        this.rucherService.rucherSubject.unsubscribe();
        this.rucherService.rucheService.hiveSubject.unsubscribe();
    }
}