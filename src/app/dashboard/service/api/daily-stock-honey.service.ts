/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MyDate } from '../../../class/MyDate';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../constants/config';
import { DailyStockHoney } from '../../../_model/daily-stock-honey';
import { isEmpty } from 'rxjs-compat/operator/isEmpty';
import { IfStmt } from '@angular/compiler';
import { NgxEchartsModule } from 'ngx-echarts';
import { graphic, registerMap } from 'echarts';
import { RucheService } from './ruche.service';
import { UnitService } from '../unit.service';


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
  currenthiveId: string;
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
    this.currenthiveId = null;
    //this.getDailyStockHoneyByHive(this.rucheService.getCurrentHive().id);
  }

  setUnitSystem(unit: string): void {
    this.unitSystem = unit;
  }

  getDailyStockHoneyByHIve(hiveId: string) {
    this.typeFlower = [];
    return this.http.get<DailyStockHoney[]>(CONFIG.URL + 'dailyStockHoney' + '/hive/' + hiveId).map(dailyStock => {
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
