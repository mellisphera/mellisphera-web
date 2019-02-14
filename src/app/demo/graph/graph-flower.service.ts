import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphFlowerService {

  currentYear: number;

  option: any;
  constructor() {
    this.currentYear = new Date().getFullYear();
    this.option = {
      //Défini le titre du graphique
      title: {
        text: '',
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
}
