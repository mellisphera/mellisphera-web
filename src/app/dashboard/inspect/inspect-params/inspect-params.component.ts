import { Component, OnInit } from '@angular/core';

import { InspCatService } from '../../service/api/insp-cat.service';
import { InspUserService } from '../../service/api/insp-user.service';
import { InspCat } from '../../../_model/inspCat';
import { InspUser } from '../../../_model/inspUser';

@Component({
  selector: 'app-inspect-params',
  templateUrl: './inspect-params.component.html',
  styleUrls: ['./inspect-params.component.css']
})
export class InspectParamsComponent implements OnInit {

  public inspUser : InspUser;
  public inspCat : InspCat[];

  constructor(
    private inspCatService: InspCatService,
    private inspUserService: InspUserService
  ) {}

  ngOnInit() {
    this.inspCatService.getInspCat().subscribe(
      _inspCatArray => {
        this.inspCat = [..._inspCatArray];
      },
      () => {},
      () => {}
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

}
