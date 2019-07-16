import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RucherModel } from './../../../_model/rucher-model';
import { CONFIG } from '../../../../constants/config';
import { RucherService } from '../../service/rucher.service';
import { AtokenStorageService } from '../../../auth/Service/atoken-storage.service';
import { RucheInterface } from '../../../_model/ruche';
import { LoadingService } from '../../service/loading.service';
import { Observable } from 'rxjs';
import { CapteurInterface } from '../../../_model/capteur';
import { User } from '../../../_model/user';
import { Connection } from '../../../_model/connection';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public allSensors: CapteurInterface[]
  public allUsers: User[];
  public lastConnection: Connection[];
  private rangeStart: Date;

  constructor(
    private httpClient: HttpClient,
    private rucherService: RucherService,
    private tokenService: AtokenStorageService,
    private loadingService: LoadingService) {
      if (this.tokenService.checkAuthorities('ROLE_ADMIN')) {
        this.rangeStart = new Date();
        this.rangeStart.setDate(new Date().getDate() - 3);
        this.rangeStart.setHours(this.rangeStart.getHours() - 3);
        this.allUsers =  this.allSensors = this.lastConnection = [];
        this.getAllApiary();
        this.getLastConnection(this.rangeStart);
      }
    }

  getAllApiary() {
    this.loadingService.loading = true;
    this.httpClient.get<RucherModel[]>(CONFIG.URL + 'apiaries/all').subscribe(
      (data) => {
        this.rucherService.allApiaryAccount = data;
        this.rucherService.rucherSubject.next(data);
      },
      (err) => {},
      () => {
        this.rucherService.rucherSubject.complete();
        this.loadingService.loading = false;
      }
    );
  }

  /**
   *
   *
   * @returns {Observable<RucherModel>}
   * @memberof AdminService
   */
  getDemoApiary(): Observable<RucherModel> {
    return this.httpClient.get<RucherModel>(CONFIG.URL + 'sharing/demo-apiary');
  }

  /**
   *
   *
   * @param {string} name
   * @returns {Observable<RucherModel>}
   * @memberof AdminService
   */
  updateDemoApiaryName(name: string): Observable<RucherModel>  {
    return this.httpClient.put<RucherModel>(CONFIG.URL + 'sharing/name', name);
  }

  /**
   *
   *
   * @returns {Observable<RucheInterface[]>}
   * @memberof AdminService
   */
  getAllHive(): Observable<RucheInterface[]> {
    return this.httpClient.get<RucheInterface[]>(CONFIG.URL + 'hives/all');
  }

  /**
   *
   *
   * @memberof AdminService
   */
  getAllSensor(): Observable<CapteurInterface[]>{
    return this.httpClient.get<CapteurInterface[]>(CONFIG.URL + 'sensors/all');
  }


  /**
   *
   *
   * @memberof AdminService
   */
  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(CONFIG.URL + 'user/all');
  }

  /**
   *
   *
   * @returns {Array<CapteurInterface>}
   * @memberof AdminService
   */
  getSensorByUser(username: string): Array<CapteurInterface> {
    let sensorByUser = this.allSensors.filter(_filter => _filter.username === username.toLocaleLowerCase());
    if (sensorByUser.length > 0) {
      return sensorByUser;
    } else {
      return [];
    }
  }
  
  getLastConnection(startDt: Date):void {
    this.httpClient.post<Connection[]>(CONFIG.URL + 'logs/between', startDt).subscribe(
      connection => {
        this.lastConnection = connection;
        console.log(this.lastConnection);
      }
    );
  }



}
