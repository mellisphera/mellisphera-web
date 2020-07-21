import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fitness } from '../../../_model/fitness';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../constants/config';
import { TranslateService } from '@ngx-translate/core';
import { FITNESS_CODE } from '../../../../constants/fitnessCode';

@Injectable({
  providedIn: 'root'
})
export class FitnessService {

  private dailyFitness: Fitness[];
  public rangeFitness: Date;

  constructor(private httpClient: HttpClient, private translateService: TranslateService) {
    this.rangeFitness = new Date();
    this.rangeFitness.setDate(new Date().getDate() - 2);
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
    if (res.length > 1) {
      throw Error("No unique result");
    } else if (res.length < 1) {
      return { _id: '', fitcode: '', fitcolor: "white", userId: '', hiveId: '', date: new Date() };
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
      return FITNESS_CODE[res[0].fitcode][lang]['Message'];
    }
  }


  public callRequest(userId: string) {
    this.getDailyFitnessByUserId(userId).subscribe(
      _res => {
        this.dailyFitness = _res;
      }
    )
  }


}
