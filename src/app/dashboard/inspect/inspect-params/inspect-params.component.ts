import { Component, OnDestroy, OnInit } from '@angular/core';

import { InspCatService } from '../../service/api/insp-cat.service';
import { InspUserService } from '../../service/api/insp-user.service';
import { InspCat } from '../../../_model/inspCat';
import { InspConf } from '../../../_model/inspConf';
import { InspUser } from '../../../_model/inspUser';
import { UserloggedService } from '../../../userlogged.service';
import { MyNotifierService } from '../../service/my-notifier.service';
import { NotifList } from '../../../../constants/notify';

@Component({
  selector: 'app-inspect-params',
  templateUrl: './inspect-params.component.html',
  styleUrls: ['./inspect-params.component.css']
})
export class InspectParamsComponent implements OnInit, OnDestroy {

  public inspUser : InspUser = {
    _id: null,
    idUser: null,
    inspConf: []
  };
  public inspCat : InspCat[];
  public inspConf : InspConf[];

  constructor(
    private inspCatService: InspCatService,
    private inspUserService: InspUserService,
    private userService: UserloggedService,
    private notifService: MyNotifierService
  ) {}

  ngOnInit() {
    this.inspCatService.getInspCat().subscribe(
      _inspCatArray => {
        this.inspCat = [..._inspCatArray];
        console.log(_inspCatArray);
      },
      () => {},
      () => {
        this.inspUserService.existsInspUser(this.userService.getIdUserLoged()).subscribe(
          _exists => {
            if(_exists){
              console.log('insp user exists');
              this.getInspUser(() => {
                this.inspConf = [...this.inspUser.inspConf];
              });
            }
            else{
              console.log('insp user does not exists');
              this.createInspUser(() => {
                this.inspConf = [...this.inspUser.inspConf];
              });
            }
          },
          () => {},
          () => {}
        )
      }
    );
  }

  isSeasonActive(inspCat: InspCat, season: string):boolean{
    return inspCat.seasons.some(_season => _season === season);
  }

  seasonClick(evt: Event, inspcat: InspCat): void{
    let button = <HTMLButtonElement>evt.target;
    if(button.classList.contains('active')){
      button.classList.remove('active');
      return;
    }
    button.classList.add('active');
    return;
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

  onEnable(i: number): void{
    this.inspConf[i].enable = true;
    this.inspUser.inspConf[i].enable = true;
  }

  onDisable(i: number): void{
    this.inspConf[i].enable = false;
    this.inspUser.inspConf[i].enable = false;
  }

  ngOnDestroy(){
    this.inspUserService.updateInspUser(this.inspUser).subscribe(
      _inspUser => {
          this.notifService.sendSuccessNotif(NotifList.SAVE_ALERT_CONF);
      }
    )
  }

}
