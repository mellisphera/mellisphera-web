import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MyDate } from '../../../../../class/MyDate';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../../../constants/config';
import { DailyStockHoney } from '../../../../../_model/daily-stock-honey';
import { isEmpty } from 'rxjs-compat/operator/isEmpty';
import { IfStmt } from '@angular/compiler';
import { NgxEchartsModule } from 'ngx-echarts';
import { graphic, registerMap } from 'echarts';
import { RucheService } from '../../../../service/ruche.service';
import { UnitService } from '../../../../service/unit.service';


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
  private unitSystem: string;
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
  constructor(private http : HttpClient,public rucheService : RucheService, private unitService: UnitService) {
    this.cleanTemplate();
    this.cleanMerge();
    this.dailyStock = [];
    this.dailyStockByFlower = [];
    this.typeFlower = [];
    this.currentIdHive = null;
    //this.getDailyStockHoneyByHive(this.rucheService.getCurrentHive());
  }

  setUnitSystem(unit: string): void {
    this.unitSystem = unit;
  }

  getDailyStockHoneyByHIve(idHive: string) {
    this.typeFlower = [];
    return this.http.get<DailyStockHoney[]>(CONFIG.URL + 'dailyStockHoney' + '/hive/' + idHive).map(dailyStock => {
      const series = [];
      dailyStock.forEach(element => {
        if (this.typeFlower.indexOf(element.nom) === -1) {
          this.typeFlower.push(element.nom);
          this.dailyStockByFlower['' + element.nom] = dailyStock.filter(stock => stock.nom === element.nom).map(stock => {
            return {name : stock.date, value : [stock.date, this.unitService.convertWeightFromuserPref(stock.stockJ, this.unitSystem)]};
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

}
