import { DeprecatedDatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SeasonsService {

  private season: string;

  constructor() {
    this.init();
  }

  init(): void{
    let date = new Date();
    switch(date.getMonth()){
      case 12:
      case 1:
      case 2:
          this.season = 'winter';
        break;
      case 3:
      case 4:
      case 5:
        this.season = 'spring';
        break;
      case 6:
      case 7:
      case 8:
        this.season = 'summer';
        break;
      case 9:
      case 10: 
      case 11:
        this.season = 'autumn';
        break;
    } 
  }

  getSeason(): string{
    return this.season;
  }
}
