import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UserloggedService } from '../../../userlogged.service';
import { RucherModel } from '../../../_model/rucher-model';
import { UserPref } from '../../../_model/user-pref';
import { UserParamsService } from '../../preference-config/service/user-params.service';
import { RucheService } from '../../service/api/ruche.service';
import { RucherService } from '../../service/api/rucher.service';
import { UnitService } from '../../service/unit.service';

@Component({
  selector: 'app-inspect-new',
  templateUrl: './inspect-new.component.html',
  styleUrls: ['./inspect-new.component.css']
})
export class InspectNewComponent implements OnInit {

  public user_pref : UserPref;

  public inspect_date: Date;
  public user_apiaries: RucherModel[];
  public active_apiary_index: Number;

  constructor(
    private unitService: UnitService,
    private userPrefsService: UserParamsService,
    private rucherService: RucherService,
    private rucheService: RucheService,
    private userService: UserloggedService,
  ) {}

  ngOnInit() {
    this.active_apiary_index = 0;
    this.userPrefsService.getUserPrefs().subscribe(
      _userPrefs => {
        this.user_pref = _userPrefs;
      },
      () => {},
      () => {}
    );
    this.rucherService.getApiariesByUserId(this.userService.getIdUserLoged()).subscribe(
      _apiaries => {
        this.user_apiaries = [..._apiaries];
      },
      () => {},
      () => {
        this.user_apiaries.sort(this.compare);
        console.log(this.user_apiaries);
      }
    )
  }

  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const apiA = a.name.toLowerCase();
    const apiB = b.name.toLowerCase();

    let comparison = 0;
    if (apiA > apiB) {
      comparison = 1;
    } else if (apiA < apiB) {
      comparison = -1;
    }
    return comparison;
  }


  inspectDate(): void{
    //console.log(moment(this.inspect_date).format(this.user_pref.timeFormat));
    (<HTMLInputElement>document.getElementsByClassName('inspect-time-input')[0]).value = moment(this.inspect_date).format(this.user_pref.timeFormat);
    (<HTMLElement>document.getElementsByClassName('valid-icon')[0]).style.visibility ='visible';
  }

  onSelectChange(): void{
    (<HTMLElement>document.getElementsByClassName('valid-icon')[1]).style.visibility ='visible';
  }

  changeApiaryNotes(): void{
    if( (<HTMLElement>document.getElementsByClassName('valid-icon')[2]).style.visibility === 'visible' ){
      (<HTMLElement>document.getElementsByClassName('valid-icon')[2]).style.visibility ='hidden';
    }
  }

  saveApiaryNotes(): void{
    (<HTMLElement>document.getElementsByClassName('valid-icon')[2]).style.visibility ='visible';
  }

  reset(){

  }

}
