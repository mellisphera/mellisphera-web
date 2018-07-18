import { Component, OnInit, Input} from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';

import { Subscription } from 'rxjs/Rx';
import { AnonymousSubscription } from "rxjs/Subscription";
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { RapportService } from './rapport.service';

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html'
})

export class RapportComponent implements OnInit {
   
  //@Input() childMessage: string;
  texteRapport ='la ruche r2 contient 100 abeilles. la ruche R1 est très gentille. yassine va au maroc ';
  rapportAnalyse='';
  resultatRapport;
  public errorMsg;
  //nomRuche;
    constructor(private http:HttpClient,private _rapportService : RapportService){
    
        console.log("local storage ruche ID "+localStorage.getItem("clickedRuche") );
    }
    


    ngOnInit(){
      console.log(this.texteRapport);
      this.getRapport();
    }
    getRapport(){
      this._rapportService.getNluResult(this.texteRapport).subscribe( 
        data => {
          console.log(data);
          this.resultatRapport=data;
        },
        ( error => this.errorMsg=error)
     
    );
    }



    analyserRapport(texte){
    this.getRapport();
    console.log(texte)
    this.rapportAnalyse= texte;
    }




}
