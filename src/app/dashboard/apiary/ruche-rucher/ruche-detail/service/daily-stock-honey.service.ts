import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MyDate } from '../../../../../class/MyDate';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../../../config';
import { DailyStockHoney } from '../../../../../_model/daily-stock-honey';
import { isEmpty } from 'rxjs-compat/operator/isEmpty';
import { IfStmt } from '@angular/compiler';
import { NgxEchartsModule } from 'ngx-echarts';
import { graphic, registerMap } from 'echarts';
import { RucheService } from '../../../../service/ruche.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DailyStockHoneyService {

  dailyStock : DailyStockHoney[];

  dailyStockObs: Observable<DailyStockHoney[]>;
  dailySubject: BehaviorSubject<DailyStockHoney[]>;
  mergeOption: any = null;

  dailyStockByFlower: Array<any>;
  typeFlower: any[];
  arrayDate: any[];
  loading: boolean;
  timeLine: any[];
  currentIdHive: string;
  loadingOpts  = {
    text: 'Loading',
    color: '#00bdfc',
    textColor: '#ff0000',
    maskColor: 'rgba(255, 255, 255, 0.6)',
    zlevel: 0
  };

  /* Template pour une serie(1 type d fleur)*/
  templateSerie  : any;
  constructor(private http : HttpClient,public rucheService : RucheService) {
    this.cleanTemplate();
    this.cleanMerge();
    this.dailyStock = [];
    this.dailyStockByFlower = [];
    this.typeFlower = [];
    this.currentIdHive = null;
    //this.getDailyStockHoneyByHive(this.rucheService.getCurrentHive());
  }

  getDailyStockHoneyByHIve(idHive: string) {
    this.typeFlower = [];
    return this.http.get<DailyStockHoney[]>(CONFIG.URL + 'dailyStockHoney' + '/hive/' + idHive).map(dailyStock => {
      const series = [];
      dailyStock.forEach(element => {
        if (this.typeFlower.indexOf(element.nom) === -1) {
          this.typeFlower.push(element.nom);
          this.dailyStockByFlower['' + element.nom] = dailyStock.filter(stock => stock.nom === element.nom).map(stock => {
            return {name : stock.date, value : [stock.date, stock.stockJ]};
          });
          this.templateSerie.name = element.nom;
          this.templateSerie.data = this.dailyStockByFlower['' + element.nom];
          series.push(this.templateSerie);
          this.cleanTemplate();
        }
      });

      return {
        series : series,
        legend: {
          data: this.typeFlower
        }
      };
    });
  }
  convertDate(date){
    var dateIso = new Date(date);
    var jour = ''+dateIso.getDate();
    var mois = ''+(dateIso.getMonth()+1);
    var anee = dateIso.getFullYear();
    if(parseInt(jour) < 10 ){ jour = '0'+jour; }
    if(parseInt(mois) < 10 ){ mois = '0'+mois; }

    return anee + '-' +mois+'-'+ jour;
}


  cleanTemplate(){
    this.templateSerie = {
      name: '',
      show: true,
      type: 'line',
      stack: 'fleurs',
      itemStyle: {normal: {areaStyle: {type: 'default'}}},
      data: [],
      showSymbol: false,
      smooth : 'true',
      label: {
        normal: {
            show: false,
            position: 'top'
        }
    },
    };
  }

  cleanMerge() {
    this.mergeOption = {
      /*xAxis: [{
        min:'',
        max:''
      }],*/
      legend : {
        data : []
      },
      series : []
    };
  }



  /* Trie les données obtenue par fleur */
  dailyStockByFleur(){
    this.arrayDate = [];
    this.dailyStockByFlower = [];
    this.typeFlower.forEach(element=>{
      this.dailyStockByFlower[''+element] = [];
    });
    this.dailyStock.forEach((element,index)=>{
      if(this.arrayDate.indexOf(element) == -1){
        this.arrayDate.push(new Date(element.date));
      }
    })
    this.dailyStock.forEach((element,index)=>{
      if(this.arrayDate.indexOf(element.date) == -1){
        this.arrayDate.push(element.date);
      }
      this.dailyStockByFlower[''+element.nom].push({name : element.date, value : [
        element.date, element.stockJ
      ]}
      );
    })
    /*for(var elt in this.dailyStockByFlower){
      this.arrayDate.forEach(element=>{
        this.dailyStockByFlower[elt].push({name : element});
      });
    }*/
    
   /* this.dailyStock.forEach(elt=>{// Parcour le tableau total
      for(var element in this.dailyStockByFlower){// Pour chaque serie de fleur(element nom d'une fleur donc une serie est un tableau)
        this.dailyStockByFlower[element].forEach(obj=>{// je parcour ce tableau
          if(element == elt.nom){//index de l'objet
            if(obj.name.getDate() == new Date(elt.date).getDate() && obj.name.getMonth() == new Date(elt.date).getMonth()){
              obj['value'] = [elt.date, elt.stockJ]
            }
          }
        });
      }
    })*/
  }
  cleanQuery(){
    this.dailyStock = [];
    this.arrayDate = [];
    this.typeFlower = [];
    this.cleanTemplate();
   // this.mergeOption = [];
  }

  /* Recupère tout les types de fleurs de la requete */
  countFlower(){
    this.typeFlower = [];
    let fleur = null;
    this.dailyStock.forEach((element,index)=>{
      if(this.typeFlower.indexOf(element.nom)==-1){
        this.typeFlower.push(element.nom);
      }
    });
  }
}


/*    if(this.dailyStock.length > 1){
      this.countFlower();
      this.dailyStockByFleur();
      for(var elt in this.dailyStockByFlower){
        this.templateSerie.name = elt;
        this.templateSerie.data = [];
        this.templateSerie.data = this.dailyStockByFlower[elt];
        this.mergeOption.series.push(this.templateSerie)
        this.cleanTemplate();
        console.log(this.templateSerie)
      }
      this.mergeOption.legend.data = this.typeFlower;
    }
    else{
      console.log("clean");
      this.dailyStock = new Array();
      this.cleanTemplate();
      this.cleanMerge();
      console.log(this.templateSerie);
      console.log(this.mergeOption);
    }
    this.countFlower();
    this.dailyStockByFleur();*/