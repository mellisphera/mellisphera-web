import { CapteurInterface } from '../../../../_model/capteur';
import { RucherModel } from '../../../../_model/rucher-model';
import { RucheInterface } from '../../../../_model/ruche';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CapteurService } from '../../../capteur/capteur.service';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RucherService } from '../../../service/api/rucher.service';
import { UserloggedService } from '../../../../userlogged.service';

import { Observable, Subscription } from 'rxjs';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/first';
import { NotifierService } from 'angular-notifier';
import { RucheService } from '../../../service/api/ruche.service';

@Component({
  selector: 'app-sensors-hive',
  templateUrl: './sensors-hive.component.html',
  styleUrls: ['./sensors-hive.component.css']
})
export class SensorsHiveComponent implements OnInit, OnDestroy {

  username: string;

    hiveSensorSelect: RucheInterface;
    apiarySensorSelect: RucherModel;

    editCapteurCheckbox: boolean;
    paternRef: RegExp;
    indexSensorSelect: number;
    newCapteurForm: FormGroup;
    editCapteurForm: FormGroup;
    capteurSearch: string;

    message = "";
    editedSensorMsg: boolean;
    editedSensorMsgE: boolean;
    public errorMsg;
    private notifier: NotifierService;
    constructor(
        private userService: UserloggedService,
        private _router: Router,
        private formBuilder: FormBuilder,
        public rucherService: RucherService,
        public rucheService: RucheService,
        public capteurService: CapteurService,
        public notifierService: NotifierService) {
        this.paternRef = /[4][0-3]\:([a-z]|[A-Z]|[0-9])([A-Z]|[0-9]|[a-z])\:([A-Z]|[a-z]|[0-9])([a-z]|[A-Z]|[0-9])$/;
        this.username = userService.getUser();
        this.notifier = notifierService;
        this.initForm();
    }

    getApiaryNameById(idApiary: string) {
        try {
            return this.rucherService.ruchers.filter(apiary => apiary.id === idApiary)[0];
        } catch (e) {
            return this.rucherService.rucher;
        }
    }

    ngOnInit() {
        this.rucherService.rucheService.getHiveByUsername(this.userService.getUser()).subscribe(ruches => {
            this.rucherService.rucheService.ruchesAllApiary = ruches;
            this.hiveSensorSelect = ruches[0];
        })
    }

    onChangeCapteur($event) {
        this.capteurService.capteur = $event.target.value;
    }

    selectCapteur(capteur: CapteurInterface, index: number) {
        this.indexSensorSelect = index;
        this.capteurService.capteur = capteur;
        this.editCapteurCheckbox = !(this.capteurService.capteur.idHive == null || this.capteurService.capteur.idApiary == null);
        /* Assigne les données du capteurs au formulaire pour modification*/
        const donnee = {
            checkbox: this.editCapteurCheckbox ? 'ruche' : 'stock',
            description: this.capteurService.capteur.description,
        }; 
        this.editCapteurForm.setValue(donnee);
        if (this.editCapteurCheckbox) { // Si le capteur n'était pas en stock
            this.rucherService.findRucherById(this.capteurService.capteur.idApiary, (apiary) => {
                this.apiarySensorSelect = apiary[0];
            });
            this.rucherService.rucheService.findRucheById(this.capteurService.capteur.idHive, (hive) => {
                this.hiveSensorSelect = hive[0];
                const index = this.rucherService.rucheService.ruches.map(hive => hive.id).indexOf(this.hiveSensorSelect.id);
                this.rucherService.rucheService.ruches[index].sensor = false;
                this.rucherService.rucheService.emitHiveSubject();
            }, (err: string) => {
                console.error(err);
            });
        }

    }

    receiveMessage($event) {
        this.message = $event;
    }

    sortSensors(colonne: string) {
        switch (colonne) {
            case 'hive':
                this.capteurService.capteursByHive.sort((a, b) => {
                    return (a.hiveName > b.hiveName) ? 1 : -1;
                });
                break;
            case 'type':
                this.capteurService.capteursByHive.sort((a, b) => {
                    return (a.type > b.type) ? 1 : -1;
                });
                break;
            case 'ref':
                this.capteurService.capteursByHive.sort((a, b) => {
                    return (a.sensorRef > b.sensorRef) ? 1 : -1;
                });
                break;
            case 'description':
                this.capteurService.capteursByHive.sort((a, b) => {
                    return (a.description > b.description) ? 1 : -1;
                });
                break;
        }
    }

