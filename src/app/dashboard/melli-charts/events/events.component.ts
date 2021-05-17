import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Inspection } from '../../../_model/inspection';
import { AlertInterface } from '../../../_model/alert';
import { RucheInterface } from '../../../_model/ruche';
import { RucheService } from '../../service/api/ruche.service';
import { MelliChartsFilterService } from '../service/melli-charts-filter.service';
import { MelliChartsDateService } from '../service/melli-charts-date.service';
import { AlertsService } from '../../service/api/alerts.service';
import { InspectionService } from '../../service/api/inspection.service';
import { StackMelliChartsService } from '../stack/service/stack-melli-charts.service';
import { iif, Observable } from 'rxjs';
import { UnitService } from '../../service/unit.service';
import { RucherService } from '../../service/api/rucher.service';
import { TranslateService } from '@ngx-translate/core';
import { RucherModel } from '../../../_model/rucher-model';

const INSPECT_IMG_PATH = '../../../../assets/icons/inspect/';
const ALERT_IMG_PATH = '../../../../assets/pictos_alerts/charts/';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css','../melli-charts.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventsComponent implements OnInit {

  private table: HTMLTableElement;
  private tbody: HTMLTableElement;

  private events: Inspection[] = [];
  private alerts: AlertInterface[] = [];

  private apiaries: string[] = [];
  private hives: string[] = [];
  
  constructor(
    private rucheService: RucheService,
    private rucherService: RucherService,
    private melliFilters: MelliChartsFilterService,
    private melliDate: MelliChartsDateService,
    private alertService: AlertsService,
    private inspService: InspectionService,
    private stackService: StackMelliChartsService,
    private unitService: UnitService,
    private translate: TranslateService
  )
  { }

  ngOnInit() {
    this.table = <HTMLTableElement>document.getElementsByClassName("table-events")[0];
    this.tbody = <HTMLTableElement>document.getElementsByClassName("table-body-events")[0];
    this.events = [];
    this.alerts = [];

    const elt = document.getElementsByClassName('apiaryGroup')[0];
    if (elt.classList.contains('apiary-group-brood')) {
      elt.classList.remove('apiary-group-brood');
    } else if (elt.classList.contains('apiary-group-stack')) {
      elt.classList.remove('apiary-group-stack');
    } else if (elt.classList.contains('apiary-group-weight')){
      elt.classList.remove('apiary-group-weight');
    } else if (elt.classList.contains('apiary-group-hive')){
      elt.classList.remove('apiary-group-hive');
    }
    elt.classList.add('apiary-group-events');

    this.getApiariesId();
    this.getHivesId();

    this.loadAll();
  }

  getHiveIndex(hive: RucheInterface): number {
    return this.rucheService.ruchesAllApiary.findIndex(elt => elt._id === hive._id);
  }

  getApiariesId(): string[]{
    this.apiaries = [ ...Array.from(new Set( this.stackService.getHiveSelect().map(_hive => _hive.apiaryId) )) ];
    return this.apiaries;
  }

  getHivesId(): string[]{
    this.hives = [...this.stackService.getHiveSelectIds()];
    return this.hives;
  }

  apiaryLoaded(apiaryId: string): boolean{
    if(this.apiaries.findIndex(_id => _id === apiaryId) > -1){
      return true;
    }
    return false;
  }

  loadAll(): void{
    this.tbody.innerHTML = '';
    let locations = [];
    if(this.melliFilters.getFilters().alert){
      locations.push('Hive');
      locations.push('Apiary');
    }
    const obsInsp = this.getApiariesId().map(_id => {
      return { _id: _id, 
               obs: this.inspService.getInspectionByFilters(_id, 
                                                            this.stackService.getHiveSelectIds(), 
                                                            this.melliDate.getRangeForReqest(), 
                                                            this.melliFilters.getEventArrayFilter()
                                                           )
              }
    });
    const obsAlert = this.getApiariesId().map(_id => {
      return { _id: _id, 
               obs: this.alertService.getAlertsByFilters(_id, 
                                                         this.stackService.getHiveSelectIds(), 
                                                         this.melliDate.getRangeForReqest(), 
                                                         this.melliFilters.getPictosArrayFilter(),
                                                         locations
                                                        )
              }
    });
    Observable.forkJoin(obsInsp.map(_elt => _elt.obs)).subscribe(
      insps_events => {
        insps_events.forEach(_elt => {
          _elt.forEach(_insp => {
            this.tbody.appendChild( this.createRowInsp(_insp) );
          });      
        });
      },
      () => {},
      () => {}
    );

    Observable.forkJoin(obsAlert.map(_elt => _elt.obs)).subscribe(
      alerts => {
        alerts.forEach(_elt => {
          _elt.forEach(_alert => {
            this.tbody.appendChild( this.createRowAlert(_alert) );
          });
        });
      },
      () => {},
      () => {}
    );

  }

  loadHive(hive: RucheInterface): void {
    let types = [];
    let locations = [];
    if(this.melliFilters.getShowEvent()){
      types.push('hive');
    }
    console.log(this.melliFilters.getShowAlert());
    if(this.melliFilters.getShowAlert()){
      locations.push('Hive');
      locations.push('Apiary');
    }
    console.log(locations);
    if(!this.apiaryLoaded(hive.apiaryId) && this.melliFilters.getFilters().insp){
      types.push('apiary');
      this.apiaries.push(hive.apiaryId);
    }
    this.inspService.getInspectionByFilters(hive.apiaryId, [hive._id], this.melliDate.getRangeForReqest(), types).subscribe(
      _inspections => {
        _inspections.forEach(_insp => {
          this.tbody.insertBefore(this.createRowInsp(_insp), this.tbody.firstElementChild);
        });
      },
      () => {},
      () => {}
    );
    this.alertService.getAlertsByFilters(hive.apiaryId, [hive._id], this.melliDate.getRangeForReqest(), this.melliFilters.getPictosArrayFilter(), locations).subscribe(
      _alerts => {
        console.log(_alerts);
        _alerts.forEach(_alt => {
          this.tbody.insertBefore(this.createRowAlert(_alt), this.tbody.firstElementChild);
        })
      },
      () => {},
      () => {}
    );
  }

  removeHive(hive: RucheInterface): void {
    let i=0;
    while(i<this.tbody.rows.length){
      let row: HTMLTableRowElement = this.tbody.rows[i];
      if(row.cells[1].innerHTML === hive.name){
        this.tbody.deleteRow(i);
      }
      else{
        i++;
      }
    }
    if(this.stackService.getHiveSelectFromApiaryId(hive.apiaryId) === 0){
      this.removeApiary(this.rucherService.getApiaryByApiaryId(hive.apiaryId));
    }
  }

  removeApiary(apiary: RucherModel): void {
    let i=0;
    while(i<this.tbody.rows.length){
      let row: HTMLTableRowElement = this.tbody.rows[i];
      if(row.cells[0].innerHTML === apiary.name){
        this.tbody.deleteRow(i);
      }
      else{
        i++;
      }
    }
    let index = this.apiaries.findIndex(_id => _id === apiary._id);
    if(index > -1){
      this.apiaries.splice(index, 1);
    }
  }

  applyFilter(filter: string, show: boolean): void{
    if(!show){
      this.removeByFilter(filter);
      return;
    }
    this.addByFilter(filter);
    return;
    
  }

  removeByFilter(filter: string): void{
    let i=0;
    while(i<this.tbody.rows.length){
      let row: HTMLTableRowElement = this.tbody.rows[i];
      if(row.cells[3].className.includes(filter)){
        this.tbody.deleteRow(i);
      }
      else{
        i++;
      }
    }
  }

  addByFilter(filter: string): void{
    switch(filter){
      case 'inspection':
        const obsInsp = this.getApiariesId().map(_id => {
          return { _id: _id, 
                   obs: this.inspService.getInspectionByFilters(_id, 
                                                                this.stackService.getHiveSelectIds(), 
                                                                this.melliDate.getRangeForReqest(), 
                                                                ['apiary']
                                                               )
                  }
          });
          Observable.forkJoin(obsInsp.map(_elt => _elt.obs)).subscribe(
            _insps_apiary => {
              _insps_apiary.forEach(_elt => {
                _elt.forEach(_insp => {
                  this.tbody.insertBefore(this.createRowInsp(_insp), this.tbody.firstElementChild);
                });      
              });
            },
            () => {},
            () => {}
          );
        break;
      case 'event':
        const obsEvent = this.getApiariesId().map(_id => {
          return { _id: _id, 
                   obs: this.inspService.getInspectionByFilters(_id, 
                                                                this.stackService.getHiveSelectIds(), 
                                                                this.melliDate.getRangeForReqest(), 
                                                                ['hive']
                                                               )
                  }
          });
          Observable.forkJoin(obsEvent.map(_elt => _elt.obs)).subscribe(
            _insps_hive => {
              _insps_hive.forEach(_elt => {
                _elt.forEach(_insp => {
                  this.tbody.insertBefore(this.createRowInsp(_insp), this.tbody.firstElementChild);
                });      
              });
            },
            () => {},
            () => {}
          );
        break;
      case 'alert':
        let locations = ['Apiary','Hive'];
        const obsAlert = this.getApiariesId().map(_id => {
          return { _id: _id, 
                   obs: this.alertService.getAlertsByFilters(_id, 
                                                             this.stackService.getHiveSelectIds(), 
                                                             this.melliDate.getRangeForReqest(), 
                                                             this.melliFilters.getPictosArrayFilter(),
                                                             locations
                                                            )
                  }
          });
          Observable.forkJoin(obsAlert.map(_elt => _elt.obs)).subscribe(
            _alerts => {
              _alerts.forEach(_elt => {
                _elt.forEach(_alt => {
                  this.tbody.insertBefore(this.createRowAlert(_alt), this.tbody.firstElementChild);
                });      
              });
            },
            () => {},
            () => {}
          );
        break;
      default:
        break;
    }
  }

  edit(): void{

  }

  remove(): void{

  }

  createRowInsp(_insp: Inspection): HTMLTableRowElement{
    let tr = document.createElement('tr');
    tr.style.marginBottom = '5px';
    tr.style.borderBottom = '1px solid #ddd';

    let cell1 = document.createElement('td');
    cell1.innerHTML = this.rucherService.getRucherNameById(_insp.apiaryId).name;

    let cell2 = document.createElement('td');
    if(_insp.hiveId != null){
      cell2.innerHTML = this.rucheService.getRucheNameById(_insp.hiveId).name;
    }
    
    let cell3 = document.createElement('td');
    let hours = '' + new Date(_insp.opsDate).getHours();
    let minutes = '' + new Date(_insp.opsDate).getMinutes(); 
    if(new Date(_insp.opsDate).getHours() < 10){
      hours = '0' + new Date(_insp.opsDate).getHours();
    }
    if(new Date(_insp.opsDate).getMinutes() < 10){
      minutes = '0' + new Date(_insp.opsDate).getMinutes();
    }
    cell3.innerHTML = this.unitService.getDailyDate(_insp.opsDate) + '<br />' + hours + ':' +  minutes; 

    let cell4 = document.createElement('td');
    if(_insp.type === 'apiary'){
      cell4.className = 'inspection-icon';
    }
    else{
      cell4.className = 'event-icon';
    }

    // Liste des pictos
    let cell5 = document.createElement('td');
    let container = document.createElement('div');
    container.className = "event-obs-container";
    if(_insp.obs != null){
      _insp.obs.forEach(_obs => {
        let div = document.createElement('div');
        div.style.background = "url('../../../../assets/icons/inspect/"+ _obs.img +"') center no-repeat";
        div.style.backgroundSize = "30px";
        div.className = "event-obs-item"
        container.appendChild(div);
      });
      cell5.appendChild(container);
    }

     // Notes & taches
    let cell6 = document.createElement('td');
    var text = _insp.description;
    var match = /\r|\n/.exec(text);
    if (match) {
      cell6.innerHTML = '<pre>' + _insp.description + '</pre>';
    }
    else{
      cell6.innerHTML = '<p>' + _insp.description + '</p>';
    }

    // Editer
    let cell7 = document.createElement('td');
    cell7.innerHTML = '<i class="fa fa-pen edit-icon"></i>'
    

    // Supprimer
    let cell8 = document.createElement('td');
    cell8.innerHTML = '<i class="fa fa-trash delete-icon"></i>';

    tr.append(cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8);
    
    return tr;
  }

  createRowAlert(_alert: AlertInterface): HTMLTableRowElement{
    let tr = document.createElement('tr');
    tr.style.marginBottom = '5px';
    tr.style.borderBottom = '1px solid #ddd';

    let cell1 = document.createElement('td');
    cell1.innerHTML = this.rucherService.getRucherNameById(_alert.apiaryId).name;

    let cell2 = document.createElement('td');
    if(_alert.hiveId != null){
      cell2.innerHTML = this.rucheService.getRucheNameById(_alert.hiveId).name;
    }

    let cell3 = document.createElement('td');
    let hours = '' + new Date(_alert.opsDate).getHours();
    let minutes = '' + new Date(_alert.opsDate).getMinutes(); 
    if(new Date(_alert.opsDate).getHours() < 10){
      hours = '0' + new Date(_alert.opsDate).getHours();
    }
    if(new Date(_alert.opsDate).getMinutes() < 10){
      minutes = '0' + new Date(_alert.opsDate).getMinutes();
    }
    cell3.innerHTML = this.unitService.getDailyDate(_alert.opsDate) + '<br />' + hours + ':' +  minutes; 

    let cell4 = document.createElement('td');
    cell4.className = 'alert-icon';

    // Liste des pictos
    let cell5 = document.createElement('td');
    let container = document.createElement('div');
    container.className = "event-obs-container";
    let div = document.createElement('div');
    div.style.background = "url('../../../../assets/pictos_alerts/charts/"+ _alert.icon +".png') center no-repeat";
    div.style.backgroundSize = "30px";
    div.className = "event-obs-item " + _alert.icon;
    container.appendChild(div);
    cell5.appendChild(container);

     // Notes & taches
    let cell6 = document.createElement('td');
    cell6.innerHTML = '<p>' + this.translate.instant('MELLICHARTS.FILTERS.DISPLAY.' + _alert.icon.toUpperCase()) + '</p>';

    // Editer
    let cell7 = document.createElement('td');
    cell7.innerHTML = '<i class="fa fa-pen edit-icon"></i>'
    

    // Supprimer
    let cell8 = document.createElement('td');
    cell8.innerHTML = '<i class="fa fa-trash delete-icon"></i>';

    tr.append(cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8);

    return tr;
  }

}
