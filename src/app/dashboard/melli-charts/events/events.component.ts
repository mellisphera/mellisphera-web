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
  
  constructor(
    private rucheService: RucheService,
    private rucherService: RucherService,
    private melliFilters: MelliChartsFilterService,
    private melliDate: MelliChartsDateService,
    private alertService: AlertsService,
    private inspService: InspectionService,
    private stackService: StackMelliChartsService,
    private unitService: UnitService
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

    this.loadAll();
  }

  getHiveIndex(hive: RucheInterface): number {
    return this.rucheService.ruchesAllApiary.findIndex(elt => elt._id === hive._id);
  }

  getApiariesId(): string[]{
    return [ ...Array.from(new Set( this.stackService.getHiveSelect().map(_hive => _hive.apiaryId) )) ];
  }

  loadAll(): void{
    /*const obsInsp = this.stackService.getHiveSelect().map(_hive => {
      return { hive: _hive, name: _hive.name, obs: this.inspService.getInspectionsByFilters(_hive._id, this.melliDateService.getRangeForReqest())}
    });
    const obsAlert = this.stackService.getHiveSelect().map(_hive => {
      return { hive: _hive, name: _hive.name, obs: this.dailyThService.getBroodOldMethod(_hive._id, this.melliDateService.getRangeForReqest())}
    });
    this.inspService.getInspectionsByFilters()*/
    console.log(this.getApiariesId());
    const obsInsp = this.getApiariesId().map(_id => {
      return { _id: _id, 
               obs: this.inspService.getInspectionByFilters(_id, 
                                                            this.stackService.getHiveSelectIds(), 
                                                            this.melliDate.getRangeForReqest(), 
                                                            this.melliFilters.getEventArrayFilter()
                                                           )
              }
    });
    Observable.forkJoin(obsInsp.map(_elt => _elt.obs)).subscribe(
      insps_events => {
        console.log(insps_events);
        insps_events.forEach(_elt => {
          _elt.forEach(_insp => {
            this.tbody.appendChild( this.createRowInsp(_insp) );
          });      
        });
      },
      () => {},
      () => {}
    );
  }

  loadHive(hive: RucheInterface): void {

  }

  removeHive(hive: RucheInterface): void {

  }

  applyFilters(): void{

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
      cell4.className = 'apiary-icon';
    }
    else{
      cell4.className = 'event-icon';
    }

    // Liste des pictos
    let cell5 = document.createElement('td');

     // Notes & taches
    let cell6 = document.createElement('td');

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
