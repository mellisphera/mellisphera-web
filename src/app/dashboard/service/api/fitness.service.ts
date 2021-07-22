import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Fitness } from '../../../_model/fitness';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../constants/config';
import { TranslateService } from '@ngx-translate/core';
//import { FITNESS_CODE } from '../../../../constants/fitnessCode';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FitnessService {

  private dailyFitness: Fitness[];
  public rangeFitness: Date;

  constructor(private httpClient: HttpClient, private translateService: TranslateService) {
    this.rangeFitness = new Date();
    this.rangeFitness.setDate(new Date().getDate() - 3);
    this.rangeFitness.setHours(23);
    this.rangeFitness.setMinutes(0);
    this.dailyFitness = [];
  }


  private getDailyFitnessByUserId(userId: string): Observable<Fitness[]> {
    let previousDay: Date = new Date();
    previousDay.setFullYear(this.rangeFitness.getFullYear());
    previousDay.setMonth(this.rangeFitness.getMonth());
    previousDay.setDate(this.rangeFitness.getDate() + 1);
    previousDay.setHours(23);
    previousDay.setMinutes(0);
    return this.httpClient.get<Fitness[]>(CONFIG.URL + `fitness/daily/${userId}/${this.rangeFitness.getTime()}/${previousDay.getTime()}`);
  }

  public getDailyFitnessByApiaryId(apiaryId: string): Observable<Fitness[]> {
    let previousDay: Date = new Date();
    previousDay.setFullYear(this.rangeFitness.getFullYear());
    previousDay.setMonth(this.rangeFitness.getMonth());
    previousDay.setDate(this.rangeFitness.getDate() + 1);
    previousDay.setHours(23);
    previousDay.setMinutes(0);
    let arr = [this.rangeFitness, previousDay];
    return this.httpClient.post<Fitness[]>(CONFIG.URL + `fitness/daily/apiary/${apiaryId}`, arr, httpOptions);
  }


  public nextDay(userId: string): void {
    this.rangeFitness.setDate(this.rangeFitness.getDate() + 1);
    this.rangeFitness.setHours(23);
    this.rangeFitness.setMinutes(0);
    this.rangeFitness.setSeconds(0);
    this.callRequest(userId);
  }

  public previousDay(userId: string): void {
    this.rangeFitness.setDate(this.rangeFitness.getDate() - 1);
    this.rangeFitness.setHours(23);
    this.rangeFitness.setMinutes(0);
    this.callRequest(userId);

  }


  public getFitnessByHiveId(hiveId: string): Fitness {
    const res = this.dailyFitness.filter(_fit => _fit.hiveId === hiveId);
    let date: Date = new Date();
    date.setDate( date.getDate() - 1 );
    if (res.length > 1) {
      throw Error("No unique result");
    } else if (res.length < 1) {
      return { _id: '', fitcode: '', fitcolor: "white", userId: '', hiveId: '', date: date };
    } else {
      return res[0];
    }
  }

  public getMessageByFitnessCode(hiveId: string): string {
    const res = this.dailyFitness.filter(_fit => _fit.hiveId === hiveId);
    const lang = this.translateService.currentLang.toUpperCase();
    if (res.length > 1) {
      throw Error("No unique result");
    } else if (res.length < 1) {
      return '';
    } else {
      return this.translateService.instant('FITNESS_CODE.'+res[0].fitcode+'.MSG')
    }
  }


  public callRequest(userId: string) {
    this.getDailyFitnessByUserId(userId).subscribe(
      _res => {
        this.dailyFitness = _res;
      }
    )
  }

  public getFitnessByHiveIdAndDate(hiveId: string, range: Date[]): Observable<Fitness[]>{
    return this.httpClient.post<Fitness[]>(CONFIG.URL + 'fitness/daily/' + hiveId, range, httpOptions);
  }

}
