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

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphiqueFloraisonService {

  currentYear = new Date().getFullYear();
  constructor() { 
  }
  option = {
          //Défini le titre du graphique
          title: {
            text: 'Apiary Blooming calendar',
            left:'center',
            top : 0
          },
          legend : {
            top:30
          },
          //Défini la légende du graph
          grid: {
            //top : 100,
            left: 2,
            //height : 
            //bottom: 10,
            right: 10,
            containLabel: true
          },
          toolbox: {
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'line']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
          //Le pointeur ne bouge qu'avec la souris
          tooltip: {
            trigger: 'item',
            formatter: (params)=>{
                return params.data[0]+'<br/>'+params.data[1];
            }    
          },
          //Défini l'axe ou les axes abscisse(s)
          xAxis: [
            {
              type: 'time',
              min:this.currentYear+'-01-01',
              max:this.currentYear+'-12-31',
              
              //Option pour le pointeu
              label:{

              },
              splitNumber : '11',
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
             }
          
      
           ],
        //Défini l'axe ou les axes ordonnée(s)
          yAxis: {
            type: 'category',
            show : false,
            axisLine: {
                show: false
            }
          },
          //Affiche les données sur le graph

  }
}
