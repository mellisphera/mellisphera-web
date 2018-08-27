import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { Rucher } from './rucher';
import { Ruche } from './ruche';
import { RucherService } from './rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { selectedRucherService } from '../_shared-services/selected-rucher.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { AnonymousSubscription } from "rxjs/Subscription";
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
    // new rucher form
    newRucherForm : FormGroup;
    nom ='';
    description='';
    codePostal='';
    // Edit Rucher 
    editRucherForm : FormGroup;
    nomEdit ='';
    descriptionEdit='';
    codePostalEdit='';
    //object to create a new rucher
    rucher = new Rucher();
    rucherE = new Rucher();
    //object for details ruchers
    detailsRucher : any[] =[];
    // array to store observations nature
    observationsNature : any[] = []; 

    //nouvelle ruche
    ruche = new Ruche();
    newRucheForm : FormGroup;
    nomRuche ='';
    descriptionRuche='';

    x; 
    
    selectedRucher = new Rucher();
    selectedRuche = new Ruche();
    selectedRucherNull:boolean;
    public errorMsg;
    //updateRucher input is true when user clicks on Update Rucher
    updateRucherInput: boolean;

    parentMessage;

    localStorageRuche;
    //localStorageRucheName;

   private timerSubscription: AnonymousSubscription;
 
    
  constructor(  private formBuilder: FormBuilder,
                public location: Location,
                public router: Router,
                public rucherService : RucherService,
                private data : UserloggedService,
                private _selectedRucherService : selectedRucherService,
                private _rapportService : RapportService) {
        
            this.newRucherForm=formBuilder.group({
                    'nom': [null,Validators.compose([Validators.required])],
                    'description': [null,Validators.compose([Validators.required])],
                    'codePostal': [null,Validators.compose([Validators.required])],
                    
                    'validate' : ``
                })

            this.editRucherForm=formBuilder.group({
                  'nom': [null,Validators.compose([Validators.required])],
                  'description': [null,Validators.compose([Validators.required])],
                  'codePostal': [null,Validators.compose([Validators.required])],
                  'validate' : ``
              })
            this.newRucheForm=formBuilder.group({
                  'nomRuche': [null,Validators.compose([Validators.required])],
                  'descriptionRuche': [null,Validators.compose([Validators.required])]
            })
     

        
        this.username= data.currentUser().username;
        this.currentRucherID= localStorage.getItem("currentRucher");
        
  } 



ngOnInit(){
     // this.clearRucherSelection();
      this.updateRucherInput=false;
      console.log("localStorage.getItem()" +localStorage.getItem("currentRucher"));
      console.log("init current rucher : " + String(this.selectedRucher));
      this.x=String(this.selectedRucher);
      this.x=this.currentRucherID;
      this.selectedRucher=this.x;
      console.log("selected rucher : " + this.selectedRucher);
      this.getUserRuchers();  
      this.getRucheDuRucher();
      this.getDetailsRucher();
      this.getObservationsNature();
}

getObservationsNature(){
  this._rapportService.getObservationsNature(this.selectedRucher).subscribe(
    data => { 
              this.observationsNature = data;
            },
    err => console.error(err),
    () => console.log()
  );
}

