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
  public inspConf: InspConf[] = [];
  public inspCat: InspCat[] = [];

  public user_pref : UserPref;

  public inspect_date: Date;
  public user_apiaries: RucherModel[];
  public user_hives: RucheInterface[];
  public active_apiary_index: number;

  public new_inspApiary: Inspection;
  public new_inspHives: Inspection[] = [];

  constructor(
    private unitService: UnitService,
    private userPrefsService: UserParamsService,
    private rucherService: RucherService,
    private rucheService: RucheService,
    private userService: UserloggedService,
    private inspApiaryService: InspApiaryService,
    private inspHiveService: InspHiveService,
    public translateService: TranslateService,
    private inspService: InspectionService,
    private inspCatService: InspCatService,
    private inspUserService: InspUserService,
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
    )
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
          });
        }
        else{
          this.createInspUser(() => {
            this.inspConf = [...this.inspUser.inspConf];
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
    this.inspUserService.createInspUser(aux).subscribe(
      _inspUser => {
        this.inspUser = Object.assign({}, _inspUser);
        this.insertNewInspCat();
      },
      () => {},
      () => {
        next()
      }
    )
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

  isEnable(i: number): boolean{
    return this.inspConf[i].enable;
  }

  changeEnable(i: number): void{
    this.inspConf[i].enable = !this.inspConf[i].enable;
  }

  inspectDate(){

  }

  onSelectChange(){

  }

  saveInspection(){
    
  }

}
