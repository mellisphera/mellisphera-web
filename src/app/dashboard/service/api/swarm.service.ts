import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Swarm } from '../../../_model/swarm';
import { CONFIG } from '../../../../constants/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwarmService {

  constructor(private httpClient: HttpClient) { }


  /**
   *
   *
   * @returns {Observable<Swarm[]>}
   * @memberof SwarmService
   */
  public getAllSwarm(): Observable<Swarm[]> {
    return this.httpClient.get<Swarm[]>(CONFIG.URL + 'swarm/all');
  }
}
