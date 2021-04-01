import { Component, OnInit } from '@angular/core';
import { UserPref } from '../../_model/user-pref';
import { UserParamsService } from '../preference-config/service/user-params.service';
import { UnitService } from '../service/unit.service';
import * as moment from 'moment';


@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.component.html',
  styleUrls: ['./inspect.component.css']
})
export class InspectComponent implements OnInit {

  public inspect_date: Date;
  public user_pref : UserPref;

  constructor(
    private unitService: UnitService,
    private userPrefsService: UserParamsService,
  ) {}

  ngOnInit() {
    this.userPrefsService.getUserPrefs().subscribe(
      _userPrefs => {
        this.user_pref = _userPrefs;
      },
      () => {},
      () => {}
    );
  }

  inspectDate(): void{
    //console.log(moment(this.inspect_date).format(this.user_pref.timeFormat));
    (<HTMLInputElement>document.getElementsByClassName('inspect-time-input')[0]).value = moment(this.inspect_date).format(this.user_pref.timeFormat);
    (<HTMLElement>document.getElementsByClassName('valid-icon')[0]).style.visibility ='visible';
  }

}
