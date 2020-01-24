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
import { Astro } from '../../../_model/astro';
import { Observable } from 'rxjs';
import { MOON } from '../charts/icons/icons_astro';

@Injectable({
  providedIn: 'root'
})
export class AstroService {

  public codeToPhaseName: Array<string>;
  constructor(private httpClient: HttpClient) {
    this.codeToPhaseName = ['', 'full_moon', 'new_moon', 'last_quarter', 'first_quarter', 
    'wawing_gibbous', 'waning_gibbous', 'last_crescent', 'first_crescent'];
  }

  /**
   * 
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<Astro>}
   * @memberof AstroService
   */
  public getAstroByApiary(apiaryId: string, range: Date[]): Observable<Astro[]> {
    return this.httpClient.post<Astro[]>(CONFIG.URL + 'astro/apiary/' + apiaryId, range);
  }


  getPicto(nomPicto: string, cellPoint: Array<number>): Array<any> {
    try {
      return MOON[nomPicto].map(_path => {
        return {
          type: 'path',
          scale: _path.scale,
          shape: {
            pathData: _path.path,
          },
          position: [cellPoint[0] + _path.position[0], cellPoint[1] + _path.position[1]],
          style: _path.style
        };
      });

    }
    catch{
    }
  }
}
