import { Pipe, PipeTransform } from '@angular/core';
import { UserParamsService } from '../dashboard/preference-config/service/user-params.service';
import { UnitService } from '../dashboard/service/unit.service';

@Pipe({
  name: 'myDate'
})
export class MyDatePipe implements PipeTransform {

  constructor(private unitService: UnitService){}
  transform(value: any, args?: any): any {
    if (args === 'DAILY') {
      return this.unitService.getDailyDate(value);
    } else {
      return this.unitService.getHourlyDate(new Date(value));
    }
  }

}
