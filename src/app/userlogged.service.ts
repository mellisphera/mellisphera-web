import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserloggedService {

  private messageSource = new BehaviorSubject<string>('');
  currentMessage = this.messageSource.asObservable();


  constructor() { }

   changeMessage(message : string){
     this.messageSource.next(message);
   }
   currentUser(){    
    return JSON.parse(localStorage.getItem('currentUser'));
  } 
  logOut(){
    return localStorage.removeItem('currentUser');
}
}
