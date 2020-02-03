import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '.././../../../constants/config';
import { Hub } from '../../../_model/hub';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HubService {

  public hubs: Hub[];
  constructor(private httpClient: HttpClient) {
    this.hubs = [];
  }

  getHubByUser(userId: string): Observable<Hub[]> {
    return this.httpClient.get<Hub[]>(`${CONFIG.URL}hub/user/${userId}`);
  }

  getHubByApiary(apiaryId: string): Hub {
    const hub: Hub = this.hubs.filter(_hub => _hub.apiaryId === apiaryId)[0];
    if (hub !== undefined && hub.hub !== 0) {
      return hub;
    } else {
      return null;
    }
  }

  callRequest(userId: string): void {
    this.getHubByUser(userId).subscribe(
      _res => {
        this.hubs = _res;
        console.log(this.hubs);
      }
    );
  }
}
