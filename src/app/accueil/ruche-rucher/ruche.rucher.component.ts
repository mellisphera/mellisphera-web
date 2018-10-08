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

@Component({
  selector: 'app-ruche-rucher',
  templateUrl: './ruche.rucher.component.html'
})

export class RucheRucherComponent implements OnInit {

  @ViewChild('closeBtn') closeBtn: ElementRef;

  //variable to store ruchers
  ruchers: any [] = [];
  //variable to store ruches
  ruches: any [] = [];
  //variable for connected user
  username : string;
  //variable for currentRucher ID
  currentRucherID: string;
  rucheRucherID : string;
  // new rucher form
  newRucherForm : FormGroup;
  nom ='';
  description='';
  codePostal='';
  ville='';
  // Edit Rucher 
  editRucherForm : FormGroup;
  nomEdit ='';
  descriptionEdit='';
  villeEdit='';
  codePostalEdit='';

  //
  newObs = new ProcessReport();
  //New Observation
  ObservationForm : FormGroup;
  type='ApiaryObs';
  date = new Date();
  dateEdit = String();
  sentence='';
  //object to create a new apiary
  rucher = new Rucher();
  //object to edit the apiary
  rucherE = new Rucher();
  //object for details ruchers
  detailsRucher : Rucher[] =[];
  // array to store observations apiary
  apiaryObs : ProcessReport[] = []; 
    

  //nouvelle ruche
  ruche = new Ruche();
  newRucheForm : FormGroup;
  nomRuche ='';
  descriptionRuche='';

  x; 
    
  selectedRucher = new Rucher();
  selectedRuche = new Ruche();
  selectedRucherAssocie = new Rucher();
  selectedObs = new ProcessReport();
  selectedRucherNull:boolean;
  public errorMsg;
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
                private _rapportService : RapportService) {
        
            this.newRucherForm=formBuilder.group({
                    'nom': [null,Validators.compose([Validators.required])],
                    'description': [null],
                    'ville': [null,Validators.compose([Validators.required])],
                    'codePostal': [null,Validators.compose([Validators.required])],
                    'validate' : ``
                })

            this.editRucherForm=formBuilder.group({
                  'nom': [null,Validators.compose([Validators.required])],
                  'description': [null],
                  'ville': [null,Validators.compose([Validators.required])],
                  'codePostal': [null,Validators.compose([Validators.required])],
                  'validate' : ``
              })
            this.newRucheForm=formBuilder.group({
                  'nomRuche': [null,Validators.compose([Validators.required])],
                  'descriptionRuche': [null],
                  'rucheRucher':[null,Validators.compose([Validators.required])]
            })
            this.ObservationForm=formBuilder.group({
              'sentence': [null,Validators.compose([Validators.required])]
        })

        
        this.username= data.currentUser().username;
        this.currentRucherID= localStorage.getItem("currentRucher");
        this.rucheRucherID= localStorage.getItem("rucheRucherID");
  } 



ngOnInit(){
  // this.clearRucherSelection();
  this.updateRucherInput=false;
  this.x=String(this.selectedRucher);
  this.x=this.currentRucherID;
  this.selectedRucher=this.x;
  this.selectedRucherAssocie=this.selectedRucher;
  this.getUserRuchers();  
  this.getRucheDuRucher();
  this.getDetailsRucher();
  this.getObservationsApiary();
}

getObservationsApiary(){
  this.rucherService.getObservation(this.selectedRucher).subscribe(
    data => { 
      this.apiaryObs = data;
    },
    err => console.error(err));
}

clickOnRuche(ruche){    
  this.selectedRuche=ruche;
  this.localStorageRuche= this.selectedRuche.id;
  localStorage.setItem("clickedRuche",  this.localStorageRuche);
  localStorage.setItem("selectedRucheName",  this.selectedRuche.name);
}

resetForm(){
  this.newRucherForm.reset();
}


getDetailsRucher(){
    if(this.selectedRucher==null){
       return "";
    }
    else{
      this.rucherService.getRucherDetails(this.selectedRucher).subscribe( 
        data => {
          this.detailsRucher=data;
        },
        ( error => this.errorMsg=error)
     
    );
    }
}

clearRucherSelection(){
  this.selectedRucher=null;
  this.currentRucherID=null;
}

