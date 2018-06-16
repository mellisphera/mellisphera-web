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
    //object for details ruchers
    detailsRucher : any[] =[];

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

   private timerSubscription: AnonymousSubscription;
 
    
  constructor(  private formBuilder: FormBuilder,
                public location: Location,
                public router: Router,
                public rucherService : RucherService,
                private data : UserloggedService,
                private _selectedRucherService : selectedRucherService) {
        
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
        console.log("logged user rucher/ruches : "+ this.username);
       

        
     
  } 



    ngOnInit(){
      this.updateRucherInput=false;
      console.log("init current rucher : " + String(this.selectedRucher));
      this.x=String(this.selectedRucher);
      this.x=this.currentRucherID;
      this.selectedRucher=this.x;
      console.log("selected rucher : " + this.selectedRucher);
      this.getUserRuchers();  
      this.getRucheDuRucher();
      this.getDetailsRucher();
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
        }
    );
    }
}
//Fonction pour créer le rucher
createRucher(rucher){
      if(this.selectedRucher==null){
        this.selectedRucherNull=true;
        return "aucun rucher selectionné !";
    }
    else{

        //JSON.stringify(this.username);
        this.rucher.name=this.nom;
        this.rucher.description=this.description;
        this.rucher.codePostal=this.codePostal;
        this.rucher.username=this.username;
        this.rucher.createdAt=new Date();
        this.rucher.username=this.username;


        this.rucherService.createRucher(this.rucher).subscribe( 
              data => {
                this.getUserRuchers();
                return true;
              },
             ( error => this.errorMsg=error)
              
        );
        alert("Votre rucher a été créé");
        this.refreshRucherData()
        this.newRucherForm.reset();

    }
  }
  //Editer Rucher
  onEditerRucher(rucher){
    console.log("this.nomEdit : " + this.nomEdit);
    console.log("this.descriptionEdit : "+ this.descriptionEdit);
    console.log("this.codePostalEdit : " + this.codePostalEdit);
    if (confirm("Etes vous sur de vouloir editer ce rucher : ?")){
      this.rucher.name=this.nomEdit;
      this.rucher.description=this.descriptionEdit;
      this.rucher.codePostal=this.codePostalEdit;
      this.rucher.id=String(this.selectedRucher);
    if(this.rucher.name != null && this.rucher.description!=null && this.rucher.id!=null){
      this.rucherService.updateRucher(this.rucher).subscribe( 
        data => {},
        ( error => this.errorMsg=error)
        );
      }

  }


     alert("Votre rucher a été éditée");
     this.subscribeToData();
     this.refreshRucherData();
     this.editRucherClicked();
     this.getDetailsRucher();
     this.newRucherForm.reset();
  }

  getUserRuchers(){
    console.log("this username :"+  this.username);
    this.rucherService.getUserRuchers(this.username).subscribe(
      data => { this.ruchers = data;},
      err => console.error(err),
      () => console.log()
    );


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

  isSelectedRucherNull(){
    if(this.selectedRucher==null){
      this.selectedRucherNull=true;
      return "aucun rucher selectionné !";
    }
    else{
      this.selectedRucherNull=false;
    }
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
      this.subscribeToData();
  
  }

  //Pour créer une ruche
  createRuche(ruche){
        this.ruche.name=this.nomRuche;
        this.ruche.description=this.descriptionRuche;
        this.ruche.username= this.username;
        this.ruche.id=null;
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

  private refreshRucherData(): void {
    this.timerSubscription = Observable.timer(500).first().subscribe(() => this.getUserRuchers());
  }
  private subscribeToData(): void {
    this.timerSubscription = Observable.timer(500).first().subscribe(() => this.getRucheDuRucher());
  }

  resetRucheForm(){
    this.newRucheForm.reset();
  }

  editRucherClicked(){
    if(this.updateRucherInput==true){
      this.updateRucherInput=false;
      this.editRucherForm.reset();

    }  
    else if(this.updateRucherInput==false){
      this.updateRucherInput=true;
    }
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
