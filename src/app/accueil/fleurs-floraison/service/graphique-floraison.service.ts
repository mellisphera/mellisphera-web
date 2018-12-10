import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphiqueFloraisonService {

  currentYear = new Date().getFullYear();
  constructor() { 
    console.log(this.option);
  }
  option = {
          //Défini le titre du graphique
          title: {
            text: 'Fleurs du rucher',
          },
    
          //Défini la légende du graph
          grid: {
            left: 2,
            bottom: 10,
            right: 10,
            containLabel: true
          },
          //Le pointeur ne bouge qu'avec la souris
          tooltip: {
            trigger: 'item',
            formatter: (params)=>{
                return params.data[0]+'<br/>'+params.seriesName+ ' : '+params.data[1];
            }    
          },
          //Défini l'axe ou les axes abscisse(s)
          xAxis: [
            {
              type: 'time',
              min:this.currentYear+'-01-01',
              max:this.currentYear+'-12-31',
              
              //Option pour le pointeu
    
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
                rotate: 40
              }
             }
          
      
           ],
        //Défini l'axe ou les axes ordonnée(s)
          yAxis: {
            type: 'category',
            axisLine: {
                show: false
            }
          },
          //Affiche les données sur le graph

  }
}
