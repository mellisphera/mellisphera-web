import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserloggedService } from '../../../userlogged.service';
import { RucherModel } from '../../../_model/rucher-model';
import { RucherService } from '../../service/api/rucher.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherOptionService {

  private apiaryConfig: RucherModel;
  private apiariesSelected: RucherModel[] = [];
  public recordsChartInstance: any;

  public user_apiaries: RucherModel[] = [];

  constructor(private rucherService: RucherService, private userService: UserloggedService) {
    this.rucherService.getApiariesByUserId(this.userService.getIdUserLoged()).subscribe(
      _apiaries => {
        this.user_apiaries = [..._apiaries].sort(this.compare);
        this.user_apiaries = this.user_apiaries.filter(apiary => apiary !== null && apiary.userId === this.userService.getIdUserLoged());
        this.addApiary(this.user_apiaries[0]);
      },
      () => {},
      () => {}
    );
  }

  compare( a:RucherModel, b:RucherModel ) {
    if ( a.name < b.name ){
      return -1;
    }
    if ( a.name > b.name ){
      return 1;
    }
    return 0;
  }

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
