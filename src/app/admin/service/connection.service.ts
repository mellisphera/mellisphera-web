import { Connection } from './../../_model/connection';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '../../../config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  connectionObs: Observable<Connection[]>;
  connections: Array<Connection>;
  connectionsByIp: object;
  connectionsArray: any[];
  constructor(private httpClient: HttpClient) {
    this.getConnection();
    this.connectionsByIp = {

    };
  }


  getConnection() {
    this.connectionObs = this.httpClient.get<Connection[]>(CONFIG.URL + 'logs');
    this.connectionObs.subscribe(
      (data) => {
        console.log(data);
        this.connections = data;
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.formData();
      }
    );
  }

  formData() {
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
  }
}
