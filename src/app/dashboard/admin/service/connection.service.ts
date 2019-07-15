import { Connection } from '../../../_model/connection';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '../../../../constants/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  connectionObs: Observable<Connection[]>;
  connections: Array<Connection>;
  arrayIp: Array<string>;
  connectionsByIp: object;
  connectionsArray: any[];
  constructor(private httpClient: HttpClient) {
    this.arrayIp = [];
    this.connectionsArray = []
    this.connectionsByIp = {};
  }


  /**
   *
   *
   * @returns {Observable<any>}
   * @memberof ConnectionService
   */
  getConnection(): Observable<any> {
    return this.httpClient.get<Connection[]>(CONFIG.URL + 'logs').map((connections) => {
      this.connectionsArray = connections.filter(res => res.location != null && res.username != null)
      .map(elt => {
        return { name: elt.username, value: [elt.location.longitude, elt.location.latitude, 10]};
      });
      return {
        series: [
          {
            data: this.connectionsArray
          }
        ]
      };
    });
  }

}
