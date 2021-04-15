import { Component, OnInit } from '@angular/core';
import { UserloggedService } from '../../../userlogged.service';
import { RucheInterface } from '../../../_model/ruche';
import { RucherModel } from '../../../_model/rucher-model';
import { UserParamsService } from '../../preference-config/service/user-params.service';
import { RucheService } from '../../service/api/ruche.service';
import { RucherService } from '../../service/api/rucher.service';

import { InspApiary } from '../../../_model/inspApiary';
import { InspHive } from '../../../_model/inspHive';
import { InspHiveService } from './../../service/api/insp-hive.service';
import { InspApiaryService } from './../../service/api/insp-apiary.service';
import { UserPref } from '../../../_model/user-pref';
import * as moment from 'moment';

@Component({
  selector: 'app-inspect-history',
  templateUrl: './inspect-history.component.html',
  styleUrls: ['./inspect-history.component.css']
})
export class InspectHistoryComponent implements OnInit {

  public user_pref : UserPref;

  public inspect_date_start: Date;
  public inspect_date_end: Date;
  public user_apiaries: RucherModel[];
  public user_hives: RucheInterface[];
  public active_apiary_index: number;

  constructor(
    private userPrefsService: UserParamsService,
    private rucherService: RucherService,
    private rucheService: RucheService,
    private userService: UserloggedService,
    private inspApiaryService: InspApiaryService,
    private inspHiveService: InspHiveService,
  ) { }

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
        this.rucheService.getHivesByApiary(this.user_apiaries[0]._id).subscribe(
          _hives => {
            this.user_hives = [..._hives];
          },
          () => {},
          () => {
          }
        )
      }
    )
  }

  compare(a, b) {

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

  onSelectChange(): void{

  }

  inspectDateStart(): void{
    (<HTMLInputElement>document.getElementsByClassName('date-start')[0]).value = moment(this.inspect_date_start).format(this.user_pref.timeFormat);
    let parentDiv = document.getElementsByClassName('inspect-history-search-components')[0].children[1];
    (<HTMLElement>parentDiv.getElementsByClassName('valid-icon')[0]).style.visibility = 'visible';
    return;
  }

  inspectDateEnd(): void{
    (<HTMLInputElement>document.getElementsByClassName('date-end')[0]).value = moment(this.inspect_date_end).format(this.user_pref.timeFormat);
    let parentDiv = document.getElementsByClassName('inspect-history-search-components')[0].children[2];
    (<HTMLElement>parentDiv.getElementsByClassName('valid-icon')[0]).style.visibility = 'visible';
    return;
  }

}
