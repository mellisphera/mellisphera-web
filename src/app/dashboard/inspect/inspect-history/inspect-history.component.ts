import { Component, OnInit } from '@angular/core';
import { RucherModel } from '../../../_model/rucher-model';
import { UserloggedService } from '../../../userlogged.service';
import { Inspection } from '../../../_model/inspection';
import { InspectionService } from '../../service/api/inspection.service';
import { RucherService } from '../../service/api/rucher.service';
import { UnitService } from '../../service/unit.service';
import { TranslateService } from '@ngx-translate/core';

interface InspInfo{
  apiary: string,
  date: Date,
  health: string,
  notes: string,
  todo: string
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

  private apiarySort: string = "";
  private dateSort: string = "";

  constructor(
    private inspService: InspectionService,
    private userService: UserloggedService,
    private rucherService: RucherService,
    public unitService: UnitService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.rucherService.getApiariesByUserId(this.userService.getIdUserLoged()).subscribe(
      _apiaries => {
        this.user_apiaries = [..._apiaries];
      },
      () => {},
      () => {
        this.user_apiaries.sort(this.compare);
        this.inspService.getInspectionByUser(this.userService.getIdUserLoged()).subscribe(
          _inspTab => {
            this.inspTab = [..._inspTab];
          },
          () => {},
          () => {
            let arr = new Set<string>(this.inspTab.filter(_i => _i.apiaryInspId != null).map(_i => _i.apiaryInspId));
            //console.log(arr);
            this.tableData(Array.from(arr));
          }
        );
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
      this.inspInfoTab.push({
        apiary : this.user_apiaries.find(_api => _api._id === insp.apiaryId).name, 
        date: new Date(insp.opsDate), 
        health: health.toLowerCase(),
        notes:insp.description,
        todo:insp.todo
      })
    })
  }

  changeSortApiary(): void{
    let th = <HTMLTableCellElement>document.getElementsByClassName('apiary-sort')[0];
    let th_other = <HTMLTableCellElement>document.getElementsByClassName('date-sort')[0];
    th_other.innerHTML = this.translate.instant('INSPECT.HISTORY.TABLE.DATE');
    if(this.apiarySort === "" || this.apiarySort === "DESC"){
      this.apiarySort = "ASC";
      th.innerHTML = this.translate.instant('INSPECT.HISTORY.TABLE.APIARY') + '<i class="fas fa-sort-up" style="margin-left:3px"></i>';
      this.inspInfoTab.sort((a,b) => {
        if( b.apiary > a.apiary ){
          return 1;
        }
        if( b.apiary < a.apiary ){
          return -1;
        }
        if(b.apiary === a.apiary){
          return 0;
        }
      });
      return;
    }
    this.apiarySort = "DESC";
    th.innerHTML = this.translate.instant('INSPECT.HISTORY.TABLE.APIARY') + '<i class="fas fa-sort-down" style="margin-left:3px"></i>';
    this.inspInfoTab.sort((a,b) => {
      if( b.apiary < a.apiary ){
        return 1;
      }
      if( b.apiary > a.apiary ){
        return -1;
      }
      if(b.apiary === a.apiary){
        return 0;
      }      
    });
    return;
  }

  changeSortDate(): void{
    let th = <HTMLTableCellElement>document.getElementsByClassName('date-sort')[0];
    let th_other = <HTMLTableCellElement>document.getElementsByClassName('apiary-sort')[0];
    th_other.innerHTML = this.translate.instant('INSPECT.HISTORY.TABLE.APIARY');
    if(this.dateSort === "" || this.dateSort === "DESC"){
      this.dateSort = "ASC";
      th.innerHTML = this.translate.instant('INSPECT.HISTORY.TABLE.DATE') + '<i class="fas fa-sort-up" style="margin-left:3px"></i>';    
      this.inspInfoTab.sort((a,b) => {
        if(new Date(b.date).getTime() > new Date(a.date).getTime()){
          return 1;
        }
        if(new Date(b.date).getTime() < new Date(a.date).getTime()){
          return -1;
        }
        if(new Date(b.date).getTime() === new Date(a.date).getTime()){
          return 0;
        }
      });
      return;
    }
    this.dateSort = "DESC";
    th.innerHTML = this.translate.instant('INSPECT.HISTORY.TABLE.DATE') + '<i class="fas fa-sort-down" style="margin-left:3px"></i>';
    this.inspInfoTab.sort((a,b) => {
      if(new Date(b.date).getTime() < new Date(a.date).getTime()){
        return 1;
      }
      if(new Date(b.date).getTime() > new Date(a.date).getTime()){
        return -1;
      }
      if(new Date(b.date).getTime() === new Date(a.date).getTime()){
        return 0;
      }
    });
    return;
  }

}
