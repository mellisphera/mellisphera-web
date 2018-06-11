import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Rucher } from './rucher';
import { Ruche } from './ruche';
import { RucherService } from './rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { selectedRucherService } from '../_shared-services/selected-rucher.service';

@Component({
  selector: 'app-ruche-rucher',
  templateUrl: './ruche.rucher.component.html'
})

export class RucheRucherComponent implements OnInit {

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
 
    
  constructor(  private formBuilder: FormBuilder,
                public location: Location,
                public router: Router,
                public rucherService : RucherService,
                private data : UserloggedService,
                private _selectedRucherService : selectedRucherService) {
        
            this.newRucherForm=formBuilder.group({
                    'nom': [null,Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(20)])],
                    'description': [null,Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(400)])],
                    'codePostal': [null,Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(100)])],
                    
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
      console.log("init current rucher : " + String(this.selectedRucher));
      this.x=String(this.selectedRucher);
      this.x=this.currentRucherID;
      this.selectedRucher=this.x;
      this.getUserRuchers();  
      this.getRucheDuRucher();
    }

  resetForm(){
   this.newRucherForm.reset();
  }

  //Pour créer une ruche
  createRuche(ruche){
    this.ruche.name=this.nomRuche;
    this.ruche.description=this.descriptionRuche;
    this.ruche.username= this.username;
    this.ruche.idApiary=String(this.selectedRucher);
    
    console.log("Selected rucher ID : "+this.selectedRucher );
    if(this.selectedRucher!=undefined){
      this.rucherService.createRuche(this.ruche).subscribe( 
        data => {}
      );
    }
    alert("Votre Ruche a été créé avec Succès !");
    this.getRucheDuRucher();
    this.newRucheForm.reset();
    //location.reload();
    
  }

  getDetailsRucher(){
      this.rucherService.getRucherDetails(this.selectedRucher).subscribe( 
      data => {
        this.detailsRucher=data;
        /*
        console.log("DATA : " + data);
        console.log("this.detailsRucher: " + this.detailsRucher);
        */
      }
  );

  
//console.log("RUCHER DETAILS : " + this.detailsRucher);

}
//Fonction pour créer le rucher
createRucher(rucher){
        JSON.stringify(this.username);
        this.rucher.name=this.nom;
        this.rucher.description=this.description;
        this.rucher.codePostal=this.codePostal;
        this.rucher.username=this.username;
        this.rucher.createdAt=new Date();
        this.rucher.username=this.username;
        this.rucherService.createRucher(this.rucher).subscribe( 
              data => {}
        );
        alert("Votre rucher a été créé");
        this.getUserRuchers();
        this.newRucherForm.reset();
        
  }

  getUserRuchers(){
    console.log("this username :"+  this.username);
    this.rucherService.getUserRuchers(this.username).subscribe(
      data => { this.ruchers = data;},
      err => console.error(err),
      () => console.log()
    );
    //console.log(this.ruchers);

  }

  getRucheDuRucher(){
    console.log("this username :"+  this.username);
    if(this.selectedRucher!=null){
      this.rucherService.getUserRuches(this.username,this.currentRucherID).subscribe(
        data => { this.ruches = data },
        () => console.log()
      );  
    }
 
  }

  onSelectRucher(event : any) : void{
    //console.log("SELECTED RUCHER AFTER INIIT XXXXX : "+ this.selectedRucher);
    //this.selectedRucher=event.target.value;
    //console.log("Selected Rucher : "+ this.selectedRucher);
    //localStorage.setItem("currentRucher",event.target.value);
    this.currentRucherID=String(this.selectedRucher);
    localStorage.setItem("currentRucher",String(this.selectedRucher));
    console.log("current rucher : "+this.currentRucherID);
    console.log("selected rucher : "+this.selectedRucher);
    this.getRucheDuRucher();
    this.getDetailsRucher();

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
