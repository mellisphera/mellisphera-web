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
