import { Injectable } from '@angular/core';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';

@Injectable({
  providedIn: 'root'
})
export class GraphiqueFloraisonService {

  currentYear = new Date().getFullYear();
  constructor(private configGraph: GraphGlobal) { 
  }
  option = {
          //Défini le titre du graphique
          title: {
            text: this.configGraph.getTitle("Blooming"),
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
