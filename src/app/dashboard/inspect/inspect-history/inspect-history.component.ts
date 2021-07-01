import { Component, OnInit } from '@angular/core';
import { RucherModel } from '../../../_model/rucher-model';
import { UserloggedService } from '../../../userlogged.service';
import { Inspection } from '../../../_model/inspection';
import { InspectionService } from '../../service/api/inspection.service';
import { RucherService } from '../../service/api/rucher.service';
import { UnitService } from '../../service/unit.service';

interface InspInfo{
  apiary: string,
  date: string,
  health: string,
}

@Component({
  selector: 'app-inspect-history',
  templateUrl: './inspect-history.component.html',
  styleUrls: ['./inspect-history.component.css']
})
export class InspectHistoryComponent implements OnInit {

  private inspTab: Inspection[] = [];
  public inspInfoTab: InspInfo[] = [];
  private user_apiaries: RucherModel[] = [];

  constructor(
    private inspService: InspectionService,
    private userService: UserloggedService,
    private rucherService: RucherService,
    public unitService: UnitService
  ) { }

  ngOnInit() {
    this.inspService.getInspectionByUser(this.userService.getIdUserLoged()).subscribe(
      _inspTab => {
        this.inspTab = [..._inspTab];
      },
      () => {},
      () => {
        let arr = new Set<string>(this.inspTab.filter(_i => _i.apiaryInspId != null).map(_i => _i.apiaryInspId));
        console.log(arr);
        this.tableData(Array.from(arr));
      }
    );
    this.rucherService.getApiariesByUserId(this.userService.getIdUserLoged()).subscribe(
      _apiaries => {
        this.user_apiaries = [..._apiaries];
      },
      () => {},
      () => {
        this.user_apiaries.sort(this.compare);
      }
    );
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

  tableData(array: string[]): void{
    array.forEach(_id => {
      let insp = this.inspTab.filter(_i => _i.apiaryInspId === _id)[0];
      let health = "";
      if(insp.obs.find(_o => _o.name.includes('General')) != undefined){
        health = insp.obs.find(_o => _o.name.includes('General')).name.toLowerCase();
      }
      this.inspInfoTab.push({apiary : this.user_apiaries.find(_api => _api._id === insp.apiaryId).name, date: this.unitService.getHourlyDate(new Date(insp.opsDate)), health: health.toLowerCase()})
    })
  }

}
