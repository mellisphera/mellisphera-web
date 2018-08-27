import { Component, OnInit, Input} from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { AnonymousSubscription } from "rxjs/Subscription";
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { RapportService } from './rapport.service';
import { Rucher } from '../ruche-rucher/rucher';
import { UserloggedService } from '../../userlogged.service';
import { RucherService } from '../ruche-rucher/rucher.service';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html'
})

export class RapportComponent implements OnInit {
   
  btnAnalyse: boolean;
  
  //variable to store ruchers
  ruchers: any [] = [];
  observationsNature : any[] = []; 
  observationsRuche : any[] = [];
  actionsApicole : any[] = [];  
  rapportForm : FormGroup;

  texteRapport ='';
  rapportAnalyse='';
  idApiary='xx';
  resultatRapport;
  selectedRucher = new Rucher();
  //variable for connected user
  username : string;
  x;
  currentRucherID;


  public errorMsg;
  //nomRuche;
    constructor(private formBuilder: FormBuilder,
                private http:HttpClient,
                private _rapportService : RapportService,
                private data : UserloggedService,
                public rucherService : RucherService,
              ){  
                this.rapportForm=formBuilder.group({
                  'texte': [null,Validators.compose([Validators.required])],
                  
              })
    
        this.username= data.currentUser().username;
        console.log("local storage ruche ID "+localStorage.getItem("clickedRuche") );
    }

    ngOnInit(){
      console.log(this.texteRapport);
      this.getUserRuchers();
      this.currentRucherID= localStorage.getItem("currentRucher");
      this.x=String(this.selectedRucher);
      this.x=this.currentRucherID;
      this.selectedRucher=this.x;
      this.deleteAllReportTemp();
      console.log("nat : "+this.observationsNature);
      this.btnAnalyse=true;
      
    }
    deleteAllReportTemp(){
      this._rapportService.deleteAllReportTemp().subscribe(
        data => {},
        (error => this.errorMsg=error)
      );
    }
    
    getObservationsNature(){
      this._rapportService.getObservationsNatureTemp(this.selectedRucher).subscribe(
        data => { this.observationsNature = data;},
        err => console.error(err),
        () => console.log()
      );
    }

    getObservationsRuche(){
      this._rapportService.getObservationsRucheTemp(this.selectedRucher).subscribe(
        data => { this.observationsRuche = data;},
        err => console.error(err),
        () => console.log()
      );
    }

    getActionsApicoles(){
      this._rapportService.getActionsApicolesTemp(this.selectedRucher).subscribe(
        data => { this.actionsApicole = data;},
        err => console.error(err),
        () => console.log()
      );
    }

    getUserRuchers(){
      console.log("this username :"+  this.username);
      this.rucherService.getUserRuchers(this.username).subscribe(
        data => { this.ruchers = data;},
        err => console.error(err),
        () => console.log()
      );  
    }

    onSelectRucher(event : any) : void{
      localStorage.setItem("currentRucher",String(this.selectedRucher));
      console.log("selected rucher : "+this.selectedRucher);
      this.getActionsApicoles();
      this.getObservationsNature();
      this.getObservationsRuche();

    }


    saveRapport(){
        this._rapportService.saveNLU(this.texteRapport, this.selectedRucher).subscribe( 
          data => {
            console.log(data);
            this.resultatRapport=data;
            this.texteRapport=" ";
            this.getActionsApicoles();
            this.getObservationsNature();
            this.getObservationsRuche();
          },
          ( error => this.errorMsg=error)
      );
      alert("votre rapport a été enregistré");
      this.deleteAllReportTemp();
      this.rapportForm.reset();
    }

    getRapportTemp(){
        this._rapportService.getNluResult(this.texteRapport, this.selectedRucher).subscribe( 
          data => {
            console.log(data);
            this.resultatRapport=data;
            alert("votre rapport a été analysé ! ");
            this.getActionsApicoles();
            this.getObservationsNature();
            this.getObservationsRuche();

          },
          ( error => this.errorMsg=error)
      );
     

    }

    analyserRapport(texte){
      this.getRapportTemp();
      console.log(texte)
      this.rapportAnalyse= texte;
    }




}