//Fonction pour créer le rucher
createRucher(rucher){
        this.selectedRucherNull=true;
        this.rucher.name=this.nom;
        this.rucher.description=this.description;
        this.rucher.codePostal=this.codePostal;
        this.rucher.ville=this.ville;
        this.rucher.username=this.username;
        this.rucher.createdAt=new Date();
        this.rucher.username=this.username;
        this.rucher.urlPhoto='void';


        this.rucherService.createRucher(this.rucher).subscribe( 
              data => {
                if(this.selectedRucher==null){
                  this.selectedRucherNull=true;
                  return "aucun rucher selectionné !";
              }
        
                this.getUserRuchers();
                return true;
              },
             ( error => this.errorMsg=error)
              
        );
        alert("Votre rucher a été créé");
        this.refreshRucherData();
        this.newRucherForm.reset();
}
//delete rucher
deleteRucher(rucher){
  this.selectedRucher = rucher;
  if(this.selectedRucher!=null) {
    if (confirm("Etes vous sur de vouloir supprimer : " + rucher.name + "?")) {
      this.rucherService.deleteRucher(rucher).subscribe(
        data => {},
        ( error => this.errorMsg=error)
      );
      localStorage.setItem("currentRucher",   this.ruchers[0].id);
      this.selectedRucher= this.ruchers[0].id;
      this.getDetailsRucher();
      this.refreshRucherData(); 
      this.subscribeToData();
      alert("le rucher a été supprimé :( ");
    }
  }
  else {
    alert("aucun rucher selectionné");
  }
}

//Editer Rucher
onEditerRucher(rucherEdit){
  this.rucherE.name=this.editRucherForm.controls['nom'].value;
  this.rucherE.description=this.editRucherForm.controls['description'].value;
  this.rucherE.ville=this.editRucherForm.controls['ville'].value;
  this.rucherE.codePostal=this.editRucherForm.controls['codePostal'].value;
  this.rucherE.id=String(this.selectedRucher);
  if (confirm("Etes vous sur de vouloir editer le rucher \""+this.rucherE.name+"\" : ?")){    
    this.rucherService.updateRucher(this.rucherE).subscribe( 
      data => {},
      ( error => this.errorMsg=error)
      );
    this.updateRucherInput=false;
    alert("Votre rucher a été édité");
    this.refreshRucherData();
    this.getDetailsRucher();
    this.subscribeToData();
    this.newRucherForm.reset();

  } 
}

getUserRuchers(){
  this.rucherService.getUserRuchers(this.username).subscribe(
    data => { this.ruchers = data;},
    err => console.error(err)
  );
}

getRucheDuRucher(){
      this.rucherService.getUserRuches(this.username,this.currentRucherID).subscribe(
        data => { this.ruches = data },
        () => console.log()
      );  
}

onSelectRucher(event : any) : void{
  this.currentRucherID=String(this.selectedRucher);
  this.selectedRucherAssocie = this.selectedRucher;
  this.rucheRucherID=String(this.selectedRucher);
  localStorage.setItem("currentRucher",String(this.selectedRucher));
  localStorage.setItem("rucheRucherID",String(this.selectedRucher));
  this.getRucheDuRucher();
  this.getDetailsRucher();
  this.getObservationsApiary();
}

onSelectRucherAssocie(event : any) : void{
  this.rucheRucherID=String(this.selectedRucherAssocie);
  localStorage.setItem("rucheRucherID",String(this.selectedRucherAssocie));
}

onSelectRuche(ruche){
    this.selectedRuche=ruche;
    this.nomRuche=this.selectedRuche.name;
    this.descriptionRuche=this.selectedRuche.description;
}

onSelectObs(obs){
    this.selectedObs=obs;
    this.type=this.selectedObs.type;
    this.sentence=this.selectedObs.sentence;
    this.dateEdit=this.selectedObs.date;
  }

//Pour effacer une ruche
deleteRuche(ruche){
  this.selectedRuche = ruche;
  if (confirm("Etes vous sur de vouloir supprimer : " + ruche.name + "?")) {
    this.rucherService.deleteRuche(this.selectedRuche).subscribe(
      data => {},
      ( error => this.errorMsg=error));

  }
  this.refreshRucherData();
  this.subscribeToData();
  this.selectedRucher=this.ruchers[0];
}

