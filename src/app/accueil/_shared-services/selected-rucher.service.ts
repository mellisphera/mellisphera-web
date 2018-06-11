import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class selectedRucherService {


  constructor() { }

   currentRucher(){    
    return JSON.parse(localStorage.getItem('currentRucher'));
  } 
}
