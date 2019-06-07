import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RucherModel } from './../../../_model/rucher-model';
import { CONFIG } from '../../../../config';
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
        this.rangeStart.setHours(8);
        this.getAllApiary();
        this.getAllSensor();
        this.getAllUsers();
        this.getLastConnection(this.rangeStart);
      }
    }

  getAllApiary() {
    this.loadingService.loading = true;
    this.httpClient.get<RucherModel[]>(CONFIG.URL + 'apiaries/all').subscribe(
      (data) => {
        this.rucherService.ruchers = data;
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
  getAllSensor(): void{
    this.httpClient.get<CapteurInterface[]>(CONFIG.URL + 'sensors/all').subscribe(
      sensors => {
        this.allSensors = sensors;
      }
    );
  }


  /**
   *
   *
   * @memberof AdminService
   */
  getAllUsers(): void {
    this.httpClient.get<User[]>(CONFIG.URL + 'user/all').subscribe(
      users => {
        this.allUsers = users;
      }
    )
  }

  getLastConnection(startDt: Date):void {
    this.httpClient.post<Connection[]>(CONFIG.URL + 'logs/between', startDt).subscribe(
      connection => {
        this.lastConnection =  connection;
        console.log(this.lastConnection);
      }
    );
  }



}
