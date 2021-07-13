import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { CONFIG } from '../../../../constants/config';

import { InspUser } from './../../../_model/inspUser';
import { InspConf } from './../../../_model/inspConf';
import { InspCat } from './../../../_model/inspCat';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class InspUserService {

  constructor(private http: HttpClient) {}

  /**
   *
   *  @memberof InspUserService
   *  @param idUser : string
   *  @returns InspUser
   */
  getInspUser(userId: string): Observable<InspUser>{
    return this.http.get<InspUser>(CONFIG.URL + 'inspUser/idUser/' + userId, httpOptions);
  }

  existsInspUser(userId: string): Observable<boolean>{
    return this.http.get<boolean>(CONFIG.URL + 'inspUser/exists/' + userId, httpOptions);
  }

  createInspUser(inspUser: InspUser): Observable<InspUser>{
    return this.http.post<InspUser>(CONFIG.URL + 'inspUser/insert', inspUser, httpOptions);
  }

  updateInspUser(inspUser: InspUser): Observable<InspUser>{
    return this.http.post<InspUser>(CONFIG.URL + 'inspUser/update', inspUser, httpOptions);
  }


}
