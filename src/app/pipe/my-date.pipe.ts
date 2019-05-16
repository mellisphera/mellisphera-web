import { Pipe, PipeTransform } from '@angular/core';
import { UserParamsService } from '../dashboard/preference-config/service/user-params.service';

@Pipe({
  name: 'myDate'
})
export class MyDatePipe implements PipeTransform {

  constructor(private userService: UserParamsService){}
  transform(value: any, args?: any): any {
    return this.userService.getHourlyDate(value);
  }

}
