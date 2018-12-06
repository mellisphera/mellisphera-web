import { Component, OnInit, Input } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FleursFloraisonService } from './service/fleurs.floraison.service';
import { FleursINRA } from "./fleursINRA";
import { FleurITSAP } from "./fleurITSAP";
import { Rucher } from '../ruche-rucher/rucher';
import { FleursTheorique } from './fleurstheorique'
import { UserloggedService } from '../../userlogged.service';
import { Observable, Subscription } from 'rxjs';
import { AnonymousSubscription } from "rxjs/Subscription";
import { selectedRucherService } from '../_shared-services/selected-rucher.service';
import { RucherService } from '../ruche-rucher/rucher.service';
import * as echarts from './../../../assets/echarts';
import { GraphiqueFloraisonService } from './service/graphique-floraison.service';


@Component({/*  */
  selector: 'app-fleurs-floraison',
  templateUrl: './fleurs.floraison.component.html',
  styleUrls: ['./fleurs.floraison.component.scss']
})

export class FleursFloraisonComponent implements OnInit {

    //variable for connected user
    username : string;
    //variable for currentRucher ID
    currentRucherID: string;
    //variable for Type 
    currentType : string
    //Variable for flomin           
    currentFlomin : string; 
    //Variable for flomax
    currentFlomax : string;
    //Variable for nom francais
    currentFr : string;
    //Variable for nom latin
    currentLt: string;
    //Variable for Présence
    currentPresence: string;
    //Variable pour la période de floraison
    currentFlo: string;
    //Variable pour les informations du rucher
    nameApiary= new Rucher();
    message="";
    //variable pour stocker le nom français entré
    selectedFr = new String;
    //Variable pour la fleur selectionnée
    //selectedFleur = new FleurObservees();
    //Variable pour la fleur qui contient les éléments de recherche
    selectedFleurTest = new FleursTheorique();
    //Variable pour la fleur apibotanica qui contient les éléments de recherche
    selectedFleurTh = new FleursINRA();
    //Variable pour la présence de la fleur changé
    selectedPresence = new String;
    //Variable pour la période de floraison
    selectedFlo : string;

    //variable to store fleurs
    fleursTest: FleursTheorique[] = [];
    //variable to store types of flowers
    types: String [] = [];
    //variable to store ruchers
    ruchers: Rucher [] = [];
    //variable to store fleurs de la bibliothèque
    //fleursBibli: FleurObservees [] = [];
    //Noms des fleurs
    names = new Array();
    x;

    //Les années à afficher
    annee = ["2018","2019","2020"];

    //Tableau des images des fleurs du rucher
    flowerIcon = new Array();

    //Tableau des données de floraisons théoriques à afficher
    dataTh = new Array();
    //Tableau des données de floraisons observés à afficher
    data2018 = new Array();
    //Tableau des données de floraisons observés de 2019
    data2019 = new Array();
    //Tableau des données de floraisons observés de 2020
    data2020 = new Array();

    public ErrorMsg;

    //Variable pour le rucher selectionné
    selectedRucher = new Rucher();
    //Variable pour le type selectionné
    selectedType = new String;
    //La date d'aujourd'hui
    date = new Date();
    //L'année en cours
    currentYear = this.date.getFullYear();
    
    
  private timerSubscription: AnonymousSubscription;

  constructor(  private formBuilder: FormBuilder,
                public location: Location,
                public router: Router,
                //public rucherService : RucherService,
                public fleursFloraisonService : FleursFloraisonService,
                public grahFleur : GraphiqueFloraisonService,
                private data : UserloggedService) {

                this.username= data.currentUser().username; 
                this.currentRucherID= localStorage.getItem("currentRucher");
                this.currentType = localStorage.getItem("currentType");
                this.currentFlomin = localStorage.getItem("currentFlomin");
                this.currentFlomax = localStorage.getItem("currentFlomax");
                this.currentPresence = localStorage.getItem("currentPresence");
                this.currentFlo = localStorage.getItem("currentFlo");
  } 

  //Au chargement de la page on execute ces fonctions
  ngOnInit(){
    console.log(this.fleursFloraisonService.rucherService.ruchersObs);
    this.x=String(this.selectedRucher);
    this.x=this.currentRucherID;
    this.selectedRucher=this.x;
    //this.getUserRuchers();
    //this.getFleurDuRucher(this.currentYear);
    //this.getAllFleurTest();
    //this.getAllType();
    this.subscribeToNames();
    if(this.selectedRucher != undefined){
      this.getNameApiary();
    }
    //this.selectedFlo = "0";
  }


  //Récupère les ruchers de l'utilisateur
  getUserRuchers(){
    /*this.rucherService.getUserRuchers(this.username).subscribe(
      data => { this.ruchers = data } );*/
  }

