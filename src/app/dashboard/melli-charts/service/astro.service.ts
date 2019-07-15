import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../../constants/config';
import { Astro } from '../../../_model/astro';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AstroService {

  constructor(private httpClient: HttpClient) { }

  /**
   * 
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<Astro>}
   * @memberof AstroService
   */
  public getAstroByApiary(idApiary: string, range: Date[]): Observable<Astro[]> {
    return this.httpClient.post<Astro[]>(CONFIG.URL + 'astro/apiary/' + idApiary, range);
  }
}
