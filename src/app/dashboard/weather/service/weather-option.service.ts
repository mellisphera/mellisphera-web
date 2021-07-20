import { Injectable } from '@angular/core';
import { RucherModel } from '../../../_model/rucher-model';

@Injectable({
  providedIn: 'root'
})
export class WeatherOptionService {

  private apiaryConfig: RucherModel;
  private apiariesSelected: RucherModel[] = [];
  public recordsChartInstance: any;

  constructor() { }

  getApiaryConfig(): RucherModel{
    return this.apiaryConfig;
  }

  setApiaryConfig(apiary: RucherModel){
    this.apiaryConfig = Object.assign({}, apiary);
  }

  getApiariesSelected(): RucherModel[]{
    return this.apiariesSelected;
  }

  addApiary(apiary: RucherModel){
    this.apiariesSelected.push(apiary);
    let size = this.apiariesSelected.length;
    this.setApiaryConfig( this.apiariesSelected[size - 1] );
  }

  removeApiary(apiary: RucherModel){
    let index = this.apiariesSelected.findIndex(_a => _a._id ===  apiary._id);
    this.apiariesSelected.splice(index, 1);
    let size = this.apiariesSelected.length;
    this.setApiaryConfig( this.apiariesSelected[size - 1] );
  }

  isApiarySelected(apiary: RucherModel){
    return this.apiariesSelected.findIndex(_a => _a._id === apiary._id) !== -1;
  }

  setRecordsChartInstance(chartInstance: any){
    this.recordsChartInstance = chartInstance;
  }

  getRecordsChartInstance(): any{
    return this.recordsChartInstance;
  }
}
