import { Component, OnInit } from '@angular/core';
import { CapteurService } from './capteur.service';
import { FormGroup, FormBuilder, Validators,FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RucherService } from '../ruche-rucher/rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { Rucher } from '../ruche-rucher/rucher';
import { Ruche } from '../ruche-rucher/ruche';
import { Capteur } from './capteur';
import { CapteurInterface } from '../../_model/capteur';

import { Observable, Subscription } from 'rxjs';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { selectedRucherService } from '../_shared-services/selected-rucher.service';
import { ninvoke } from 'q';

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

  // private timerSubscription: AnonymousSubscription;
  private timerSubscription: Subscription;
  
    receiveMessage($event){
            this.message=$event;

    }
    
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
       // this.getUserRuchers(); 
      /*  this.selectRadioStock();
        this.getAllCapteur();
        this.radioRucheE=false;
        this.radioStockE=true;*/
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
       /* this.capteur.reference=this.reference;
        this.capteur.type=this.newCapteurForm.controls['type'].value;
        this.capteur.description=this.description;
        this.capteur.username = this.username;

        if(this.radioStock){
            this.capteur.idHive = "stock";
            this.capteur.idApiary = "stock";
        }else {
            var idRuche = String(this.selectedRuche);
            this.capteur.idHive = idRuche;
            this.capteur.idApiary = String(this.selectedRucher);
        }

        this.capteurService.createCapteur(this.capteur).subscribe( 
            data => { 
                alert("capteur créé ! ");
             },
             ( error => this.errorMsg=error)
        );
       
        this.resetCapteurForm();
        //location.reload();
        this.radioRuche=false;
        this.radioStock=true;
        
        alert("Votre Capteur a été créé");
        this.subscribeToData();*/
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
        //this.capteurService.capteur.username = this.username;
        //this.capteurService.capteur.reference = formValue.reference;
        this.capteurService.capteur.type = tempType;
        this.initForm();
        this.capteurService.updateCapteur();

      /*
        if(this.radioStockE){
            this.selectedCapteur.idHive = "stock";
            this.selectedCapteur.idApiary = "stock";
        } else {
            this.selectedCapteur.idApiary=String(this.selectedRucherEdit);
            this.selectedCapteur.idHive=String(this.selectedRucheEdit);
        }
          
        this.selectedCapteur.description = this.descriptionE;
 
        this.capteurService.updateCapteur(this.selectedCapteur).subscribe(
            data => {},
             ( error => this.errorMsg=error)
        );
        alert("capteur modifié ! ");
        this.resetCapteurEditForm();
        this.editedSensorMsgE=false;
        this.radioRucheE=false;
        this.radioStockE=true;
        this.subscribeToData();
        */
    }

   /* getUserRuchers(){
            this.rucherService.getUserRuchers(this.username).subscribe(
                data => { this.ruchers = data },
                err => console.error(err));
        
    }
*/
    onSelectRucher(){
        console.log("ok");
        this.rucherService.rucheService.getRucheByApiary(this.username,this.rucherService.rucher.id);
      /*  this.selectedRucher=event.target.value;
        //this.getRucheDuRucher();
        console.log(this.ruches);
        //this.getDetailsRucher();*/
    }
    
    onSelectRuche(event : any) : void{
      /*  this.selectedRuche=event.target.value;*/
        //this.getRucheDuRucher();
        //this.getDetailsRucher();
    }

   /* getRucheDuRucher(){
        this.rucherService.getUserRuches(this.username,this.selectedRucher).subscribe(
        data => { this.ruches = data }
        );
    }*/

    onCancelClicked(){
     /* this.resetCapteurForm();
      this.editedSensorMsg=false;
      this.editCapteurForm.reset();*/
    }

    resetCapteurForm(){
       /* this.newCapteurForm.get('reference').reset();
        this.newCapteurForm.get('type').reset();
        this.newCapteurForm.get('description').reset();*/
    }

    onCancelClickedE(){
      /* this.resetCapteurEditForm();
        this.editedSensorMsgE=false;
        this.editCapteurForm.reset();*/
    }

    resetCapteurEditForm(){
      /*  this.editCapteurForm.get('description').reset();
        this.radioRucheE=false;
        this.radioStockE=true;*/
    }

    private subscribeToData(): void {
       // this.timerSubscription = Observable.timer(200).first().subscribe(() => this.getAllCapteur());
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