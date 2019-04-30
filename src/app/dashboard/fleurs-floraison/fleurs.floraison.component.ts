import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FleursFloraisonService } from './service/fleurs.floraison.service';
import { FleursINRA } from "../../_model/fleursINRA";
import { FleurITSAP } from "../../_model/fleurITSAP";
import { Rucher } from '../../dashboard/apiary/ruche-rucher/rucher';
import { FleursTheorique } from '../../_model/fleurstheorique'
import { UserloggedService } from '../../userlogged.service';
import { Observable, Subscription } from 'rxjs';
import { AnonymousSubscription } from "rxjs/Subscription";
import { RucherService } from '../service/rucher.service';
import * as echarts from '../../../assets/echarts';
import { GraphiqueFloraisonService } from './service/graphique-floraison.service';


@Component({/*  */
  selector: 'app-fleurs-floraison',
  templateUrl: './fleurs.floraison.component.html',
  styleUrls: ['./fleurs.floraison.component.scss']
})

export class FleursFloraisonComponent implements OnInit, OnDestroy {

    //variable for connected user
    username : string;

    currentFlo: string;
    //Variable pour les informations du rucher
    nameApiary= new Rucher();
    message="";
    //variable pour stocker le nom français entré
    selectedFr : string;
    selectedType : String;
    currentMonth : number;
    currentMonthStr : string[];
    selectedFlo : string;

    //variable to store fleurs
    fleursTest: FleursTheorique[] = [];
    public ErrorMsg;

    //Variable pour le rucher selectionné
    selectedRucher = new Rucher();
    //Variable pour le type selectionné
    //La date d'aujourd'hui
    date = new Date();
    //L'année en cours
    currentYear = this.date.getFullYear();
  constructor(  private formBuilder: FormBuilder,
                public location: Location,
                public router: Router,
                //public rucherService : RucherService,
                public fleursFloraisonService : FleursFloraisonService,
                public grahFleur : GraphiqueFloraisonService,
                private data : UserloggedService,
                private rucherService: RucherService) {

                this.username= data.currentUser().username; 
                this.selectedType = '';
                this.currentMonth = 0;
                //this.currentMonthStr = ['','Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'];
                this.currentMonthStr = ['','January','February','March','April','May','June','July','August','September','October','November','December'];
              } 

  //Au chargement de la page on execute ces fonctions
  ngOnInit(){
    if (!this.fleursFloraisonService.subjectFlower.closed) {
        this.rucherService.rucherSubject.subscribe(() => {}, () => {},
          () => {
              this.fleursFloraisonService.getUserFleur(this.rucherService.rucher.id);
          }
        );
    }

  }

  //On récupères les dates de flo observée de la plante "name"
  getOneDateOb(databis,fleur,i,annee){
    this.fleursFloraisonService.getFloraisonObFlowers(fleur,annee).subscribe(
      data => { databis[i]=data;});
  }


  //Change le rucher selectionné
  onSelectRucher(){
    this.fleursFloraisonService.fleursByRucher = null;
    this.fleursFloraisonService.mergeOption = null;
    this.fleursFloraisonService.getUserFleur(this.fleursFloraisonService.rucherService.rucher.id);
    //this.fleursFloraisonService.rucherService.getRucherDetails();
  }

  onEditFleur(fleur) {
    this.selectedFlo = fleur.id;

  }
  saveValue(fleur) {
    this.fleursFloraisonService.updateFleurFin(this.currentYear,fleur);
    this.selectedFlo = null;
  }


  receiveMessage($event) {
    this.message = $event;
  }
  ngOnDestroy() {
/*     this.fleursFloraisonService.subjectFlower.unsubscribe();
    this.rucherService.rucherSubject.unsubscribe(); */
  }
}