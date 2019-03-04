import { Component, OnInit, Input} from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { RapportService } from './rapport.service';
import { Rucher } from '../apiary/ruche-rucher/rucher';
import { UserloggedService } from '../userlogged.service';
import { RucherService } from '../apiary/ruche-rucher/rucher.service';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { ProcessReport } from '../apiary/ruche-rucher/processedReport';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';


@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls : ['./rapport.component.scss']
})

export class RapportComponent implements OnInit {
  btnAnalyse: boolean;
  //variable to store ruchers
  rapportForm : FormGroup;
  resultatRapport;
  selectedRucher = new Rucher();
  //variable for connected user

  public errorMsg;

  //nomRuche;
    constructor(private formBuilder: FormBuilder,
                private http:HttpClient,
                public rapportService : RapportService,
                private data : UserloggedService,
                public rucherService : RucherService,
              ){
                this.rapportForm=formBuilder.group({
                  'texte': [null,Validators.compose([Validators.required])],
              });
    }

    ngOnInit(){
      this.btnAnalyse=true;
    }

    getAnalyseTemp() {
      const formValue = this.rapportForm.value;
      this.rapportService.getNluResult(formValue, this.rucherService.rucher.id);
    }


  message="";
    receiveMessage($event){
        this.message=$event;
    }

}