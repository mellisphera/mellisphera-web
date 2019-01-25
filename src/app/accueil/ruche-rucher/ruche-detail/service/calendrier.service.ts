import { Injectable } from '@angular/core';


export class CalendrierService {

  rangeCalendar : Array<String>;

  constructor() {
    var max = new Date();
    /*let mois;
    if(max.getMonth()+1 == 1 ){
      mois = (max.getMonth()+1)-12;
    }
    else if(max.getMonth()+1 == 12){
      mois == 1;
    }*/
    var min = new Date((max.getFullYear()-1)+'-'+(max.getMonth()+1)+'-'+max.getDate());
    this.rangeCalendar = [this.convertDate(min),this.convertDate(max)];
  }

  convertDate(date : Date){
    var jour = ''+date.getDate();
    var mois = ''+(date.getMonth()+1);
    var anee = date.getFullYear();
    if(parseInt(jour) < 10 ){ jour = '0'+jour; }
    if(parseInt(mois) < 10 ){ mois = '0'+mois; }

    return anee + '-' +mois+'-'+ jour;
  }
}
