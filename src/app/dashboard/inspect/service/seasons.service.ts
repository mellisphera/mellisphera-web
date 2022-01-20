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
    const seasonNumber = Math.floor((date.getMonth() / 12 * 4)) % 4
    switch(seasonNumber){
      case 0:
          this.season = 'winter';
        break;
      case 1:
        this.season = 'spring';
        break;
      case 2:
        this.season = 'summer';
        break;
      case 3:
        this.season = 'autumn';
        break;
    } 
  }

  getSeason(): string{
    return this.season;
  }
}