clickOnRuche(ruche){
     
       
        this.selectedRuche=ruche;
        this.localStorageRuche= this.selectedRuche.id;
 
        console.log("this.selectedRuche : "+ this.selectedRuche );
        console.log("this.selectedRuche : "+ this.selectedRuche );
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
      console.log("selected rucher in getDetails rucher : " + this.selectedRucher);
     
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
        //JSON.stringify(this.username);
        this.rucher.name=this.nom;
        this.rucher.description=this.description;
        this.rucher.codePostal=this.codePostal;
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
        this.refreshRucherData()
        this.newRucherForm.reset();

    
  }
  //delete rucher
  deleteRucher(rucher){
    //console.log("Delete rucher " + this.selectedRucher);
    rucher= this.selectedRucher;
    console.log("to delete rucher : " + rucher);
    
   
      if(this.selectedRucher!=null) {
        if (confirm("Etes vous sur de vouloir supprimer : " + this.selectedRucher + "?")) {
          this.rucherService.deleteRucher(rucher).subscribe(
            data => {},
          ( error => this.errorMsg=error)
        );
        //this.clearRucherSelection();
        this.refreshRucherData(); 
        //this.currentRucherID=null;g
        this.subscribeToData();
        this.getDetailsRucher();
        alert("this.rucher[0].id : " +  this.ruchers[0].id)
        localStorage.setItem("currentRucher",   this.ruchers[0].id);
        this.selectedRucher= this.ruchers[0].id;
        alert("le rucher a été supprimé :( ")
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
    this.rucherE.codePostal=this.editRucherForm.controls['codePostal'].value;
    this.rucherE.id=String(this.selectedRucher);
    if (confirm("Etes vous sur de vouloir editer ce rucher : ?" + this.rucherE.name)){
  
      console.log(" this.rucherE.name : " +  this.rucherE.name);
    
      this.rucherService.updateRucher(this.rucherE).subscribe( 
        data => {},
        ( error => this.errorMsg=error)
        );
      this.updateRucherInput=false;
      //this.editRucherClicked();

}


alert("Votre rucher a été éditée");
     this.subscribeToData();
     this.refreshRucherData();
     //this.editRucherClicked();
     this.getDetailsRucher();
     //this.newRucherForm.reset();
}

getUserRuchers(){
    console.log("this username :"+  this.username);
    this.rucherService.getUserRuchers(this.username).subscribe(
      data => { this.ruchers = data;},
      err => console.error(err),
      () => console.log()
    );
    console.log("rucher[0] : "+  this.ruchers[0]);
    console.log("rucher[0] : "+  this.selectedRucher);

}

  getRucheDuRucher(){
    console.log("In get ruche du rucher :"+  this.currentRucherID);
  
      this.rucherService.getUserRuches(this.username,this.currentRucherID).subscribe(
        data => { this.ruches = data },
        () => console.log()
      );  
  
 
  }

  onSelectRucher(event : any) : void{
    this.currentRucherID=String(this.selectedRucher);
    localStorage.setItem("currentRucher",String(this.selectedRucher));
    console.log("current rucher : "+this.currentRucherID);
    console.log("selected rucher : "+this.selectedRucher);
    this.getRucheDuRucher();
    this.getDetailsRucher();

  }

  onSelectRuche(ruche){
    this.selectedRuche=ruche;
    this.nomRuche=this.selectedRuche.name;
    this.descriptionRuche=this.selectedRuche.description;
    console.log("selected ruche : "+ this.selectedRuche.name);
  }

  //Pour effacer une ruche

  deleteRuche(ruche){
      this.selectedRuche = ruche;
      if (confirm("Etes vous sur de vouloir supprimer : " + this.selectedRuche.name + "?")) {
        this.rucherService.deleteRuche(this.selectedRuche).subscribe(
              data => {},
            ( error => this.errorMsg=error)
          
          );
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
        this.ruche.hivePosX='1';
        this.ruche.hivePosY='1';
        this.ruche.idApiary=String(this.currentRucherID);
        
        console.log("Selected rucher ID : "+this.selectedRucher );
        if(this.selectedRucher!=undefined){
          this.rucherService.createRuche(this.ruche).subscribe( 
            data => {},
            ( error => this.errorMsg=error)
          );
        }
        alert("Votre Ruche a été créé avec Succès !");
        this.subscribeToData();
        this.newRucheForm.reset();
  }
  // pour editer une ruche
  onEditerRuche(ruche){
       this.ruche.name=this.nomRuche;
       this.ruche.description=this.descriptionRuche;
       this.ruche.id=this.selectedRuche.id;
       this.rucherService.updateRuche(this.ruche).subscribe( 
              data => {},
              ( error => this.errorMsg=error)
        );
        alert("Votre ruche a été éditée");
        this.subscribeToData();
        this.newRucheForm.reset();
  }
  editRucherClicked(){
    if(this.updateRucherInput==true){
      this.updateRucherInput=false;
      //Fthis.editRucherForm.reset();      
    }  
    else if(this.updateRucherInput==false && this.selectedRucher!=null){
      this.updateRucherInput=true;
       
    }
  }

  private refreshRucherData(): void {
    this.timerSubscription = Observable.timer(500).first().subscribe(() => this.getUserRuchers());
    this.timerSubscription = Observable.timer(600).first().subscribe(() => this.getDetailsRucher());
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




}
