import { Component, OnInit, Input } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FleursFloraisonService } from './fleurs.floraison.service';
import { FleurTheoriques } from "./fleurstheoriques";
import { FleurITSAP } from "./fleurITSAP";
import { Fleur } from './fleur'
import { Rucher } from '../ruche-rucher/rucher';
import { FleursTest } from './fleurstest'
import { UserloggedService } from '../../userlogged.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { AnonymousSubscription } from "rxjs/Subscription";
import { selectedRucherService } from '../_shared-services/selected-rucher.service';
import { RucherService } from '../ruche-rucher/rucher.service';
import * as echarts from '../../../assets/echarts.js';


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
    //
    currentFlo: string;
    //Variable pour le nom du rucher
    nameApiary: any[] = [];
    
    //variable pour stocker le nom français entré
    selectedFr = new String;
    //Variable pour la fleur selectionnée
    selectedFleur = new Fleur();
    //Variable pour la fleur qui contient les éléments de recherche
    selectedFleurTest = new FleursTest();
    //Variable pour la fleur apibotanica qui contient les éléments de recherche
    selectedFleurTh = new FleurTheoriques();
    //Variable pour la présence de la fleur changé
    selectedPresence = new String;
    //Variable pour la période de floraison
    selectedFlo : string;

    //variable to store fleurs
    fleursTest: any [] = [];
    //variable to store types of flowers
    types: any [] = [];
    //variable to store ruchers
    ruchers: any [] = [];
    //variable to store fleurs de la bibliothèque
    fleursBibli: any [] = [];
    //Noms des fleurs
    names: any[] = [];

    x;

    //Les années à afficher
    annee = ["2018","2019","2020"];
    //Mois de l'année
    mois = ['janv', 'fev', 'mars','avril','mai','juin','juil','aout','sept','oct','nov','dec'];
    //Semaine de l'année
    /*
    weeks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11','12','13', '14', '15', '16', '17', '18','19', '20', 
    '21', '22', '23', '24' , '25', '26', '27', '28', '29', '30', 
    '31', '32', '33', '34', '35' ,'36' ,'37' , '38' , '39', '40',
    '41' ,'42', '43', '44', '45' ,'46' ,'47' , '48' , '49', '50',
    '51', '52' ];*/

    weeks = ['1 janv', '8 janv', '15 janv', '22 janv', '29 janv', '5 fev', '12 fev', '19 fev', '26 fev', '5 mars',
    '12 mars','19 mars','26 mars', '2 avr', '9 avr', '16 avr', '23 avr', '30 avr','7 mai', '14 mai', 
    '21 mai', '28 mai', '4 juin', '11 juin' , '18 juin', '25 juin', '2 juil', '9 juil', '23 juil', '30 juil', 
    '6 aout', '13 aout', '20 aout', '27 aout', '3 sept' ,'10 sept' ,'17 sept' , '24 sept' , '1 oct', '8 oct',
    '15 oct' ,'22 oct', '29 oct', '5 nov', '12 nov' ,'19 nov' ,'26 nov' , '3 dec' , '10 dec', '17 dec',
    '24 dec', '31 dec' ];

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
                public rucherService : RucherService,
                public fleursFloraisonService : FleursFloraisonService,
                private data : UserloggedService) {

                this.username= data.currentUser().username; 
                this.currentRucherID= localStorage.getItem("currentRucher");
                this.currentType = localStorage.getItem("currentType");
                this.currentFlomin = localStorage.getItem("currentFlomin");
                this.currentFlomax = localStorage.getItem("currentFlomax");
                this.currentPresence = localStorage.getItem("currentPresence");
                this.currentFlo = localStorage.getItem("currentFlo");
                console.log("logged user rucher/ruches : "+ this.username);  
  } 

  //Au chargement de la page on execute ces fonctions
  ngOnInit(){
    console.log("init current rucher : " + String(this.selectedRucher));
    this.x=String(this.selectedRucher);
    this.x=this.currentRucherID;
    this.selectedRucher=this.x;
    console.log("logged user rucher/ruches : "+ this.username);
    this.getUserRuchers();
    this.getFleurDuRucher(this.currentYear);
    this.getAllFleurTest();
    this.getAllType();
    this.subscribeToNames();
    console.log("this.selectedRucher :"+  this.selectedRucher);
    if(this.selectedRucher != undefined){
      this.getNameApiary();
    }
  }


  //Récupère les ruchers de l'utilisateur
  getUserRuchers(){
    console.log("this username :"+  this.username);
    this.rucherService.getUserRuchers(this.username).subscribe(
      data => { this.ruchers = data } );
  }

  //Récupère les fleurs du rucher
  getFleurDuRucher(annee){
    console.log("this username :"+  this.username);
    console.log("this.selectedRucher :"+  this.selectedRucher);
    if(this.selectedRucher!=null){
      this.fleursFloraisonService.getUserFleur(this.username,this.selectedRucher,annee).subscribe(
        data => { this.fleursBibli = data });  
    }
  }

  //Récupère les fleurs 
  getAllFleurTest(){
    console.log("this username :"+  this.username);
    this.fleursFloraisonService.getFleurTest().subscribe(
      data => { 
        this.fleursTest=data;
      }
    );
    //On charge les images des indices pol, conf et nec des plantes
    this.subscribeToImage();
  }

  //Récupère les types de plantes
  getAllType(){
    console.log("this username :"+  this.username);
    this.fleursFloraisonService.getType().subscribe(
      data => { 
        this.types=data;
      }
    ); 
  }

  //On récupère les noms des plantes du rucher
  getNames(){
    //on récupère les noms des plantes
    this.fleursFloraisonService.getNamesFlowers(this.username,this.selectedRucher).subscribe(
      data => { 
        this.names=data;
      }
    );
    //on charges les dates théoriques associées
    this.subscribeToDateTh();
    //on charges les dates observées associées
    this.subscribeToDateOb(this.annee);
    //on charge le graph
    this.subscribeToGraph();
  }

  getNameApiary(){
    this.fleursFloraisonService.getNameApiary(this.selectedRucher).subscribe(
      data => { 
        this.nameApiary=data;
      }
    );
  }

  //On récupères les dates de flo théoriques de la plante "name"
  getOneDateTh(name,i){
    this.fleursFloraisonService.getFloraisonThFlowers(this.username,this.selectedRucher,name).subscribe(
      data => { this.dataTh[i]=data;});
  }

  //On récupères les dates de flo observée de la plante "name"
  getOneDateOb(databis,name,i,annee){
    this.fleursFloraisonService.getFloraisonObFlowers(this.username,this.selectedRucher,name,annee).subscribe(
      data => { databis[i]=data;});
  }

  //On récupère toutes les date de flo théoriques des fleurs du rucher
  getDatesTh(){
    //On défini la taille du tableau des floraisons théoriques et observées
    for (let i = 0; i < this.names.length; i++) {
      this.dataTh[i]=new Array(2);
      this.data2018[i]=new Array(2);
      this.data2019[i]=new Array(2);
      for (let j = 0; j < 2; j++) {
        this.dataTh[i][j] = new Array(2);
        this.data2018[i][j] = new Array(2);
        this.data2019[i][j] = new Array(2);
      }
    }
    //On récupères les dates théoriques
    for (var i = 0; i < this.dataTh.length; i++) {
        this.subscribeToOneDateTh(this.names[i],i);
    }
      
  }

  //On récupère toutes les date de flo observées des fleurs du rucher
  getDatesOb(annee){
    for (var i = 0; i < this.data2018.length; i++) {
      this.subscribeToOneDateOb(this.data2018,this.names[i],i,"2018");
    }
   for (var i = 0; i < this.data2019.length; i++) {
    this.subscribeToOneDateOb(this.data2019,this.names[i],i,"2019");
    }
  }

  //Change le type selectionné
  onSelectType(event : any): void{
    this.currentType=String(this.selectedType);
    localStorage.setItem("currentType",String(this.selectedType));
  }

  //Change le rucher selectionné
  onSelectRucher(event : any) : void{;
    this.currentRucherID=String(this.selectedRucher);
    localStorage.setItem("currentRucher",String(this.selectedRucher));
    console.log("current rucher : "+this.currentRucherID);
    this.subscribeToDataFleur();
    this.getNames();
    this.getNameApiary()
;  }

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

  //change le nom français entré par l'utilisateur
  onSelectFlo(event : any) : void{
    this.currentFlo=String(this.selectedFlo);
    localStorage.setItem("currentFlo",String(this.selectedFlo));
    console.log("currentFlo : "+this.currentFlo);
  }

  
  //Ajoute la fleur à un rucher
  addFleur(fleur){
    //on fait une copie de la fleur
    this.selectedFleur.nom = fleur.flowerApi.francais;
    this.selectedFleur.dateDebut = fleur.flowerApi.flomin;
    this.selectedFleur.dateFin = fleur.flowerApi.flomax;
    this.selectedFleur.dateDebutd = fleur.flowerApi.flomind;
    this.selectedFleur.dateFind = fleur.flowerApi.flomaxd;
    this.selectedFleur.dateThDebut = fleur.flowerApi.flomin;
    this.selectedFleur.dateThFin = fleur.flowerApi.flomax;  
    this.selectedFleur.dateThDebutd = fleur.flowerApi.flomind;
    this.selectedFleur.dateThFind = fleur.flowerApi.flomaxd; 
    this.selectedFleur.dateThDebutdate = fleur.flowerApi.flomindate;
    this.selectedFleur.dateThFindate = fleur.flowerApi.flomaxdate; 
    this.selectedFleur.presence = "";
    this.selectedFleur.username = this.username;
    this.selectedFleur.photo = fleur.photo;
    if (this.selectedRucher!=null){
      if (confirm("Are you sure you want to add " + this.selectedFleur.nom + " to rucher" +" ?")) {
        //A changer avce l'année en cours !!
        this.fleursFloraisonService.addFlower(this.selectedFleur,this.selectedRucher,this.currentYear)
          .subscribe(data => {},
            error => this.ErrorMsg=error);
            //on recharge les fleurs du rucher
            this.subscribeToDataFleur();
            //On charge les noms des fleurs (et recharge le graphique avec les bonnes données)
            this.subscribeToNames();
      }
    }
  }

  //Change le début de floraison observée d'une fleur
  updateDebut(fleur){
    this.selectedFleur = fleur;
    this.fleursFloraisonService.updateFleurDebut(this.selectedFleur.id,this.currentYear,this.selectedFleur.dateDebutd[this.currentYear])
      .subscribe(data => {},
      error => this.ErrorMsg=error);
    
   }

  //Change la fin de floraison observée d'une fleur
  updateFin(fleur){
    this.selectedFleur = fleur;
    this.fleursFloraisonService.updateFleurFin(this.selectedFleur.id,this.currentYear,this.selectedFleur.dateFind[this.currentYear])
      .subscribe(data => {},
      error => this.ErrorMsg=error);
  }

  //Change la presence d'une fleur dans le rucher
  updatePresence(fleur){   
    this.selectedFleur = fleur;
      this.fleursFloraisonService.updatePresence(this.selectedFleur)
        .subscribe(data => {},
          error => this.ErrorMsg=error);
  }

  updateTot(fleursBib){   
    for (let i = 0; i < fleursBib.length; i++) {
      this.subscribeToUpDeb(fleursBib[i]);
      this.subscribeToUpFin(fleursBib[i]);  
      this.subscribeToUpPre(fleursBib[i]);
    }
    //On charge les noms des fleurs (et recharge le graphique avec les bonnes données)
    this.subscribeToNames();
    this.subscribeToDataFleur();
  }

  //Supprime une fleur du rucher
  deleteFleur(fleur){
    this.selectedFleur = fleur;
    if (confirm("Are you sure you want to delete " + this.selectedFleur.nom + "?")) {
      this.fleursFloraisonService.deleteFleur(this.selectedFleur)
        .subscribe(data => {},
            error => this.ErrorMsg=error);
      //On recharge la page avec les fleurs du rucher restantes      
      this.subscribeToDataFleur();
      //On charge les noms des fleurs (et recharge le graphique avec les bonnes données)
      this.subscribeToNames();
    }
  }

  //Lance la recherche des fleurs qui correspondent aux critères entré par l'utilisateur
  rechercheFleurVariete(){
    //On créer un fleur type de recherche
    this.selectedFleurTh.francais = this.selectedFr;
    this.selectedFleurTest.flowerApi = this.selectedFleurTh;
    //On envoie la requêtes
    this.fleursFloraisonService.rechercheFlowersVar(this.selectedFleurTest)
        .subscribe(
          data => { this.fleursTest = data ;
          }
        );
        //On charge les images associées
        this.subscribeToImage();
  }

    //Lance la recherche des fleurs qui correspondent aux critères entré par l'utilisateur
    rechercheFleurPeriode(){
      //On créer un fleur type de recherche
      this.selectedFleurTest.type = this.selectedType;
      console.log("this.selectedFlo : "+this.selectedFlo);
      this.selectedFleurTh.flomind = this.selectedFlo
      this.selectedFleurTest.flowerApi = this.selectedFleurTh;
      //On envoie la requêtes
      this.fleursFloraisonService.rechercheFlowersPer(this.selectedFleurTest)
          .subscribe(
            data => { this.fleursTest = data ;
            }
          );
          //On charge les images associées
          this.subscribeToImage();
    }

  //Rafraichit la page avec les fleurs qui correspondent à la recherche
  private subscribeToDataRechercheVariete(): void {
    this.timerSubscription = Observable.timer(1000).first().subscribe(() => this.rechercheFleurVariete());
  }

  //Rafraichit la page avec les fleurs qui correspondent à la recherche
  private subscribeToDataRecherchePeriode(): void {
    this.timerSubscription = Observable.timer(1000).first().subscribe(() => this.rechercheFleurPeriode());
  }

  //On recharge la bilbiothèque de fleurs
  private subscribeToDataFleur(): void {
    this.timerSubscription = Observable.timer(1000).first().subscribe(() => this.getFleurDuRucher(this.currentYear));
  }

  //On recharge le pourcentage totale du rucher
  private subscribeToImage(): void {
    this.timerSubscription = Observable.timer(1000).first().subscribe(() => this.changeImage());
  }

  //On recharge le pourcentage totale du rucher
  private subscribeToNames(): void {
    this.timerSubscription = Observable.timer(100).first().subscribe(() => this.getNames());
  }

  //On recharge le graph du rucher
  private subscribeToGraph(): void {
    this.timerSubscription = Observable.timer(1000).first().subscribe(() => this.graphStatique());
  }
  
  //On charge les dates théoriques pour le graph
  private subscribeToDateTh(): void {
      this.timerSubscription = Observable.timer(500).first().subscribe(() => this.getDatesTh());
  }

  //On charge les dates observées pour le graph
  private subscribeToDateOb(annee): void {
    this.timerSubscription = Observable.timer(500).first().subscribe(() => this.getDatesOb(annee));
}

  //On charge une date théorique d'une fleur pour le graph
  private subscribeToOneDateTh(name,i): void {
    this.timerSubscription = Observable.timer(300).first().subscribe(() => this.getOneDateTh(name,i));
  }

  //On charge une date observée d'une fleur pour le graph
  private subscribeToOneDateOb(databis,name,i,annee): void {
    this.timerSubscription = Observable.timer(300).first().subscribe(() => this.getOneDateOb(databis,name,i,annee));
  }

  //
  private subscribeToUpDeb(fleur): void {
    this.timerSubscription = Observable.timer(200).first().subscribe(() => this.updateDebut(fleur));
  }

  //
  private subscribeToUpFin(fleur): void {
    this.timerSubscription = Observable.timer(300).first().subscribe(() => this.updateFin(fleur));
  }

  //
  private subscribeToUpPre(fleur): void {
    this.timerSubscription = Observable.timer(400).first().subscribe(() => this.updatePresence(fleur));
  }

  //Charge le chemin des images en fonctions de la valeur de l'interet pollen/nectar et indice de confiance (entre 0 et 3)
  changeImage(){
    var i;
    var max = this.fleursTest.length;
    for (i = 0; i < max; i++) {
      //Pictogramme de l'interêt pollen
      if (this.fleursTest[i].flowerItsap.interet_pollen == "1"){
        this.fleursTest[i].flowerItsap.interet_pollen = "/assets/img/pol1.png";
      } else if (this.fleursTest[i].flowerItsap.interet_pollen == "2") {
        this.fleursTest[i].flowerItsap.interet_pollen = "/assets/img/pol2.png";
      } else if (this.fleursTest[i].flowerItsap.interet_pollen == "3"){
        this.fleursTest[i].flowerItsap.interet_pollen = "/assets/img/pol3.png";
      } else if (this.fleursTest[i].flowerItsap.interet_pollen == "0") {
        this.fleursTest[i].flowerItsap.interet_pollen = "/assets/img/vide.png";
      }
      //Pictogramme de l'interêt nectar
      if (this.fleursTest[i].flowerItsap.interet_nectar == "1"){
        this.fleursTest[i].flowerItsap.interet_nectar = "/assets/img/nec1.png";
      } else if (this.fleursTest[i].flowerItsap.interet_nectar == "2") {
        this.fleursTest[i].flowerItsap.interet_nectar = "/assets/img/nec2.png";
      } else if (this.fleursTest[i].flowerItsap.interet_nectar == "3"){
        this.fleursTest[i].flowerItsap.interet_nectar = "/assets/img/nec3.png";
      } else if (this.fleursTest[i].flowerItsap.interet_nectar == "0"){
        this.fleursTest[i].flowerItsap.interet_pollen = "/assets/img/vide.png";
      }
      //Pictogramme de l'indice de confiance
      if (this.fleursTest[i].flowerItsap.indice_confiance == "1"){
        this.fleursTest[i].flowerItsap.indice_confiance = "/assets/img/conf1.png";
      } else if (this.fleursTest[i].flowerItsap.indice_confiance == "2") {
        this.fleursTest[i].flowerItsap.indice_confiance = "/assets/img/conf2.png";
      } else if (this.fleursTest[i].flowerItsap.indice_confiance == "3"){
        this.fleursTest[i].flowerItsap.indice_confiance = "/assets/img/conf3.png";
      } else if (this.fleursTest[i].flowerItsap.indice_confiance == "0") {
        this.fleursTest[i].flowerItsap.interet_pollen = "/assets/img/vide.png";
      }
      
    }
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
    var unChart = echarts.init(document.getElementById("graph"));    
   /* 
    for (let index = 0; index < this.dataTh.length; index++) {
      this.dataTh[index] = this.dataTh[index].map(function (item) {
        return [item[1], item[0], item[2]];
        });
    }

    for (let index = 0; index < this.data2018.length; index++) {
      this.data2018[index] = this.data2018[index].map(function (item) {
        return [item[1], item[0], item[2]];
        });
    }

    for (let index = 0; index < this.data2019.length; index++) {
      this.data2019[index] = this.data2019[index].map(function (item) {
        return [item[1], item[0], item[2]];
        });
    }
*/

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

    var option = {
      //Défini le titre du graphique
      title: {
        text: 'Fleurs du rucher',
      },

      //Défini la légende du graph
      legend: {
        data: ['Floraisons théoriques','Floraisons observées 2018','Floraisons observées 2019','Floraisons observées 2020'],
        left: 'right',
      },

      grid: {
        left: 2,
        bottom: 10,
        right: 10,
        containLabel: true
      },
      //Le pointeur ne bouge qu'avec la souris
      tooltip: {
        triggerOn: 'none',
      },
      //Défini l'axe ou les axes abscisse(s)
      xAxis: [
        {
          type: 'time',
          min:this.currentYear+'-01-01',
          max:this.currentYear+'-12-31',
          
          //Option pour le pointeur
          axisPointer: {
            value: this.date,
            lineStyle: {
                color: '#004E52',
                opacity: 0.5,
                width: 2
            },
            label: {
                show: true,
                backgroundColor: '#004E52'
            },
            handle: {
                show: true,
                color: '#004E52'
            }
          },

          splitLine: {
              show: true,
              lineStyle: {
                  color: '#999',
                  type: 'dotted'
              }
          },

          axisLine: {
              show: false
          },

          axisLabel: {
            rotate: 50
          }
         }
      
  
       ],
    //Défini l'axe ou les axes ordonnée(s)
      yAxis: {
        type: 'category',
        data: this.names,
        axisLine: {
            show: false
        }
      },
      //Affiche les données sur le graph
      series: [
        //Floraisons théoriques
        {
          name: 'Floraisons théoriques',
          type: 'line',
          color:'#509B21',
          symbolSize: 12
        },
        //Floraisons observées 2018
        {
          name: 'Floraisons observées 2018',
          type: 'scatter',
          symbol: 'arrow',
          color:'#990000',
          symbolSize: 15
        },
        //Floraisons observées 2019
        {
          name: 'Floraisons observées 2019',
          type: 'scatter',
          symbol: 'arrow',
          color:'blue',
          symbolSize: 15
       },
       //Floraisons observées 2020
       {
        name: 'Floraisons observées 2020',
        type: 'scatter',
        symbol: 'arrow',
        color:'yellow',
        symbolSize: 15
     }
    ]
    };
          

    //Affiche les données
    this.generateDataTh(option);
    this.generateData2018(option);
    //this.generateData2019(option);

   unChart.setOption(option);
  
  }






}