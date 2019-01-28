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
import { AuthService } from '../../auth/Service/auth.service';

@Component({
  selector: 'app-ruche-rucher',
  templateUrl: './ruche.rucher.component.html',
  styleUrls : ['./ruche.rucher.component.scss']
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

  public addNewShareStatus : Boolean;
  public newsUserSharing : String;

  parentMessage;

  optionsDate = {
    weekday:'short',year:'numeric',month:'long',day:'2-digit',hour: 'numeric', minute: 'numeric', second: 'numeric',
  };

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
                public rucheService : RucheService,
                private authService : AuthService) {


        
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

addUserShare(event){
  //console.log(event);
  if(event.code == 'Enter'){
    console.log(this.authService.user);
  }
}

//Fonction pour créer le rucher
createRucher(){
  const formValue = this.rucherForm.value;
  this.rucherService.rucher = {
    id : null,
    latitude: '',
    longitude: '',
    name: '',
    description : '',
    createdAt : null,
    urlPhoto : '',
    username : '',
    codePostal : '',
    ville : ''
 };
  this.rucherService.rucher.id=null;
  this.rucherService.rucher.description = formValue.description;
  this.rucherService.rucher.name = formValue.nom;
  this.rucherService.rucher.ville = formValue.ville;
  this.rucherService.rucher.codePostal = formValue.codePostal;
  this.rucherService.rucher.createdAt = new Date();
  this.rucherService.rucher.urlPhoto = "void";
  this.rucherService.rucher.username = this.username;
  this.initForm();
  this.rucherService.createRucher();
} 
//delete rucher
deleteRucher(){
  this.rucherService.deleteRucher();
}

//Editer Rucher
onEditerRucher(){
const formValue = this.rucherForm.value;
this.rucherService.detailsRucher.description = formValue.description;
this.rucherService.detailsRucher.name = formValue.nom;
this.rucherService.detailsRucher.ville = formValue.ville;
this.rucherService.detailsRucher.codePostal = formValue.codePostal;
this.initForm();
this.rucherService.updateRucher();
this.updateRucherInput = false;

}

onSelectRucher(){
  this.rucheService.getRucheByApiary(this.username,this.rucherService.rucher.id);
  this.rucherService.getRucherDetails();
}

//Quand on Edite une ruche


onSelectObs(obs){
  this.rucherService.observationService.observation = obs;
  var donnée = {
    sentence : this.rucherService.observationService.observation.sentence,
    date : this.rucherService.observationService.observation.date
  };
  this.observationForm.setValue(donnée);
  }

//Pour effacer une ruche
deleteRuche(ruche){
  this.rucheService.ruche = ruche;
  this.rucheService.deleteRuche();
}

//Pour créer une ruche
createRuche(){
  const formValue = this.newRucheForm.value;
  this.rucheService.initRuche();
  this.rucheService.ruche.id= null;
  this.rucheService.ruche.idApiary = this.rucherService.rucher.id;
  this.rucheService.ruche.description = formValue.descriptionRuche;
  this.rucheService.ruche.name = formValue.nomRuche;
  this.rucheService.ruche.username = this.username;
  this.initForm();
  this.rucheService.createRuche();
}

onSelectRuche(ruche){
  this.rucheService.ruche = ruche;
  var donnée = {
    nomRuche: this.rucheService.ruche.name,
    descriptionRuche: this.rucheService.ruche.description,
  };
  this.newRucheForm.setValue(donnée);
}
// pour editer une ruche
onEditeRuche(){
  const formValue = this.newRucheForm.value;
  var lastIdApiary = this.rucheService.ruche.idApiary;
  this.rucheService.ruche.idApiary = this.rucherService.rucherSelectUpdate.id;
  this.rucheService.ruche.name = formValue.nomRuche;
  this.rucheService.ruche.description = formValue.descriptionRuche;
  this.rucheService.updateRuche(lastIdApiary);
}

editRucherClicked(){
  this.updateRucherInput = true;
  var donnée = {
    nom:this.rucherService.rucher.name,
    description: this.rucherService.rucher.description,
    ville: this.rucherService.rucher.ville,
    codePostal: this.rucherService.rucher.codePostal,
    validate : ''
  };
  this.rucherForm.setValue(donnée);
}


//Pour créer une observation
createObservation(){
  const formValue = this.observationForm.value;
  this.rucherService.observationService.observation = formValue;
  this.rucherService.observationService.observation.idApiary = this.rucherService.rucher.id;
  this.rucherService.observationService.observation.type = "ApiaryObs";
  this.initForm();
  this.rucherService.observationService.createObservation();
}

deleteObs(obsApiary){
  this.rucherService.observationService.observation = obsApiary;
  this.rucherService.observationService.deleteObservation();
}

onEditObservation(){
  const formValue = this.observationForm.value;
  this.rucherService.observationService.observation.sentence = formValue.sentence;
  this.rucherService.observationService.updateObservation();
 }

resetRucheForm(){
  this.newRucheForm.reset();
}

initForm(){
  this.observationForm=this.formBuilder.group({
    'sentence': [null,Validators.compose([Validators.required])],
    'date' : new Intl.DateTimeFormat('fr-FR', this.optionsDate).format(new Date()),
  })
  this.newRucheForm=this.formBuilder.group({
    'nomRuche': [null,Validators.compose([Validators.required])],
    'descriptionRuche': [null],
  })
  this.rucherForm=this.formBuilder.group({
    'nom': [null,Validators.compose([Validators.required])],
    'description': [null],
    'ville': [null,Validators.compose([Validators.required])],
    'codePostal': [null,Validators.compose([Validators.required])],
    'validate' : ``
  })
}
  
cancelUpdateRucher(){
  this.updateRucherInput=false;
  this.initForm();
}

receiveMessage($event){
  this.message=$event;
}

}