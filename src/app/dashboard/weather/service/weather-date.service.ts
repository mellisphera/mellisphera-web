import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MyDate } from '../../../class/MyDate';
import { DataRange } from '../../../_model/data-range';

const WEATHER_PATH = '/dashboard/weather/';

@Injectable({
  providedIn: 'root'
})
export class WeatherDateService {

  public ranges: DataRange[];
  private rangeDateForRequest: Date[]; // for request
   /* Display */
   public start: Date;
   public end: Date;

   public today: Date = new Date();

  constructor(
    private router: Router,
  ) { 
    this.ranges = [
/*       { scale: 1, type: 'HOUR'},
      { scale: 6, type: 'HOURS'},
      { scale: 12, type: 'HOURS'}, */
      { scale: 2, type: 'DAY', typeFr: 'JOUR', typeEs: 'Día'},
      { scale: 3, type: 'DAY', typeFr: 'JOUR', typeEs: 'Día'},
      { scale: 5, type: 'DAY', typeFr: 'JOUR', typeEs: 'Día'},
      { scale: 1, type: 'WEEK', typeFr: 'SEMAINE', typeEs: 'Semana'},
      { scale: 2, type: 'WEEK', typeFr: 'SEMAINE', typeEs: 'Semana'},
      { scale: 3, type: 'WEEK', typeFr: 'SEMAINE', typeEs: 'Semana'},
      { scale: 1, type: 'MONTH', typeFr: 'MOIS', typeEs: 'Mes'},
      { scale: 2, type: 'MONTH', typeFr: 'MOIS', typeEs: 'Mes'},
      { scale: 3, type: 'MONTH', typeFr: 'MOIS', typeEs: 'Mes'},
      { scale: 6, type: 'MONTH', typeFr: 'MOIS', typeEs: 'Mes'},
      { scale: 9, type: 'MONTH', typeFr: 'MOIS', typeEs: 'Mes'},
      { scale: 1, type: 'YEAR', typeFr: 'AN', typeEs: 'Año'}
    ];
    this.setRange(this.ranges[6]);
  }

  setRange(scale: DataRange): void {
    let date = new Date();
    //console.log(this.router.url);
    switch(scale.type){
      case 'DAY':
        date.setDate((new Date().getDate() - scale.scale));
        break;
      case 'WEEK':
        date.setDate((new Date().getDate() - (scale.scale*7) ));
        break;
      case 'MONTH':
        date.setMonth((new Date().getMonth() - scale.scale));
        break;
      case 'YEAR':
        date.setFullYear(new Date().getFullYear() - 1);
        break;
      case 'HOUR':
        date.setHours(new Date().getHours() - scale.scale);
        break;
      default:
        date.setDate(date.getDate() - 15);
    }
    this.rangeDateForRequest = MyDate.getRange(date);
    this.rangeDateForRequest[0].setHours(0);
    this.rangeDateForRequest[0].setMinutes(0);
    this.rangeDateForRequest[0].setSeconds(0);

    this.rangeDateForRequest[1].setDate(this.rangeDateForRequest[1].getDate() + 10);
    //this.rangeDateForRequest[1].setHours(23);
    //this.rangeDateForRequest[1].setMinutes(59);
    this.rangeDateForRequest[1].setSeconds(0);


    this.start = this.rangeDateForRequest[0];
    this.end = this.rangeDateForRequest[1];
  }
  
   getRangeForRequest(): Date[] {
    return this.rangeDateForRequest;
  }


  getCurrentRangeForRequest(): Date[]{
    if(this.rangeDateForRequest[1] < this.today){
      return this.rangeDateForRequest;
    }
    else{
      return [this.rangeDateForRequest[0], this.today];
    }
  }

  getForecastRangeForRequest(): Date[]{
    if(this.rangeDateForRequest[1] < new Date()){
      return [this.rangeDateForRequest[1],this.rangeDateForRequest[1]];
    }
    else{
      let aux: Date = new Date(this.today);
      aux.setDate(aux.getDate() - 1)
      return [aux, this.rangeDateForRequest[1]];
    }
  }

  setRangeForRequest(_range: Date[] ) {
    const range: Date[] = [new Date(_range[0]), new Date(_range[1])];
    range[0].setHours(0);
    range[0].setMinutes(0);
    range[0].setSeconds(0);
    //range[1].setDate(range[1].getDate());
    range[1].setHours(23);
    range[1].setMinutes(59);
    range[1].setSeconds(0);
    this.rangeDateForRequest = [range[0], range[1]];
    //console.log(this.rangeDateForRequest);
    this.start = this.rangeDateForRequest[0];
    this.end = this.rangeDateForRequest[1];
  }

}