//Pour créer une ruche
createRuche(ruche){
  this.ruche.name=this.nomRuche;
  this.ruche.description=this.descriptionRuche;
  this.ruche.username= this.username;
  this.ruche.id=null;
  this.ruche.idApiary=String(this.currentRucherID);     
  if(this.selectedRucher!=undefined){
    this.rucherService.createRuche(this.ruche).subscribe( 
      data => {},
      ( error => this.errorMsg=error));
  }
  alert("Votre Ruche a été créé avec Succès !");
  this.newRucheForm.reset();
  this.subscribeToData();
}

// pour editer une ruche
onEditerRuche(ruche){
  this.ruche.name=this.nomRuche;
  this.ruche.description=this.descriptionRuche;
  this.ruche.id=this.selectedRuche.id;
  this.ruche.idApiary=this.rucheRucherID;
  this.rucherService.updateRuche(this.ruche).subscribe( 
    data => {},
    ( error => this.errorMsg=error));
  alert("Votre ruche a été éditée");
  this.selectedRucherAssocie=this.selectedRucher;
  this.subscribeToData();   
}

editRucherClicked(){
  if(this.updateRucherInput==true){
    this.updateRucherInput=false;
    //this.editRucherForm.reset();      
  }  
  else if(this.updateRucherInput==false && this.selectedRucher!=null){
    this.updateRucherInput=true;     
  }
}


//Pour créer une observation
createObservation(observation){
  // Format de la date enregistrée
  var options = {
    weekday:'short',year:'numeric',month:'long',day:'2-digit',hour: 'numeric', minute: 'numeric', second: 'numeric',
  };
  this.newObs.date = new Intl.DateTimeFormat('fr-FR', options).format(this.date);
  this.newObs.type = this.type;
  this.newObs.sentence = this.sentence;
  this.newObs.idApiary = this.currentRucherID;
  this.newObs.idHive = '';
  this.newObs.nluScore = '';
  this.newObs.id=null;
  this.rucherService.createObservation(this.newObs).subscribe( 
    data => {},
      ( error => this.errorMsg=error));
  alert("Votre Observations a été enregistrée avec Succès !");
  this.getObservationsApiary();
  this.ObservationForm.reset();
}

deleteObs(ap){
  if (confirm("Etes vous sur de vouloir supprimer cette observation ?")) {
    this.rucherService.deleteObservation(ap.id).subscribe( 
      data => {},
      ( error => this.errorMsg=error));
    this.refreshObsData();
  }
}

onEditObservation(Formvalue){
  this.newObs.date = this.dateEdit;
  this.newObs.sentence = this.sentence;
  this.newObs.type = this.type;
  this.newObs.id = this.selectedObs.id;
  this.newObs.idApiary = this.selectedObs.idApiary;
  this.newObs.idHive = this.selectedObs.idHive;
  this.newObs.nluScore = this.selectedObs.nluScore;
  this.rucherService.updateObs(this.newObs).subscribe( 
    data => {},
    ( error => this.errorMsg=error));
  alert("Votre observation a été éditée");
  this.getObservationsApiary();
}

resetObservationForm(){
  this.ObservationForm.reset();
}

private refreshObsData(): void {
  this.timerSubscription = Observable.timer(200).first().subscribe(() => this.getObservationsApiary());
}

private refreshRucherData(): void {
  this.timerSubscription = Observable.timer(500).first().subscribe(() => this.getUserRuchers());
  this.timerSubscription = Observable.timer(600).first().subscribe(() => this.getDetailsRucher());
  this.timerSubscription = Observable.timer(500).first().subscribe(()=> this.rucherService.getUserRuchersLast(this.username));
}
  
private subscribeToData(): void {
  this.timerSubscription = Observable.timer(700).first().subscribe(() => this.getRucheDuRucher());  
}

resetRucheForm(){
  this.newRucheForm.reset();
}


  
isMap(path){
  var titlee = this.location.prepareExternalUrl(this.location.path());
  titlee = titlee.slice( 1 );
  if(path == titlee){
    return false;
  }
  else {
    return true;
  }
}   
message="";
    receiveMessage($event){
        this.message=$event;
    }
}