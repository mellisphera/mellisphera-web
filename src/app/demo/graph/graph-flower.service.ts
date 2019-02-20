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
        text: 'Période de floraison',
        left:'center'
      },

      //Défini la légende du graph
      grid: {
        borderWidth:1,
        left: '5%',
        right:'10%',
        width:'100%',
        bottom: 50,
        //right: 10,
        show : true,
        containLabel: true
      },
      //Le pointeur ne bouge qu'avec la souris
      tooltip: {
        trigger: 'item',
        formatter: (params)=>{
            return params.data[0]+'<br/>'+params.data[1];
        }    
      },
      legend:{
        top: 30,
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
              show: true
          },
         }
      
  
       ],
    //Défini l'axe ou les axes ordonnée(s)
      yAxis: {
        type: 'category',
        show : false,
        axisLine: {
            show: true
        },
        axisLabel : false
      },
      //Affiche les données sur le graph

}
  }
}
