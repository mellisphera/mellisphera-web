import { Component, OnInit } from '@angular/core';
import { CapteurService } from './capteur.service';
import { FormGroup, FormBuilder, Validators,FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RucherService } from '../ruche-rucher/rucher.service';
import { UserloggedService } from '../../userlogged.service';

import { Observable, Subscription } from 'rxjs';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { selectedRucherService } from '../_shared-services/selected-rucher.service';

@Component({
  selector: 'app-capteur',
  templateUrl: './capteur.component.html',
  styleUrls: ['./capteur.component.scss']
})
export class CapteurComponent implements OnInit {

  username: string;

  editCapteurCheckbox : boolean;

  //variable to store ruches
  ruches: any [] = [];
  //for new sensor
  newCapteurForm : FormGroup;
  //to edit a sensor
  editCapteurForm : FormGroup;
  capteurSearch : string;

  message="";
  editedSensorMsg :boolean;
  editedSensorMsgE : boolean;
  public errorMsg;
    
    constructor(
        private data : UserloggedService,
        private _router : Router,
        private formBuilder: FormBuilder,
        public rucherService : RucherService,
        public capteurService : CapteurService,
        private _selectedRucherService : selectedRucherService, ) { 

                   
        this.username = data.currentUser().username;
        this.initForm();
        
    }


    ngOnInit() {
    }

    onChangeCapteur($event){
        this.capteurService.capteur = $event.target.value;
        console.log(this.capteurService.capteur);
    }
    selectCapteur(capteur){
        this.capteurService.capteur = capteur;
        var donnée = {
            checkbox: this.capteurService.capteur.hiveName,
            description: this.capteurService.capteur.description,
        };
        this.editCapteurForm.setValue(donnée);
        this.editCapteurCheckbox = donnée.checkbox != "stock";
    }

    receiveMessage($event){
        this.message=$event;
    }

    checkCapteurType(value : any){       

    } 

   //CREATE CAPTEUR
    createCapteur(){
        alert("ok");
        var formValue = this.newCapteurForm.value;
        console.log(formValue);
        let tempType = this.capteurService.capteur.type; 
        this.capteurService.initCapteur();
        //this.capteurService.capteur = formValue;
        if(formValue.checkbox != "stock"){
            console.log("ruche")
            this.capteurService.capteur.idHive = this.rucherService.rucheService.ruche.id;
            this.capteurService.capteur.idApiary = this.rucherService.rucher.id;
        }
        else{
            this.capteurService.capteur.idHive = "stock";
            this.capteurService.capteur.idApiary = "stock";
        }
        this.capteurService.capteur.description = formValue.description
        console.log(this.capteurService.capteur);
        this.capteurService.capteur.username = this.username;
        this.capteurService.capteur.reference = formValue.reference;
        this.capteurService.capteur.type = tempType;
        this.initForm();
        this.capteurService.createCapteur();
    }  
    getTypeAffectation(){
        return this.newCapteurForm.get('checkbox');
    }
    getTypeAffectationFormUpdate(){
        return this.editCapteurForm.get('checkbox');
    }
    getSensorRef(){
        return this.newCapteurForm.get("reference");
    }

    //DELETE CAPTEUR

    deleteCapteur(capteur){
       this.capteurService.capteur = capteur;
       this.capteurService.deleteCapteur();
     
    }

    updateCapteur(){
        const formValue = this.editCapteurForm.value;
        let tempType = this.capteurService.capteur.type; 
        let idTemp = this.capteurService.capteur.id;
        this.capteurService.initCapteur();
        //this.capteurService.capteur = formValue;
        console.log(formValue);
        if(formValue.checkbox != "stock"){
            console.log("ruche")
            this.capteurService.capteur.idHive = this.rucherService.rucheService.ruche.id;
            this.capteurService.capteur.idApiary = this.rucherService.rucher.id;
        }
        else{
            this.capteurService.capteur.idHive = "stock";
            this.capteurService.capteur.idApiary = "stock";
        }
        this.capteurService.capteur.description = formValue.description
        this.capteurService.capteur.id = idTemp;
        console.log(this.capteurService.capteur);
        this.capteurService.capteur.type = tempType;
        this.initForm();
        this.capteurService.updateCapteur();
    }

    onSelectRucher(){
        console.log("ok");
        this.rucherService.rucheService.getRucheByApiary(this.username,this.rucherService.rucher.id);
    }

    initForm(){
        this.newCapteurForm = this.formBuilder.group({
            'reference': [null,Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(20)])],
            'description': [null],
            'checkbox':'',
        });

        this.editCapteurForm = this.formBuilder.group({
            'description': [null],
            'checkbox':''
        });
    }
 
}