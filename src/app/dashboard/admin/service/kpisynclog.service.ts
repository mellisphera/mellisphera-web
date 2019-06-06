import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../../config';
import { Kpisynclog } from '../../../_model/kpisynclog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KpisynclogService {

  constructor(private httpClient: HttpClient) { }

  getKpisnclog(start: Date) {
    return this.httpClient.post<any[]>(CONFIG.URL + '/kpisynclog/between', start);
  }


  getRandomColor() {
    return 'rgb(R, G, B)'.replace(/R/g, this.getRandom(255)).replace(/G/g, this.getRandom(255)).replace(/B/g, this.getRandom(255));
  }
  getRandom(max: number): string {
    return Math.floor(Math.random() * Math.floor(max)).toString();
  }
}
