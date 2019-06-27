import { Injectable } from '@angular/core';
import { RecordService } from '../../../apiary/ruche-rucher/ruche-detail/service/Record/record.service';

@Injectable({
  providedIn: 'root'
})
export class HourlyManagerService {

  public baseOpions: any;
  constructor(
    private recordService: RecordService
  ) { }

}