  //Récupère les fleurs du rucher
  /*getFleurDuRucher(annee){
    if(this.selectedRucher!=null){
      this.fleursFloraisonService.getUserFleur(this.selectedRucher).subscribe(
        data => { this.fleursBibli = data });       
    }
  }*/

  //Récupère les fleurs 
  /*getAllFleurTest(){
    this.fleursFloraisonService.getFleurTest().subscribe(
      data => { 
        this.fleursTest=data;
      }
    );
  }*/

  //Récupère les types de plantes
  /*getAllType(){
    this.fleursFloraisonService.getType().subscribe(
      data => { 
        this.types=data;
      }
    ); 
  }*/

  //On récupère les noms des plantes du rucher
  getNames(){
    //on récupère les noms des plantes
    
    /*this.fleursFloraisonService.getNamesFlowers(this.selectedRucher).subscribe(
      data => { 
        this.names=data;
      }
    );
    //on charges les dates théoriques associées
    this.subscribeToDateTh();
    //on charges les dates observées associées
    this.subscribeToDateOb(this.annee);
    //on charge le graph
    this.subscribeToGraph();*/
  }

  getNameApiary(){
    /*this.fleursFloraisonService.getNameApiary(this.selectedRucher).subscribe(
      data => { 
        this.nameApiary=data;
      }
    );*/
  }

  //On récupères les dates de flo théoriques de la plante "name"
  getOneDateTh(fleur,i){
    /*this.fleursFloraisonService.getFloraisonThFlowers(fleur).subscribe(
      data => { this.dataTh[i]=data;});*/
  }

  //On récupères les dates de flo observée de la plante "name"
  getOneDateOb(databis,fleur,i,annee){
    this.fleursFloraisonService.getFloraisonObFlowers(fleur,annee).subscribe(
      data => { databis[i]=data;});
  }

  //On récupère toutes les date de flo théoriques des fleurs du rucher
  getDatesTh(){
    this.dataTh=new Array();
    //On défini la taille du tableau des floraisons théoriques et observées
    for (let i = 0; i < this.names.length; i++) {
      this.dataTh[i]=new Array(2);
      for (let j = 0; j < 2; j++) {
        this.dataTh[i][j] = new Array(2);
      }
    }
    //On récupères les dates théoriques
    for (var i = 0; i < this.dataTh.length; i++) {
      //this.subscribeToOneDateTh(this.fleursBibli[i],i);
    }
  }

  //On récupère toutes les date de flo observées des fleurs du rucher
  getDatesOb(annee){
    this.data2018=new Array();
    this.data2019=new Array();
    //On défini la taille du tableau des floraisons théoriques et observées
    for (let i = 0; i < this.names.length; i++) {
      this.data2018[i]=new Array(2);
      this.data2019[i]=new Array(2);
      for (let j = 0; j < 2; j++) {
        this.data2018[i][j] = new Array(2);
        this.data2019[i][j] = new Array(2);
      }
    }
    for (var i = 0; i < this.data2018.length; i++) {
     // this.subscribeToOneDateOb(this.data2018,this.fleursBibli[i],i,"2018");
      
    }
    for (var i = 0; i < this.data2019.length; i++) {
      //this.subscribeToOneDateOb(this.data2019,this.fleursBibli[i],i,"2019");
    }
  }

  //Change le type selectionné
  onSelectType(event : any): void{
    this.currentType=String(this.selectedType);
    localStorage.setItem("currentType",String(this.selectedType));
  }

  //Change le rucher selectionné
  onChangeRucher(){
    this.subscribeToDataFleur();
    this.subscribeToNames();
    this.getNameApiary();
  }

  //Change le rucher selectionné
  onSelectRucher(event : any) : void{
    this.fleursFloraisonService.getUserFleur(this.fleursFloraisonService.rucherService.rucher.id);
    this.fleursFloraisonService.rucherService.getRucherDetails();
  }

  //change le nom français entré par l'utilisateur
  onSelectFr(event : any) : void{
    this.currentFr=String(this.selectedFr);
    localStorage.setItem("currentFr",String(this.selectedFr));
  }

  //
  onSelectPresence(event : any) : void{
    this.currentPresence=String(this.selectedPresence);
    localStorage.setItem("currentPresence",String(this.selectedPresence));
  }

