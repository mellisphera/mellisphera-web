/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

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
