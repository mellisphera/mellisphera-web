import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { Rucher } from './rucher';
import { Ruche } from './ruche';
import { ProcessReport } from './processedReport';
import { RucherService } from './rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { selectedRucherService } from '../_shared-services/selected-rucher.service';
import { Observable, Subscription } from 'rxjs';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { RapportService } from '../rapport/rapport.service';
import { RucheService } from '../disposition-ruche/Service/ruche.service';
import { ObservationService } from './ruche-detail/observation/service/observation.service';
import { RucherModel } from '../../_model/rucher-model';

@Component({
  selector: 'app-ruche-rucher',
  templateUrl: './ruche.rucher.component.html'
})

export class RucheRucherComponent implements OnInit {

  @ViewChild('closeBtn') closeBtn: ElementRef;


  //variable for currentRucher ID
  currentRucherID: string;
  rucheRucherID : string;
  // new rucher form
  newRucherForm : FormGroup;
  username : string = "";
  //
  newObs = new ProcessReport();
  //New Observation
  observationForm : FormGroup;
  rucherForm : FormGroup;
  type='ApiaryObs';
  message="";
  newRucheForm : FormGroup;
  //updateRucher input is true when user clicks on Update Rucher
  updateRucherInput: boolean;

  parentMessage;

  localStorageRuche;
  //localStorageRucheName;
  private timerSubscription: Subscription;
 
    
  constructor(  private formBuilder: FormBuilder,
                public location: Location,
                public router: Router,
                public rucherService : RucherService,
                private data : UserloggedService,
                private _selectedRucherService : selectedRucherService,
                private _rapportService : RapportService,
                private rucheService : RucheService,
                public observationService : ObservationService) {


        
        this.username= data.currentUser().username;
        this.currentRucherID= localStorage.getItem("currentRucher");
        this.rucheRucherID= localStorage.getItem("rucheRucherID");


  } 



ngOnInit(){
  this.initForm();
}


clickOnRuche(ruche){    
  localStorage.setItem("clickedRuche",  this.localStorageRuche);
  //localStorage.setItem("selectedRucheName",  this.selectedRuche.name);
}

resetForm(){
  this.newRucherForm.reset();
}


getDetailsRucher(){

}

clearRucherSelection(){
}

//Fonction pour créer le rucher
createRucher(){
  const formValue = this.rucherForm.value;
  console.log(formValue);
  this.rucherService.rucher.id=null;
  this.rucherService.rucher.description = formValue.description;
  this.rucherService.rucher.name = formValue.nom;
  this.rucherService.rucher.ville = formValue.ville;
  this.rucherService.rucher.codePostal = formValue.codePostal;
  this.rucherService.rucher.createdAt = new Date();
  this.rucherService.rucher.urlPhoto = "void";
  console.log(this.rucherService.rucher);
  this.initForm();
  this.rucherService.createRucher();
} 
//delete rucher
deleteRucher(rucher){

}

//Editer Rucher
onEditerRucher(){


}

getUserRuchers(){

}

getRucheDuRucher(){
     // this.rucherService.getUserRuches(this.username,this.currentRucherID).subscribe(
}

onSelectRucher(){
  console.log(this.rucherService.rucher);
  this.rucheService.getRucheByApiary(this.username,this.rucherService.rucher.id);
}

//Quand on Edite une ruche


onSelectObs(obs){/*
    this.selectedObs=obs;
    this.type=this.selectedObs.type;
    this.sentence=this.selectedObs.sentence;
    this.dateEdit=this.selectedObs.date;*/
  }

//Pour effacer une ruche
deleteRuche(ruche){

}

//Pour créer une ruche
createRuche(){
  const formValue = this.newRucheForm.value;
  console.log(formValue);
  console.log(this.rucherService.rucheService.ruche);
  this.rucherService.rucheService.ruche.idApiary = this.rucherService.rucher.id;
  this.rucherService.rucheService.ruche.description = formValue.descriptionRuche;
  this.rucherService.rucheService.ruche.name = formValue.nomRuche;
  this.rucherService.rucheService.ruche.username = this.username;
  console.log(this.rucherService.rucheService.ruche);
  this.initForm();
  this.rucheService.createRuche();
}

onSelectRuche(ruche){
  this.rucheService.ruche = ruche;
  console.log(this.rucheService.ruche);
  var donnée = {
    nomRuche: this.rucheService.ruche.name,
    descriptionRuche: this.rucheService.ruche.description,
    rucheRucher:''
  };
  this.newRucheForm.setValue(donnée);
}
// pour editer une ruche
onEditeRuche(){
  
}

editRucherClicked(){

}


//Pour créer une observation
createObservation(){
  const formValue = this.observationForm.value;
  console.log(formValue);
  this.observationService.observation = formValue;
  console.log(this.observationService.observation);
  this.initForm();
  this.observationService.createObservation();
}

deleteObsR(hiveObs){
  this.observationService.observation = hiveObs;
  this.observationService.deleteObservation();
}

onEditObservation(){
  const formValue = this.observationForm.value;
  this.observationService.observation.sentence = formValue.sentence;
  console.log(this.observationService.observation);
  this.observationService.updateObservation();
 }

resetRucheForm(){
  this.newRucheForm.reset();
}

initForm(){
  this.observationForm=this.formBuilder.group({
    'sentence': [null,Validators.compose([Validators.required])]
  })
  this.newRucheForm=this.formBuilder.group({
    'nomRuche': [null,Validators.compose([Validators.required])],
    'descriptionRuche': [null],
    'rucheRucher':[null,Validators.compose([Validators.required])]
  })
  this.rucherForm=this.formBuilder.group({
    'nom': [null,Validators.compose([Validators.required])],
    'description': [null],
    'ville': [null,Validators.compose([Validators.required])],
    'codePostal': [null,Validators.compose([Validators.required])],
    'validate' : ``
  })
}
   
receiveMessage($event){
  this.message=$event;
}

}