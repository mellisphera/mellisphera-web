import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { CONFIG } from '../../../../constants/config';

import { InspUser } from './../../../_model/inspCat';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class InspUserService {

  constructor() { }
}
