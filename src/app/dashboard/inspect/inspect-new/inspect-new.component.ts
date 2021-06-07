import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { UserloggedService } from '../../../userlogged.service';
import { RucherModel } from '../../../_model/rucher-model';
import { UserPref } from '../../../_model/user-pref';
import { UserParamsService } from '../../preference-config/service/user-params.service';
import { RucheService } from '../../service/api/ruche.service';
import { RucherService } from '../../service/api/rucher.service';
import { UnitService } from '../../service/unit.service';
import { RucheInterface } from '../../../_model/ruche';
import { TranslateService } from '@ngx-translate/core';

import { InspApiary } from '../../../_model/inspApiary';
import { InspHive } from '../../../_model/inspHive';
import { InspHiveService } from './../../service/api/insp-hive.service';
import { InspApiaryService } from './../../service/api/insp-apiary.service';

import { Inspection } from '../../../_model/inspection';
import { InspectionService } from '../../service/api/inspection.service';
import { InspCat } from '../../../_model/inspCat';
import { InspCatService } from '../../service/api/insp-cat.service';
import { InspConf } from '../../../_model/inspConf';
import { InspUser } from '../../../_model/inspUser';
import { InspUserService } from '../../service/api/insp-user.service';

@Component({
  selector: 'app-inspect-new',
  templateUrl: './inspect-new.component.html',
  styleUrls: ['./inspect-new.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InspectNewComponent implements OnInit {

  public inspUser: InspUser = {_id: null, idUser: null, inspConf: []};
  public inspConf: InspConf[];
  public inspCat: InspCat[];

  public user_pref : UserPref;

  public inspect_date: Date;
  public user_apiaries: RucherModel[];
  public user_hives: RucheInterface[];
  public active_apiary_index: number;

  constructor(
    private inspService: InspectionService,
    private inspCatService: InspCatService,
    private inspUserService: InspUserService,
    private unitService: UnitService,
    private userPrefsService: UserParamsService,
    private rucherService: RucherService,
    private rucheService: RucheService,
    private userService: UserloggedService,
    private inspApiaryService: InspApiaryService,
    private inspHiveService: InspHiveService,
    public translateService: TranslateService,
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
        this.rucheService.getHivesByApiary(this.user_apiaries[0]._id).subscribe(
          _hives => {
            this.user_hives = [..._hives];
          },
          () => {},
          () => {
          }
        )
      }
    );
    this.inspCatService.getInspCat().subscribe(
      _inspCat => {
        this.inspCat = [..._inspCat];
      }
    );
    this.inspUserService.existsInspUser(this.userService.getIdUserLoged()).subscribe(
      _exists => {
        if(_exists){
          this.getInspUser(() => {
            this.inspConf = [...this.inspUser.inspConf];
            console.log(this.inspConf);
          });
        }
        else{
          this.createInspUser((aux) => {
            this.inspUser = Object.assign({}, aux);
            this.inspConf = [...this.inspUser.inspConf];
            console.log(this.inspConf);
          });
        }
      },
      () => {},
      () => {}
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

  createInspUser(next: Function): void{
    let aux : InspUser = {_id: null, idUser: null, inspConf: []};
    aux.idUser = this.userService.getIdUserLoged();
    this.inspCat.forEach(inspItem => {
      let conf: InspConf = { enable : true, inspCat: Object.assign({},inspItem) };
      aux.inspConf.push(conf);
    });
    next(aux);
  }

  getInspUser(next: Function): void{
    this.inspUserService.getInspUser(this.userService.getIdUserLoged()).subscribe(
      _inspUser => {
        this.inspUser = Object.assign({}, _inspUser);
        this.insertNewInspCat();
      },
      () => {},
      () => {
        next();
      }
    );
  }

  insertNewInspCat(): void{
    let array = this.inspCat.filter( x => !this.inspUser.inspConf.some(_conf => x.name === _conf.inspCat.name) );
    array.forEach(_elt => {
      let conf: InspConf = { enable: true, inspCat: _elt }
      this.inspUser.inspConf.push(conf);
    });
  }

  changeActive(evt: Event, inspCat: InspCat): void{
    let button = <HTMLButtonElement>evt.target;
    if(button.className.includes('_cb')){
      button.className = button.className.slice(0, -3);
      button.className += '_b';
      return;
    }
    button.className = button.className.slice(0, -2);
    button.className += '_cb';
    return;
  }

  onSelectChange(): void{
    this.active_apiary_index = (<HTMLSelectElement>document.getElementById('inspect-apiary-select')).selectedIndex;
    this.rucheService.getHivesByApiary(this.user_apiaries[this.active_apiary_index - 1]._id).subscribe(
      _hives => {
        this.user_hives = [..._hives];
      },
      () => {},
      () => {
      }
    )
  }

  inspectDate(): void{
    (<HTMLInputElement>document.getElementsByClassName('inspect-time-input')[0]).value = this.unitService.getHourlyDate(this.inspect_date);
  }

  saveInspection(): void{
    
  }

}
