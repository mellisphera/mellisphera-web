import { Connection } from '../../../_model/connection';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '../../../../config';
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
    this.connectionsByIp = {};
  }


  getConnection(): Observable<any> {
    return this.httpClient.get<Connection[]>(CONFIG.URL + 'logs').map((connections) => {
      connections.forEach(elt => {
        if (elt.location != null && elt.location !== undefined) {
          if (this.arrayIp.indexOf(elt.location.ip) === -1) {
            this.connectionsByIp[elt.location.ip] = connections.filter(eltFilter => {
              return (eltFilter.location !== null) ? eltFilter.location.ip === elt.location.ip : null;
            }).map(res => {
              return { name: res.username, value: [res.location.longitude, res.location.latitude]};
            });
            this.arrayIp.push(elt.location.ip);
          }
        }
      });
      return this.connectionsByIp;
    });
  }

  /*   formData() {
      this.connections.forEach(elt => {
        if (elt.location != null) {
          let ipTmp = elt.location['ip'];
          if (this.connectionsByIp[ipTmp]) {
            this.connectionsByIp[ipTmp].push({name : elt.username, value : new Array(elt.location['longitude'], elt.location['latitude'])});
          }
          else{
            this.connectionsByIp[ipTmp] = [];
            this.connectionsByIp[ipTmp].push({name : elt.username, value : new Array(elt.location['longitude'], elt.location['latitude'])});
          }
        }
      });
      console.log(this.connectionsByIp);
    } */
}