  //
  onSelectFlo(event : any) : void{
    this.currentFlo=String(this.selectedFlo);
    localStorage.setItem("currentFlo",String(this.selectedFlo));
  }

  
  //Ajoute la fleur à un rucher
  /*addFleur(fleur){
    //on fait une copie de la fleur
    this.selectedFleur.nom = fleur.flowerApi.francais;
    this.selectedFleur.dateDebutd = fleur.flowerApi.flomind;
    this.selectedFleur.dateFind = fleur.flowerApi.flomaxd; 
    this.selectedFleur.dateThDebutd = fleur.flowerApi.flomind;
    this.selectedFleur.dateThFind = fleur.flowerApi.flomaxd; 
    this.selectedFleur.dateThDebutdate = fleur.flowerApi.flomindate;
    this.selectedFleur.dateThFindate = fleur.flowerApi.flomaxdate; 
    this.selectedFleur.presence = "";
    this.selectedFleur.username = this.username;
    this.selectedFleur.photo = fleur.photo;
    if (this.selectedRucher!=null){
      if (confirm("Ajouter plante " + this.selectedFleur.nom + " au rucher " + this.nameApiary.name +" ?")) {
        //A changer avce l'année en cours !!
        this.fleursFloraisonService.addFlower(this.selectedFleur,this.selectedRucher)
          .subscribe(data => {},
            error => this.ErrorMsg=error);
            //on recharge les fleurs du rucher
            this.subscribeToDataFleur();
            //On charge les noms des fleurs (et recharge le graphique avec les bonnes données)
            this.subscribeToNames();
      }
    }
  }*/

  //Change le début de floraison observée d'une fleur
  /*updateDebut(fleur){
    this.selectedFleur = fleur;
    this.fleursFloraisonService.updateFleurDebut(this.selectedFleur.id,this.currentYear,this.selectedFleur.dateDebutdate[this.currentYear])
      .subscribe(data => {},
      error => this.ErrorMsg=error);
    
   }*/

  //Change la fin de floraison observée d'une fleur
 /* updateFin(fleur){
    this.selectedFleur = fleur;
    this.fleursFloraisonService.updateFleurFin(this.selectedFleur.id,this.currentYear,this.selectedFleur.dateFindate[this.currentYear])
      .subscribe(data => {},
      error => this.ErrorMsg=error);
  }*/

  //Change la presence d'une fleur dans le rucher
  updatePresence(fleur){   
    /*this.selectedFleur = fleur;
      this.fleursFloraisonService.updatePresence(this.selectedFleur)
        .subscribe(data => {},
          error => this.ErrorMsg=error);*/
  }
  onEditFleur(fleur){
    this.selectedFlo = fleur.id;

  }
  saveValue(fleur){
    this.fleursFloraisonService.updateFleurFin(this.currentYear,fleur);
    this.selectedFlo = null;
  }

  /*pdateTot(fleursBib){   
    for (let i = 0; i < fleursBib.length; i++) {
      if (fleursBib[i].dateDebutdate[this.currentYear] == ""){
        fleursBib[i].dateDebutdate[this.currentYear] = "null";
      }
      if (fleursBib[i].dateFindate[this.currentYear] == ""){
        fleursBib[i].dateFindate[this.currentYear] = "null";
      }
      this.subscribeToUpFin(fleursBib[i]);
      this.subscribeToUpDeb(fleursBib[i]);
      this.subscribeToUpPre(fleursBib[i]);
    }
    //On charge les noms des fleurs (et recharge le graphique avec les bonnes données)
    this.subscribeToNames();
    this.subscribeToDataFleur();
  }*/

  //Supprime une fleur du rucher
  deleteFleur(fleur){

  }

  //Lance la recherche des fleurs qui correspondent aux critères entré par l'utilisateur
  rechercheFleurVariete(){
    //On créer un fleur type de recherche
    this.selectedFleurTh.setFrancais(this.selectedFr);
    this.selectedFleurTest.setFlowerApi(this.selectedFleurTh);
    //On envoie la requêtes
    this.fleursFloraisonService.rechercheFlowersVar(this.selectedFleurTest)
        .subscribe(
          data => { this.fleursTest = data ;
          }
        );
  }

    //Lance la recherche des fleurs qui correspondent aux critères entré par l'utilisateur
  rechercheFleurPeriode(){
    //On créer un fleur type de recherche
    this.selectedFleurTest.setType(this.selectedType);
    this.selectedFleurTh.setFlomind(this.selectedFlo);
    this.selectedFleurTest.setFlowerApi(this.selectedFleurTh);
    //On envoie la requêtes
    this.fleursFloraisonService.rechercheFlowersPer(this.selectedFleurTest)
      .subscribe(
        data => { this.fleursTest = data ;
        }
      );
  }

  //Rafraichit la page avec les fleurs qui correspondent à la recherche
  subscribeToDataRechercheVariete(): void {
    this.timerSubscription = Observable.timer(1000).first().subscribe(() => this.rechercheFleurVariete());
  }

  //Rafraichit la page avec les fleurs qui correspondent à la recherche
  subscribeToDataRecherchePeriode(): void {
    this.timerSubscription = Observable.timer(1000).first().subscribe(() => this.rechercheFleurPeriode());
  }