    onchange(event) {
        this.editCapteurCheckbox = (event.target.value === 'ruche');
    }
    createCapteur() {
        const formValue = this.newCapteurForm.value;
        /* POUR OBTENIR LE TYPË A CHANGER DES QUE POSSIBLE */
        const sensorType = document.querySelector('#typeSensor > option').innerHTML;
        const tempType = this.capteurService.capteur.type;
        this.capteurService.initCapteur();
        if (formValue.checkbox !== 'stock') {
            this.capteurService.capteur.idHive = this.rucheService.getCurrentHive().id;
            this.capteurService.capteur.idApiary = this.rucherService.getCurrentApiary();
            this.capteurService.capteur.apiaryName = this.rucherService.rucher.name;
            this.capteurService.capteur.hiveName = this.rucheService.getCurrentHive().name;
            const index = this.rucherService.rucheService.ruches.map(hive => hive.id).indexOf(this.rucheService.getCurrentHive().id);
            this.rucherService.rucheService.ruches[index].sensor = true;
            this.rucherService.rucheService.emitHiveSubject();
        } else {
            this.capteurService.capteur.idHive = null;
            this.capteurService.capteur.idApiary = null;
            this.capteurService.capteur.apiaryName = null;
            this.capteurService.capteur.hiveName = null;
        }
        this.capteurService.capteur.description = formValue.description;
        this.capteurService.capteur.username = this.username;
        this.capteurService.capteur.sensorRef = formValue.reference;
        this.capteurService.capteur.type = sensorType.trim();
        this.initForm();
        this.capteurService.createCapteur().subscribe(() => { }, () => { }, () => {
            if(this.userService.getJwtReponse().country === "FR"){
                this.notifier.notify('success', 'Capteur créé');
              }else{
                this.notifier.notify('success', 'Created sensor');
              }
            this.capteurService.getUserCapteurs();
        });
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
    getSensorType() {
        return this.newCapteurForm.get('type');
    }

    //DELETE CAPTEUR

    deleteCapteur(capteur: CapteurInterface, index: number) {
        this.capteurService.deleteCapteur(capteur).subscribe(() => { }, () => { }, () => {
            if (capteur.idHive) {
                const index = this.rucherService.rucheService.ruches.map(hive => hive.id).indexOf(capteur.idHive);
                const tempHive = this.rucherService.rucheService.ruches[index];
                if (this.capteurService.capteursByHive.filter(sensor => sensor.idHive === tempHive.id).length <= 1) {
                    this.rucherService.rucheService.ruches[index].sensor = false;
                    this.rucherService.rucheService.emitHiveSubject();
                }
            }
            this.capteurService.capteursByHive.splice(index, 1);
            this.capteurService.emitSensorSubject();
            if(this.userService.getJwtReponse().country === "FR"){
                this.notifier.notify('success', 'Capteur supprimé');
              }else{
                this.notifier.notify('success', 'Deleted sensor');
              }
        });
    }

    updateCapteur() {
        const formValue = this.editCapteurForm.value;
        const idTemp = this.capteurService.capteur.id;
        if (formValue.checkbox !== 'stock') {
            this.capteurService.capteur.idHive = this.hiveSensorSelect.id;
            this.capteurService.capteur.idApiary = this.getApiaryNameById(this.hiveSensorSelect.idApiary).id;
            this.capteurService.capteur.apiaryName = this.getApiaryNameById(this.hiveSensorSelect.idApiary).name;
            this.capteurService.capteur.hiveName = this.hiveSensorSelect.name;
            const index = this.rucherService.rucheService.ruches.map(hive => hive.id).indexOf(this.hiveSensorSelect.id);
            this.rucherService.rucheService.ruches[index].sensor = true;
            this.rucherService.rucheService.emitHiveSubject();
        } else {
            this.capteurService.capteur.idHive = null;
            this.capteurService.capteur.idApiary = null;
            this.capteurService.capteur.apiaryName = null;
            this.capteurService.capteur.hiveName = null;
        }
        this.capteurService.capteur.description = formValue.description;
        this.capteurService.capteur.id = idTemp;
        this.initForm();
        this.capteurService.updateCapteur().subscribe(() => { }, () => { }, () => {
            if((this.hiveSensorSelect.id === this.rucheService.getCurrentHive().id) && (this.apiarySensorSelect.id === this.rucherService.getCurrentApiary())){
                this.capteurService.capteursByHive[this.indexSensorSelect] = this.capteurService.capteur;
                this.capteurService.emitSensorSubject();
            }else{
                this.capteurService.capteursByHive.splice(this.indexSensorSelect,1);
            }
            if(this.userService.getJwtReponse().country === "FR"){
                this.notifier.notify('success', 'Capteur mis à jour');
              }else{
                this.notifier.notify('success', 'Updated sensor');
              }
        });
    }

    onSelectRucher() {
        this.rucherService.rucheService.getHivesByApiary(this.apiarySensorSelect.id);
    }

    initForm() {
        this.newCapteurForm = this.formBuilder.group({
            'reference': [null, Validators.compose(
                [Validators.required, Validators.pattern(this.paternRef)]),
                this.validateSensorNotTaken.bind(this),
                /* Validators.pattern(this.paternRef)*/
            ],
            'description': [null],
            'checkbox': ['ruche', Validators.required],
        });

        this.editCapteurForm = this.formBuilder.group({
            'description': [null],
            'checkbox': ['ruche', Validators.required]
        });
    }
    /**
     *
     * @description Verifie la valeur du control sensorRef du formulaire
     * @param {AbstractControl} control
     * @returns {Observable<any>}
     * @memberof CapteurComponent
     */
    validateSensorNotTaken(control: AbstractControl): Observable<any> {
        if (!control.valueChanges) {
            return Observable.of(null);
        } else {
            return control.valueChanges
                .debounceTime(1000)
                .distinctUntilChanged()
                .switchMap(value => this.capteurService.checkSensorExist(value))
                .map(res => {
                    return res ? null : { sensorCheck: true };
                })
                .first();
        }
        /*
        return this.capteurService.checkSensorExist(control.value).map(res => {
            return res ? null : { sensorCheck: true };
        });*/

    }
    ngOnDestroy() {
        /* this.rucherService.rucherSubject.unsubscribe(); */
        // this.capteurService.sensorSubject.unsubscribe();
        // this.rucherService.rucheService.hiveSubject.unsubscribe();
        // this.rucherService.rucheService.hiveSubject.unsubscribe();
    }

}
