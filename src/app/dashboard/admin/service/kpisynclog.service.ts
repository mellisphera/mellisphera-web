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
import { CONFIG } from '../../../../constants/config';
import { Kpisynclog } from '../../../_model/kpisynclog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KpisynclogService {

  constructor(private httpClient: HttpClient) { }

  getKpisnclog(start: Date) {
    return this.httpClient.post<any[]>(CONFIG.URL + 'kpisynclog/between', start);
  }


  getRandomColor() {
    return 'rgb(R, G, B)'.replace(/R/g, this.getRandom(255)).replace(/G/g, this.getRandom(255)).replace(/B/g, this.getRandom(255));
  }
  getRandom(max: number): string {
    return Math.floor(Math.random() * Math.floor(max)).toString();
  }
}
