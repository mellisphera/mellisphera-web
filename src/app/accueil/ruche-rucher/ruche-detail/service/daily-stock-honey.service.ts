import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../../config';
import { DailyStockHoney } from '../../../../_model/daily-stock-honey';
import { isEmpty } from 'rxjs-compat/operator/isEmpty';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DailyStockHoneyService {

  dailyStock : DailyStockHoney[];

  dailyStockObs : Observable<DailyStockHoney[]>;
  mergeOption : any = null;
  dailyStockByFlower : Object;
  typeFlower : any[];
  arrayDate : any[];

  timeLine : any[];

  /* Template pour une serie(1 type d fleur)*/
  templateSerie =  {
      name:'',
      type:'line',
      stack: '',
      itemStyle: {normal: {areaStyle: {type: 'default'}}},
      data:[''],
      showSymbol: false,
      smooth : 'true',
      label: {
        normal: {
            show: false,
            position: 'top'
        }
    },
  }
  constructor(private http : HttpClient) {

  }
  /* Requete API*/
  getDailyStockHoneyByApiary(idHive : string){
    this.dailyStock = [];
    this.dailyStockObs = this.http.get<DailyStockHoney[]>(CONFIG.URL+'/dailyStockHoney'+'/hive/'+idHive);
    this.dailyStockObs.subscribe(
      (data)=>{
        console.log(data);
        this.dailyStock = data;
        this.mergeOption = {

          legend : {
            data : [] = []
          },
          series : [] = []
        };
        this.countFlower();
        this.dailyStockByFleur();
        console.log(this.dailyStock);
        /* Mise à jour du template avec les info récupèrer */
        for(var elt in this.dailyStockByFlower){
          //console.log(this.dailyStockByFlower[elt]);
          this.templateSerie.name = elt;
          this.templateSerie.data = [];
          this.templateSerie.data = this.dailyStockByFlower[elt];
          this.mergeOption.series.push(this.templateSerie)
          this.cleanTemplate();
          console.log(this.templateSerie  )
        }
        this.mergeOption.legend.data = this.typeFlower;
        /*console.log(this.mergeOption);
        console.log(this.arrayDate);*/

      },
      (err)=>{
        console.log(err);
      }
    );
  }


  convertDate(date){
    var dateIso = new Date(date);
    console.log(dateIso);
    var jour = ''+dateIso.getDate();
    var mois = ''+(dateIso.getMonth()+1);
    var anee = dateIso.getFullYear();
    if(parseInt(jour) < 10 ){ jour = '0'+jour; }
    if(parseInt(mois) < 10 ){ mois = '0'+mois; }

    return anee + '-' +mois+'-'+ jour;
}


  cleanTemplate(){
    this.templateSerie = {
      name:'',
      type:'line',
      stack: 'fleurs',
      itemStyle: {normal: {areaStyle: {type: 'default'}}},
      data:[''],
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

  /* Trie les données obtenue par fleur */
  dailyStockByFleur(){
    this.arrayDate = [];
    this.dailyStockByFlower = [];
    this.typeFlower.forEach(element=>{
      this.dailyStockByFlower[''+element] = [];
    });
    this.dailyStock.forEach((element,index)=>{
      if(this.arrayDate.indexOf(element) == -1){
        this.arrayDate.push(element.date);
      }
      /*this.dailyStockByFlower[''+element.nom].push({name : element.date, value : [
        element.date, element.stockJ
      ]}
      
      );*/
      this.dailyStockByFlower[''+element.nom].push([element.date, Math.round(element.stockJ*100)/100]);
    })
  }
  cleanQuery(){
    this.dailyStock = [];
    this.arrayDate = [];
    this.typeFlower = [];
    this.cleanTemplate();
    this.mergeOption = [];
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