  //On recharge la bilbiothèque de fleurs
  private subscribeToDataFleur(): void {
    //this.timerSubscription = Observable.timer(400).first().subscribe(() => this.getFleurDuRucher(this.currentYear));
  }

  //On recharge le pourcentage totale du rucher
  private subscribeToNames(): void {
    this.timerSubscription = Observable.timer(100).first().subscribe(() => this.getNames());
  }

  //On recharge le graph du rucher
  private subscribeToGraph(): void {
   // this.timerSubscription = Observable.timer(1000).first().subscribe(() => this.graphStatique());
  }
  
  //On charge les dates théoriques pour le graph
  private subscribeToDateTh(): void {
      this.timerSubscription = Observable.timer(400).first().subscribe(() => this.getDatesTh());
  }

  //On charge les dates observées pour le graph
  private subscribeToDateOb(annee): void {
    this.timerSubscription = Observable.timer(400).first().subscribe(() => this.getDatesOb(annee));
  }

  //On charge une date théorique d'une fleur pour le graph
  private subscribeToOneDateTh(fleur,i): void {
    this.timerSubscription = Observable.timer(500).first().subscribe(() => this.getOneDateTh(fleur,i));
  }

  //On charge une date observée d'une fleur pour le graph
  private subscribeToOneDateOb(databis,name,i,annee): void {
    this.timerSubscription = Observable.timer(500).first().subscribe(() => this.getOneDateOb(databis,name,i,annee));
  }

  //
  private subscribeToUpDeb(fleur): void {
    //this.timerSubscription = Observable.timer(100).first().subscribe(() => this.updateDebut(fleur));
  }

  //
  private subscribeToUpFin(fleur): void {
    //this.timerSubscription = Observable.timer(200).first().subscribe(() => this.updateFin(fleur));
  }

  //
  private subscribeToUpPre(fleur): void {
    this.timerSubscription = Observable.timer(300).first().subscribe(() => this.updatePresence(fleur));
  }

  /*
  //Affiche les semaines de floraisons théoriques des plantes du rucher
  generateDataTh(option) {
    for (var i = 0; i < this.dataTh.length; i++) {
        option.series.push({
          name: 'Floraisons théoriques',
          type: 'line',
          color:'#509B21',
          data: this.dataTh[i],
          symbolSize: function (val) {
              return val[2] * 5;
          },
          animationDelay: function (idx) {
              return idx * 2;
          }
        });
    }
  }
  //Affiche les semaines de floraisons observées année 2018 des plantes du rucher
  generateData2018(option) {
    for (var i = 0; i < this.data2018.length; i++) {
        option.series.push({
           name: 'Floraisons observées 2018',
          type: 'scatter',
          symbol: 'arrow',
          color:'#990000',
          data: this.data2018[i],
          symbolSize: function (val) {
              return val[2] * 5;
          },
          animationDelay: function (idx) {
              return idx * 2;
          }
        });
    }
  }
  //Affiche les semaines de floraisons observées année 2019 des plantes du rucher
  generateData2019(option) {
    for (var i = 0; i < this.data2019.length; i++) {
        option.series.push({
           name: 'Floraisons observées 2019',
          type: 'scatter',
          symbol: 'arrow',
          color:'blue',
          data: this.data2019[i],
          symbolSize: function (val) {
              return val[2] * 5;
          },
          animationDelay: function (idx) {
              return idx * 2;
          }
        });
    }
  }*/

  generateDataTh(option) {
    for (var i = 0; i < this.dataTh.length; i++) {
        option.series.push({
            name: 'Floraisons théoriques',
          type: 'line',
          color:'#509B21',
          symbolSize: 12,
            data:this.dataTh[i]
        });
    }
  }
  
  generateData2018(option) {
    for (var i = 0; i < this.data2018.length; i++) {
        option.series.push({
        name: 'Floraisons observées 2018',
          type: 'scatter',
          symbol: 'arrow',
          color:'#990000',
          symbolSize: 15,
            data:this.data2018[i]
        });
    }
  }


  //graphique des fleurs du rucher
 graphStatique(){
    /*var unChart = echarts.init(document.getElementById("graph"));    

  for (let index = 0; index < this.dataTh.length; index++) {
    this.dataTh[index] = this.dataTh[index].map(function (item) {
      return [item[0], item[1]];
    });
  }


  for (let index = 0; index < this.data2018.length; index++) {
    this.data2018[index] = this.data2018[index].map(function (item) {
      return [item[0], item[1]];
    });
  }

   
    
    //Affiche les données
    this.generateDataTh(option);
    this.generateData2018(option);
    //this.generateData2019(option);

   unChart.setOption(option);*/
  }

  receiveMessage($event){
    this.message=$event;
}
}