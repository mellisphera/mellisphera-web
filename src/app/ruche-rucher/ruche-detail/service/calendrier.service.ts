import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendrierService {

  rangeCalendar : Array<string>;

  constructor() {
    this.rangeCalendar = [];
    var max = new Date();
    var min = new Date((max.getFullYear()-1)+'-'+(max.getMonth()+1)+'-'+max.getDate());
    this.rangeCalendar = [this.convertDate(min),this.convertDate(max)];
    console.log(this.rangeCalendar);
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
