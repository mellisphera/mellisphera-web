import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../constants/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeonamesService {

  constructor(private httClient: HttpClient) { }

  getCityByCountryAndZipCode(country: string, zipCode: number): Observable<any> {
    const url = `http://api.geonames.org/postalCodeLookupJSON?postalcode=${zipCode}&username=${CONFIG.GEONAMES_USER}&country=${country}`;

    return this.httClient.get<any>(url);
  }
}
