import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RucherModel } from './../../../_model/rucher-model';
import { CONFIG } from '../../../../config';
import { RucherService } from '../../apiary/ruche-rucher/rucher.service';
import { AtokenStorageService } from '../../../auth/Service/atoken-storage.service';
import { RucheInterface } from '../../../_model/ruche';
import { LoadingService } from '../../service/loading.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private httpClient: HttpClient,
    private rucherService: RucherService,
    private tokenService: AtokenStorageService,
    private loadingService: LoadingService) {
      if (this.tokenService.checkAuthorities('ROLE_ADMIN')) {
        this.getAllApiary();
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

  getAllHive() {
    return this.httpClient.get<RucheInterface[]>(CONFIG.URL + 'hives/all');
  }



}
