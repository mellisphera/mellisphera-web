import { Injectable } from '@angular/core';
import { MESSAGES, MessagesList } from '../../../constants/messages';



@Injectable({
  providedIn: 'root'
})
export class MessagesService {


  private currentLang: string;

  constructor() {
  }

  setLang(currentLang: string): void {
    this.currentLang = currentLang;
  }

  getMessage(msg: MessagesList) : string{
    return(MESSAGES[this.currentLang][msg]);
  }
}
