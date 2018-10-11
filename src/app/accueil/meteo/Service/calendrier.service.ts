import { Injectable } from '@angular/core';
import { MeteoService } from './MeteoService';

@Injectable({
  providedIn: 'root'
})
export class CalendrierService {




  constructor() { 
  }

  couleur : string ='rgba(123,123,123,0.3)';
  options={ // initialisateur d'objet
     /* Proprieté */
     /*title:{
         bottom:"20",
         text : 'Calendrier'
     },*/

     tooltip:{ // Active info bulle au survol de la souris
        trigger: 'item',
        formatter : (params)=>{
            return params.data[0]+' :<br/> temp-min : '+params.data[2]+' °C<br/> temp-max : '+params.data[3]+' °C';
        }
     }, 
     calendar:{
         cellSize : 80, // taille cellule
         orient : 'vertical', // orientation calendrier
         splitLine: { // style bordure
             show: true,
             lineStyle: {
                 width:3,
                 opacity:1,
             }
         },
         itemStyle: { // style calendrier
             normal: {
                 color: this.couleur,
                 borderWidth: 1,
                 borderColor: 'white'
             }
         },
         dayLabel:{ // Affiche le nom des jour
             nameMap:'fr', // langue francais
             firstDay: 1
             // firstDay
         },
         yearLabel:{ // Affiche l'année
             show:false // desactiver
         }
     },
     range:this.decomposeDate(new Date())

 };
 renderItem(params,api){ // fonction qui sera appelée pour chaque valeur dans data
     var cellPoint = api.coord([api.value(0),api.value(1)]); // utilise les valeurs des données pour obtenir des coordonnées
     var img; // variable pour chemin de l'image
     var jour;
   // var date=echarts.format.formatTime('yyyy-MM-dd',api.value(0));
    if(isNaN(api.value(0))){
     return false;
    }
     img = "http://openweathermap.org/img/w/"+api.value(1)+".png";
     jour = new Date(api.value(0)).getDate();
     var group={// retourne un type group (ensemble de plusieurs élements)
         type:'group',
         children:[{ // enfant de ce groupe(image et text)
             type:'image', // image
             style:{ // style de cette image
                 image:img, // image à afficher
                 width:40, // largeur
                 heigth:30, // et hauteur de l'image
                 /* placement de l'image (x,y) avec les coordonnées */
                 x : cellPoint[0]-23,
                 y : cellPoint[1]-18
             }
         },
         {
             type:'text',// affiche le numero du jour,
             style:{
                 /* placement */
                 x : cellPoint[0]-6,
                 y : cellPoint[1]-32,
                 text:jour
             }
         },
         {
             type:'text',
             style : {
                 x:cellPoint[0]-30,
                 y:cellPoint[1]+20,
                 text:api.value(2)
             }
         },
         {
             type:'text',
             style: {
                 x:cellPoint[0]+18,
                 y:cellPoint[1]+20,
                 text : api.value(3)
             }
               
         
         }
         ]};
     return group;
 }
 decomposeDate(date){
     var tabDate=[];
     date = new Date(date);
     tabDate.push(date.getDate());
     tabDate.push((date.getMonth()+1));
     tabDate.push(date.getFullYear());
     
     console.log(tabDate[2]+'-'+tabDate[1],tabDate[2]+'-'+parseInt(tabDate[1]+1));
     return [tabDate[2]+'-'+tabDate[1],tabDate[2]+'-'+parseInt(tabDate[1]+1)+'-'+15];
 }
}
