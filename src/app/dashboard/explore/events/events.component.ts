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
import { NotifierService } from 'angular-notifier';
import { MelliChartsHiveService } from '../service/melli-charts-hive.service';
import { DailyManagerService } from '../hive/service/daily-manager.service';
import { InspCatService } from '../../service/api/insp-cat.service';
import { InspCat } from '../../../_model/inspCat';
import { SeasonsService } from '../../inspect/service/seasons.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css','../../../../pictos.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventsComponent implements OnInit {

  private table: HTMLTableElement;
  private tbody: HTMLTableElement;

  public PICTOS_HIVES_OBS: any[] = [];

  private events: Inspection[] = [];
  private alerts: AlertInterface[] = [];

  private apiaries: string[] = [];
  private hives: string[] = [];

  public eventToEdit: Inspection;
  public alertToEdit: AlertInterface;

  public hiveEvent: RucheInterface;
  public apiaryEvent: RucherModel;
  public newEventDate: Date;

  public sort: string = 'none';

  private inspCats: InspCat[];

  constructor(
    private rucheService: RucheService,
    private rucherService: RucherService,
    private melliFilters: MelliChartsFilterService,
    private melliDate: MelliChartsDateService,
    private alertService: AlertsService,
    private inspService: InspectionService,
    private stackService: StackMelliChartsService,
    private unitService: UnitService,
    private translate: TranslateService,
    private notifyService: NotifierService,
    private melliChartsHiveService: MelliChartsHiveService,
    private dailyManager: DailyManagerService,
    private inspCat: InspCatService,
    private translateService: TranslateService,
    private season: SeasonsService
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

    this.inspCat.getInspCat().subscribe(
      _inspCat => {
        this.inspCats = [..._inspCat].sort((a:InspCat, b:InspCat) => { return a.code - b.code });
        let arr = [..._inspCat].sort((a:InspCat, b:InspCat) => { return a.code - b.code });
        arr.forEach(_cat => {
          if(_cat.img !== "Default" && this.notConstant(_cat) && _cat.seasons.findIndex(_s => _s === this.season.getSeason()) !== -1){
            this.PICTOS_HIVES_OBS.push({
              name:_cat.name.toLowerCase(), 
              img: _cat.img.toLowerCase() + '_b.svg',
              img_active: _cat.img.toLowerCase() + '_cb.svg',
              class: 'hives-' + _cat.name.toLowerCase() + '-img'
            })
          }
        })
        this.PICTOS_HIVES_OBS.push({
          name:'default', 
          img: 'default_b.svg',
          img_active:'default_cb.svg',
          class: 'hives-default-img'
        })
      }
    )
  }

  notConstant(cat: InspCat): boolean{
    if(cat.name === 'Nobrood' || cat.name === 'Lowbrood' || cat.name === 'Normbrood' || cat.name === 'Highbrood' 
      || cat.name === 'Nobees' || cat.name === 'Lowbees' || cat.name === 'Normbees' || cat.name === 'Highbees'
      || cat.name === 'Nores' || cat.name === 'Lowres' || cat.name === 'Normres' || cat.name === 'Highres'){
      return false;
    }
    else return true;
  }

  sortByDate(): void{
    let tbody = <HTMLTableElement>document.getElementsByClassName('table-body-events')[0];
    let th = <HTMLTableCellElement>document.getElementsByClassName('th-date-sort')[0];
    if(this.sort === 'none' || this.sort === 'ASC'){
      let arr: any[] = [ ...this.events, ...this.alerts].sort((a,b) => {
        return new Date(b.opsDate).getTime() - new Date(a.opsDate).getTime();
      });
      this.sort = 'DESC';
      //console.log('allo desc', this.sort);
      th.innerHTML = this.translate.instant('MELLICHARTS.EVENT.TABLE.HEADER.DATE') + '<i class="fas fa-sort-down" style="margin-left:3px"></i>';
      arr.sort((a,b) => {
        return new Date(b.opsDate).getTime() - new Date(a.opsDate).getTime();
      }).forEach( (_item,i) => {
        if(_item.hasOwnProperty('description')){
          tbody.rows[i].replaceWith( this.createRowInsp( _item ) )
        }
        else{
          tbody.rows[i].replaceWith( this.createRowAlert( _item ) )
        }
      });
      return;
    }
    else{
      let arr: any[] = [ ...this.events, ...this.alerts].sort((a,b) => {
        return new Date(a.opsDate).getTime() - new Date(b.opsDate).getTime();
      });
      this.sort = 'ASC';
      //console.log('allo asc', this.sort);
      th.innerHTML = this.translate.instant('MELLICHARTS.EVENT.TABLE.HEADER.DATE') + '<i class="fas fa-sort-up" style="margin-left:3px"></i>';
      arr.sort((a,b) => {
        return new Date(a.opsDate).getTime() - new Date(b.opsDate).getTime();
      }).forEach( (_item,i) => {
        if(_item.hasOwnProperty('description')){
          tbody.rows[i].replaceWith( this.createRowInsp( _item ) )
        }
        else{
          tbody.rows[i].replaceWith( this.createRowAlert( _item ) )
        }
      });
      return;
    }
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
    let th = <HTMLTableCellElement>document.getElementsByClassName('th-date-sort')[0];
    th.innerHTML = this.translate.instant('MELLICHARTS.EVENT.TABLE.HEADER.DATE');
    let locations = [];
    this.events = [];
    this.alerts = [];
    if(this.melliFilters.getFilters().alert){
      locations.push('Hive');
      locations.push('Apiary');
    }
    const eventsInsp = this.getApiariesId().map(_id => {
      return { _id: _id,
               events: this.inspService.getInspectionByFilters(_id,
                                                            this.stackService.getHiveSelectIds(),
                                                            this.melliDate.getRangeForReqest(),
                                                            this.melliFilters.getEventArrayFilter(),
                                                            true
                                                           )
              }
    });
    const eventsAlert = this.getApiariesId().map(_id => {
      return { _id: _id,
               events: this.alertService.getAlertsByFilters(_id,
                                                         this.stackService.getHiveSelectIds(),
                                                         this.melliDate.getRangeForReqest(),
                                                         this.melliFilters.getPictosArrayFilter(),
                                                         locations
                                                        )
              }
    });
    Observable.forkJoin(eventsInsp.map(_elt => _elt.events)).subscribe(
      insps_events => {
        insps_events.forEach(_elt => {
          _elt.forEach((_insp,i) => {
            this.tbody.appendChild( this.createRowInsp(_insp) );
          });
          this.events.push(..._elt);
        });
      },
      () => {},
      () => {
        Observable.forkJoin(eventsAlert.map(_elt => _elt.events)).subscribe(
          alerts => {
            //console.log(alerts);
            alerts.forEach(_elt => {
              _elt.forEach((_alert,i) => {
                this.tbody.appendChild( this.createRowAlert(_alert) );
              });
              this.alerts.push(..._elt);
            });
          },
          () => {},
          () => {
            this.sortByDate();
          }
        );
      }
    );

  }

  loadHive(hive: RucheInterface): void {
    let types = [];
    let locations = [];
    let th = <HTMLTableCellElement>document.getElementsByClassName('th-date-sort')[0];
    th.innerHTML = this.translate.instant('MELLICHARTS.EVENT.TABLE.HEADER.DATE');
    this.hives.push(hive._id);
    if(this.melliFilters.getShowEvent()){
      types.push('hive');
    }
    if(this.melliFilters.getShowAlert()){
      locations.push('Hive');
      locations.push('Apiary');
    }
    if(!this.apiaryLoaded(hive.apiaryId) && this.melliFilters.getFilters().insp){
      types.push('apiary');
      this.apiaries.push(hive.apiaryId);
    }
    this.inspService.getInspectionByFilters(hive.apiaryId, [hive._id], this.melliDate.getRangeForReqest(), types, true).subscribe(
      _inspections => {
        _inspections.forEach((_insp,i) => {
          this.tbody.insertBefore(this.createRowInsp(_insp), this.tbody.firstElementChild);
        });
        this.events.push(..._inspections);
      },
      () => {},
      () => {}
    );
    this.alertService.getAlertsByFilters(hive.apiaryId, [hive._id], this.melliDate.getRangeForReqest(), this.melliFilters.getPictosArrayFilter(), locations).subscribe(
      _alerts => {
        if(this.apiaryLoaded(hive.apiaryId) && this.melliFilters.getFilters().alert){
          let alts = _alerts.filter( _alt => _alt.hiveId != null);
          alts.forEach((_alt,i) => {
            this.tbody.insertBefore(this.createRowAlert(_alt), this.tbody.firstElementChild);
          })
          this.alerts.push(...alts);
          return;
        }
        _alerts.forEach((_alt,i) => {
          this.tbody.insertBefore(this.createRowAlert(_alt), this.tbody.firstElementChild);
        })
        this.alerts.push(..._alerts);
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
        if(row.cells[3].className.includes('alert')){
          let index = this.alerts.findIndex(_alt => _alt._id === row.cells[8].innerHTML);
          this.alerts.splice(index, 1);
        }
        else{
          let index = this.events.findIndex(_insp => _insp._id === row.cells[8].innerHTML);
          this.events.splice(index, 1);
        }
        this.tbody.deleteRow(i);
      }
      else{
        i++;
      }
    }
    if(this.stackService.getHiveSelectFromApiaryId(hive.apiaryId) === 0){
      this.removeApiary(this.rucherService.getApiaryByApiaryId(hive.apiaryId));
    }
    delete this.hives[hive._id];
  }

  removeApiary(apiary: RucherModel): void {
    let i=0;
    while(i<this.tbody.rows.length){
      let row: HTMLTableRowElement = this.tbody.rows[i];
      if(row.cells[0].innerHTML === apiary.name){
        if(row.cells[3].className.includes('alert')){
          let index = this.alerts.findIndex(_alt => _alt._id === row.cells[8].innerHTML);
          this.alerts.splice(index, 1);
        }
        else{
          let index = this.events.findIndex(_insp => _insp._id === row.cells[8].innerHTML);
          this.events.splice(index, 1);
        }
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

  insertNewInsp(insp: Inspection): void{
    console.log(insp);
    let th = <HTMLTableCellElement>document.getElementsByClassName('th-date-sort')[0];
    th.innerHTML = this.translate.instant('MELLICHARTS.EVENT.TABLE.HEADER.DATE');
    if(insp.type === 'apiary'){
      if(this.apiaries.some(_apiaryId => _apiaryId === insp.apiaryId)){
        console.log('insert apiary');
        this.events.push(insp);
        this.tbody.insertBefore(this.createRowInsp(insp), this.tbody.firstElementChild);
        return;
      }
      return;
    }
    if(insp.type === 'hive'){
      console.log(this.hives);
      if(this.hives.some(_hiveId => _hiveId === insp.hiveId)){
        console.log('insert hive');
        this.events.push(insp);
        this.tbody.insertBefore(this.createRowInsp(insp), this.tbody.firstElementChild);
        return;
      }
      return;
    }
    return;
  }

  removeByFilter(filter: string): void{
    let i=0;
    while(i<this.tbody.rows.length){
      let row: HTMLTableRowElement = this.tbody.rows[i];
      if(row.cells[3].className.includes(filter)){
        this.tbody.deleteRow(i);
        if(row.cells[3].className.includes('event') || row.cells[3].className.includes('insp')){
          let index = this.events.findIndex(_insp => _insp._id === row.cells[8].innerHTML);
          this.events.splice(index, 1);
        }
        if(row.cells[3].className.includes('alert')){
          let index = this.alerts.findIndex(_alert => _alert._id === row.cells[8].innerHTML);
          this.alerts.splice(index, 1);
        }
      }
      else{
        i++;
      }
    }
  }

  addByFilter(filter: string): void{
    switch(filter){
      case 'inspection':
        const eventsInsp = this.getApiariesId().map(_id => {
          return { _id: _id,
                   events: this.inspService.getInspectionByFilters(_id,
                                                                this.stackService.getHiveSelectIds(),
                                                                this.melliDate.getRangeForReqest(),
                                                                ['apiary'],
                                                                true
                                                               )
                  }
          });
          Observable.forkJoin(eventsInsp.map(_elt => _elt.events)).subscribe(
            _insps_apiary => {
              _insps_apiary.forEach(_elt => {
                _elt.forEach((_insp,i) => {
                  this.tbody.insertBefore(this.createRowInsp(_insp), this.tbody.firstElementChild);
                });
                this.events.push(..._elt);
              });
            },
            () => {},
            () => {}
          );
        break;
      case 'event':
        const eventsEvent = this.getApiariesId().map(_id => {
          return { _id: _id,
                   events: this.inspService.getInspectionByFilters(_id,
                                                                this.stackService.getHiveSelectIds(),
                                                                this.melliDate.getRangeForReqest(),
                                                                ['hive'],
                                                                true
                                                               )
                  }
          });
          Observable.forkJoin(eventsEvent.map(_elt => _elt.events)).subscribe(
            _insps_hive => {
              _insps_hive.forEach(_elt => {
                _elt.forEach((_insp, i) => {
                  this.tbody.insertBefore(this.createRowInsp(_insp), this.tbody.firstElementChild);
                });
                this.events.push(..._elt);
              });
            },
            () => {},
            () => {}
          );
        break;
      case 'alert':
        let locations = ['Apiary','Hive'];
        const eventsAlert = this.getApiariesId().map(_id => {
          return { _id: _id,
                   events: this.alertService.getAlertsByFilters(_id,
                                                             this.stackService.getHiveSelectIds(),
                                                             this.melliDate.getRangeForReqest(),
                                                             this.melliFilters.getPictosArrayFilter(),
                                                             locations
                                                            )
                  }
          });
          Observable.forkJoin(eventsAlert.map(_elt => _elt.events)).subscribe(
            _alerts => {
              _alerts.forEach(_elt => {
                _elt.forEach((_alt, i) => {
                  this.tbody.insertBefore(this.createRowAlert(_alt), this.tbody.firstElementChild);
                });
                this.alerts.push(..._elt);
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

  applyDisplay(display: string, show: boolean): void{
    if(!show){
      this.removeByDisplay(display);
      return;
    }
    let th = <HTMLTableCellElement>document.getElementsByClassName('th-date-sort')[0];
    th.innerHTML = this.translate.instant('MELLICHARTS.EVENT.TABLE.HEADER.DATE');
    this.addByDisplay(display);
    return;
  }

  removeByDisplay(display: string): void{
    let i=0;
    while(i<this.tbody.rows.length){
      let row: HTMLTableRowElement = this.tbody.rows[i];
      let div: HTMLDivElement = <HTMLDivElement>row.cells[4].firstElementChild;
      let j=0;
      let suppr: Boolean = false;
      if(div != null){
        whileRow:
        while(j<div.childElementCount){
          let picto = div.children[j];
          if(picto.className.toLowerCase().includes(display.toLowerCase())){
            suppr = true;
            break whileRow;
          }
          j++;
        }
      }

      if(suppr){
        this.tbody.deleteRow(i);
        if(row.cells[3].className.includes('event') || row.cells[3].className.includes('insp')){
          let index = this.events.findIndex(_insp => _insp._id === row.cells[8].innerHTML);
          this.events.splice(index, 1);
        }
        if(row.cells[3].className.includes('alert')){
          let index = this.alerts.findIndex(_alert => _alert._id === row.cells[8].innerHTML);
          this.alerts.splice(index, 1);
        }
      }
      else{
        i++;
      }

    }
  }

  addByDisplay(display: string): void{
    let types = [];
    let locations = [];
    if(this.melliFilters.getShowInsp()){
      types.push('apiary');
    }
    if(this.melliFilters.getShowEvent()){
      types.push('hive');
    }
    if(this.melliFilters.getShowAlert()){
      locations.push('Hive');
      locations.push('Apiary');
    }
    const eventsInsp = this.getApiariesId().map(_id => {
      return { _id: _id,
               events: this.inspService.getInspectionByFilters(_id,
                                                            this.stackService.getHiveSelectIds(),
                                                            this.melliDate.getRangeForReqest(),
                                                            this.melliFilters.getEventArrayFilter(),
                                                            false
                                                           )
              }
      });;
    const eventsAlert = this.getApiariesId().map(_id => {
      return { _id: _id,
               events: this.alertService.getAlertsByFilters(_id,
                                                         this.stackService.getHiveSelectIds(),
                                                         this.melliDate.getRangeForReqest(),
                                                         [display],
                                                         locations
                                                        )
              }
    });
    Observable.forkJoin(eventsInsp.map(_elt => _elt.events)).subscribe(
      insps_events => {
        insps_events.forEach(_elt => {
          _elt.forEach((_insp, i) => {
            this.tbody.insertBefore( this.createRowInsp(_insp), this.tbody.firstElementChild);
          });
          this.events.push(..._elt);
        });
      },
      () => {},
      () => {}
    );
    Observable.forkJoin(eventsAlert.map(_elt => _elt.events)).subscribe(
      _alerts => {
        _alerts.forEach(_elt => {
          _elt.forEach((_alt, i) => {
            this.tbody.insertBefore(this.createRowAlert(_alt), this.tbody.firstElementChild);
          });
          this.alerts.push(..._elt);
        });
      },
      () => {},
      () => {}
    );
  }

  edit(type: string, evt: Event): void{
    let icon = <HTMLElement>evt.target;
    let row = <HTMLTableRowElement>icon.parentNode.parentNode;
    let _id: string = row.cells[8].innerHTML;
    if(type === 'insp'){
      this.PICTOS_HIVES_OBS = [];
      this.eventToEdit = Object.assign({}, this.events.find(_insp => _insp._id === _id) );
      if(this.eventToEdit.type === 'hive'){
        this.hiveEvent = this.rucheService.getHiveById(this.eventToEdit.hiveId);
        this.newEventDate = new Date(this.eventToEdit.opsDate);
        (<HTMLInputElement>document.getElementsByClassName("edit-event-hours-input")[0]).value = this.newEventDate.getHours().toString();
        (<HTMLInputElement>document.getElementsByClassName("edit-event-minutes-input")[0]).value = this.newEventDate.getMinutes().toString();
        this.inspCat.getInspCat().subscribe(
          _inspCat => {
            let arr = [..._inspCat].sort((a:InspCat, b:InspCat) => { return a.code - b.code });
            arr.forEach(_cat => {
              if(_cat.applies.indexOf("hive") !== -1 && _cat.img !== "Default" && this.notConstant(_cat)){
                this.PICTOS_HIVES_OBS.push({
                  name:_cat.name.toLowerCase(), 
                  img: _cat.img.toLowerCase() + '_b.svg',
                  img_active: _cat.img.toLowerCase() + '_cb.svg',
                  class: 'hives-' + _cat.name.toLowerCase() + '-img',
                  type: _cat.type,
                  code: _cat.code
                })
              }
            })
            this.PICTOS_HIVES_OBS.push({
              name:'default', 
              img: 'default_b.svg',
              img_active:'default_cb.svg',
              class: 'hives-default-img',
              type: 'events',
              code: 9999
            })
          },
          () => {},
          () => {
            $('#editInspectionModal').modal('show');
            this.addObsList();
          }
        );
      }
      if(this.eventToEdit.type === 'apiary'){
        this.apiaryEvent = this.rucherService.getApiaryByApiaryId(this.eventToEdit.apiaryId);
        this.newEventDate = new Date(this.eventToEdit.opsDate);
        (<HTMLInputElement>document.getElementsByClassName("edit-event-hours-input")[0]).value = this.newEventDate.getHours().toString();
        (<HTMLInputElement>document.getElementsByClassName("edit-event-minutes-input")[0]).value = this.newEventDate.getMinutes().toString();
        this.inspCat.getInspCat().subscribe(
          _inspCat => {
            let arr = [..._inspCat].sort((a:InspCat, b:InspCat) => { return a.code - b.code });
            arr.forEach(_cat => {
              if(_cat.applies.indexOf("apiary") !== -1 && _cat.img !== "Default" && this.notConstant(_cat)){
                this.PICTOS_HIVES_OBS.push({
                  name:_cat.name.toLowerCase(), 
                  img: _cat.img.toLowerCase() + '_b.svg',
                  img_active: _cat.img.toLowerCase() + '_cb.svg',
                  class: 'hives-' + _cat.name.toLowerCase() + '-img',
                  type: _cat.type
                })
              }
            })
            this.PICTOS_HIVES_OBS.push({
              name:'default', 
              img: 'default_b.svg',
              img_active:'default_cb.svg',
              class: 'hives-default-img',
              type: 'events'
            })
          },
          () => {},
          () => {
            $('#editInspectionModal').modal('show');
            this.addObsList();
          }
        );
      }
    }
    if(type === 'alert'){
      this.alertToEdit = Object.assign({},this.alerts.find(_alt => _alt._id === _id) );
      if(this.alertToEdit.loc === 'Hive'){
        this.hiveEvent = this.rucheService.getHiveById(this.alertToEdit.hiveId);
        this.newEventDate = new Date(this.alertToEdit.opsDate);
        (<HTMLInputElement>document.getElementsByClassName("edit-alert-hours-input")[0]).value = this.newEventDate.getHours().toString();
        (<HTMLInputElement>document.getElementsByClassName("edit-alert-minutes-input")[0]).value = this.newEventDate.getMinutes().toString();
      }
      if(this.alertToEdit.loc === 'Apiary'){
        this.apiaryEvent = this.rucherService.getApiaryByApiaryId(this.alertToEdit.apiaryId);
        this.newEventDate = new Date(this.alertToEdit.opsDate);
        (<HTMLInputElement>document.getElementsByClassName("edit-alert-hours-input")[0]).value = this.newEventDate.getHours().toString();
        (<HTMLInputElement>document.getElementsByClassName("edit-alert-minutes-input")[0]).value = this.newEventDate.getMinutes().toString();
      }
      (<HTMLElement>document.getElementsByClassName('edit-alert-error')[0]).style.display = 'none';
      (<HTMLElement>document.getElementsByClassName('edit-alert-time-error')[0]).style.display = 'none';
      $('#editAlertModal').modal('show');
      this.addAlertList();
    }
  }

  confirmEditEvent(): void{
    let th = <HTMLTableCellElement>document.getElementsByClassName('th-date-sort')[0];
    th.innerHTML = this.translate.instant('MELLICHARTS.EVENT.TABLE.HEADER.DATE');
    let index = this.events.findIndex(_insp => _insp._id === this.eventToEdit._id);
    this.events[index] = Object.assign({},this.eventToEdit);
    let rowIndex = Array.from(this.tbody.rows).findIndex(_row => _row.cells[8].innerHTML === this.eventToEdit._id);
    this.updateRowInsp(this.eventToEdit, rowIndex);
    this.eventToEdit.events.sort((a,b) => {
      return a.code - b.code;
    });
    this.inspService.updateEvent(this.eventToEdit).subscribe(
      () => {},
      () => {},
      () => {
        if(this.translate.currentLang === 'fr'){
          this.notifyService.notify('success', 'Inspection editée');
        }else{
          this.notifyService.notify('success', 'Edited inspection');
        }
      }
    );
    $('#editInspectionModal').modal('hide');
  }

  confirmEditAlert(): void{
    let th = <HTMLTableCellElement>document.getElementsByClassName('th-date-sort')[0];
    th.innerHTML = this.translate.instant('MELLICHARTS.EVENT.TABLE.HEADER.DATE');
    let hours = parseInt( (<HTMLInputElement>document.getElementsByClassName('edit-alert-hours-input')[0]).value );
    let minutes = parseInt( (<HTMLInputElement>document.getElementsByClassName('edit-alert-minutes-input')[0]).value );
    if(this.alertToEdit.icon == null){
      (<HTMLElement>document.getElementsByClassName('edit-alert-error')[0]).style.display = 'block';
      return;
    }
    if(hours > 23 || minutes > 59){
      (<HTMLElement>document.getElementsByClassName('edit-alert-time-error')[0]).style.display = 'block';
      return;
    }
    let rowIndex = Array.from(this.tbody.rows).findIndex(_row => _row.cells[8].innerHTML === this.alertToEdit._id);
    this.updateRowAlert(this.alertToEdit, rowIndex);
    this.alertService.update(this.alertToEdit).subscribe(
      () => {},
      () => {},
      () => {
        if(this.translate.currentLang === 'fr'){
          this.notifyService.notify('success', 'Alerte editée');
        }else{
          this.notifyService.notify('success', 'Edited alert');
        }
      }
    );
    $('#editAlertModal').modal('hide');
    return;
  }

  remove(type: string, evt: Event): void{
    let icon = <HTMLElement>evt.target;
    let row = <HTMLTableRowElement>icon.parentNode.parentNode;
    let _id: string = row.cells[8].innerHTML;
    if(type === 'insp'){
      this.eventToEdit = this.events.find(_insp => _insp._id === _id);
      if(this.eventToEdit.type === 'hive'){
        this.hiveEvent = this.rucheService.getHiveById(this.eventToEdit.hiveId);
        this.newEventDate = new Date(this.eventToEdit.opsDate);
      }
      if(this.eventToEdit.type === 'apiary'){
        this.apiaryEvent = this.rucherService.getApiaryByApiaryId(this.eventToEdit.apiaryId);
        this.newEventDate = new Date(this.eventToEdit.opsDate);
      }
      $('#deleteEventModal').modal('show');
    }
    if(type === 'alert'){
      this.alertToEdit = this.alerts.find(_alt => _alt._id === _id);
      if(this.alertToEdit.loc === 'Hive'){
        this.hiveEvent = this.rucheService.getHiveById(this.alertToEdit.hiveId);
        this.newEventDate = new Date(this.alertToEdit.opsDate);
      }
      if(this.alertToEdit.loc === 'Apiary'){
        this.apiaryEvent = this.rucherService.getApiaryByApiaryId(this.alertToEdit.apiaryId);
        this.newEventDate = new Date(this.alertToEdit.opsDate);
      }
      $('#deleteAlertModal').modal('show');
    }

  }

  confirmDeleteEvent(): void{
    let index = this.events.findIndex(_evt => _evt._id === this.eventToEdit._id);
    this.events.splice(index, 1);
    let rowIndex = Array.from(this.tbody.rows).findIndex(_row => _row.cells[8].innerHTML === this.eventToEdit._id);
    this.tbody.deleteRow(rowIndex);
    this.inspService.deleteHiveInsp([this.eventToEdit._id]).subscribe(
      () => {},
      () => {},
      () => {
        if(this.translate.currentLang === 'fr'){
          this.notifyService.notify('success', 'Evenement supprimé');
        }else{
          this.notifyService.notify('success', 'Deleted event');
        }
      }
    );
    $('#deleteEventModal').modal('hide');
  }

  confirmDeleteAlert(): void{
    let index = this.events.findIndex(_evt => _evt._id === this.alertToEdit._id);
    this.alerts.splice(index, 1);
    let rowIndex = Array.from(this.tbody.rows).findIndex(_row => _row.cells[8].innerHTML === this.alertToEdit._id);
    this.tbody.deleteRow(rowIndex);
    this.inspService.deleteHiveInsp([this.alertToEdit._id]).subscribe(
      () => {},
      () => {},
      () => {
        if(this.translate.currentLang === 'fr'){
          this.notifyService.notify('success', 'Alerte supprimée');
        }else{
          this.notifyService.notify('success', 'Deleted alert');
        }
      }
    );
    $('#deleteAlertModal').modal('hide');
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
    if(_insp.events != null){
      _insp.events.forEach(_events => {
        let div = document.createElement('div');
        let name = _events.name.split('');
        name[0] = name[0].toUpperCase();
        div.className = "event-obs-item " + name.join('');
        div.setAttribute('data-toogle', 'tooltip');
        div.setAttribute('title', this.translate.instant('INSP_CONF.'+_events.name.toUpperCase()));
        container.appendChild(div);

      });
      cell5.appendChild(container);
    }

     // Notes & taches
    let cell6 = document.createElement('td');
    if(_insp.description != null){
      var text = _insp.description;
      var match = /\r|\n/.exec(text);
      if (match) {
        cell6.innerHTML = '<pre>' + _insp.description + '</pre>';
      }
      else{
        cell6.innerHTML = '<p>' + _insp.description + '</p>';
      }
    }
    if(_insp.todo != null){
      var todo = _insp.todo;
      var match = /\r|\n/.exec(todo);
      if (match) {
        cell6.innerHTML += '<br /> <pre style="color: blue">' + _insp.todo + '</pre>';
      }
      else{
        cell6.innerHTML += '<br /> <p style="color: blue">' + _insp.todo + '</p>';
      }
    }
    
    

    // Editer
    let cell7 = document.createElement('td');
    let i7 = document.createElement('i');
    i7.className = "fa fa-pen edit-icon";
    i7.onclick = (evt: Event) => this.edit('insp', evt);
    cell7.appendChild(i7);


    // Supprimer
    let cell8 = document.createElement('td');
    let i8 = document.createElement('i');
    i8.className = "fa fa-trash delete-icon";
    i8.onclick = (evt: Event) => this.remove('insp', evt);
    cell8.appendChild(i8);

    let cell9 = document.createElement('td');
    cell9.style.display = 'none';
    cell9.innerHTML = _insp._id;

    tr.append(cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9);

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
    container.className = "alerts-container";
    let div = document.createElement('div');
    div.className = "alert-item " + _alert.icon;
    div.setAttribute('data-toogle', 'tooltip');
    div.setAttribute('title', this.translate.instant('ALERTS_DESC.'+_alert.icon.toUpperCase()));
    container.appendChild(div);
    cell5.appendChild(container);

     // Notes & taches
    let cell6 = document.createElement('td');
    cell6.innerHTML = '<p>' + this.translate.instant('MELLICHARTS.FILTERS.DISPLAY.' + _alert.icon.toUpperCase()) + '</p>';

    // Editer
    let cell7 = document.createElement('td');
    let i7 = document.createElement('i');
    i7.className = "fa fa-pen edit-icon";
    i7.onclick = (evt: Event) => this.edit('alert', evt);
    cell7.appendChild(i7);

    // Supprimer
    let cell8 = document.createElement('td');
    let i8 = document.createElement('i');
    i8.className = "fa fa-trash delete-icon";
    i8.onclick = (evt: Event) => this.remove('alert', evt);
    cell8.appendChild(i8);

    let cell9 = document.createElement('td');
    cell9.style.display = 'none';
    cell9.innerHTML = _alert._id;

    tr.append(cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9);

    return tr;
  }

  updateRowInsp(insp: Inspection, rowIndex: number){
    let hours = '' + new Date(insp.opsDate).getHours();
    let minutes = '' + new Date(insp.opsDate).getMinutes();
    if(new Date(insp.opsDate).getHours() < 10){
      hours = '0' + new Date(insp.opsDate).getHours();
    }
    if(new Date(insp.opsDate).getMinutes() < 10){
      minutes = '0' + new Date(insp.opsDate).getMinutes();
    }
    this.tbody.rows[rowIndex].cells[2].innerHTML = this.unitService.getDailyDate(insp.opsDate) + '<br />' + hours + ':' +  minutes;

    this.tbody.rows[rowIndex].cells[4].getElementsByClassName('event-obs-container')[0].innerHTML = '';
    if(insp.events != null){
      insp.events.forEach(_events => {
        let div = document.createElement('div');
        let name = _events.name.split('');
        name[0] = name[0].toUpperCase();
        div.className = "event-obs-item " + name.join('');
        div.setAttribute('data-toogle', 'tooltip');
        div.setAttribute('title', this.translate.instant('INSP_CONF.'+_events.name.toUpperCase()));
        this.tbody.rows[rowIndex].cells[4].getElementsByClassName('event-obs-container')[0].appendChild(div);
      });
    }

    var text = insp.description;
    var match = /\r|\n/.exec(text);
    if (match) {
      this.tbody.rows[rowIndex].cells[5].innerHTML = '<pre>' + insp.description + '</pre>';
    }
    else{
      this.tbody.rows[rowIndex].cells[5].innerHTML = '<p>' + insp.description + '</p>';
    }
  }

  updateRowAlert(alert: AlertInterface, rowIndex: number){
    let hours = '' + new Date(alert.opsDate).getHours();
    let minutes = '' + new Date(alert.opsDate).getMinutes();
    if(new Date(alert.opsDate).getHours() < 10){
      hours = '0' + new Date(alert.opsDate).getHours();
    }
    if(new Date(alert.opsDate).getMinutes() < 10){
      minutes = '0' + new Date(alert.opsDate).getMinutes();
    }
    this.tbody.rows[rowIndex].cells[2].innerHTML = this.unitService.getDailyDate(alert.opsDate) + '<br />' + hours + ':' +  minutes;

    this.tbody.rows[rowIndex].cells[4].getElementsByClassName('alerts-container')[0].innerHTML = '';
    let div = document.createElement('div');
    div.className = "alert-item " + alert.icon;
    div.setAttribute('data-toogle', 'tooltip');
    div.setAttribute('title', this.translate.instant('ALERTS_DESC.'+ alert.icon.toUpperCase()));
    this.tbody.rows[rowIndex].cells[4].getElementsByClassName('alerts-container')[0].appendChild(div);


    this.tbody.rows[rowIndex].cells[5].innerHTML = '<p>' + this.translate.instant('MELLICHARTS.FILTERS.DISPLAY.' + alert.icon.toUpperCase()) + '</p>';
  }

  addObsList(): void {
    if(this.eventToEdit.events.findIndex(_o => _o.name === 'Nobees') !== -1){
      (<HTMLInputElement>document.getElementById("edit_bees_none_check")).checked = true;
      (<HTMLInputElement>document.getElementById("edit_bees_low_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_bees_avg_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_bees_high_check")).checked = false;
    }

    if(this.eventToEdit.events.findIndex(_o => _o.name === 'Lowbees') !== -1){
      (<HTMLInputElement>document.getElementById("edit_bees_none_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_bees_low_check")).checked = true;
      (<HTMLInputElement>document.getElementById("edit_bees_avg_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_bees_high_check")).checked = false;
    }
    
    if(this.eventToEdit.events.findIndex(_o => _o.name === 'Normbees') !== -1){
      (<HTMLInputElement>document.getElementById("edit_bees_none_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_bees_low_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_bees_avg_check")).checked = true;
      (<HTMLInputElement>document.getElementById("edit_bees_high_check")).checked = false;
    }

    if(this.eventToEdit.events.findIndex(_o => _o.name === 'Highbees') !== -1){
      (<HTMLInputElement>document.getElementById("edit_bees_none_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_bees_low_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_bees_avg_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_bees_high_check")).checked = true;
    }

    if(this.eventToEdit.events.findIndex(_o => _o.name === 'Nobrood') !== -1){
      (<HTMLInputElement>document.getElementById("edit_brood_none_check")).checked = true;
      (<HTMLInputElement>document.getElementById("edit_brood_low_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_brood_avg_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_brood_high_check")).checked = false;
    }

    if(this.eventToEdit.events.findIndex(_o => _o.name === 'Lowbrood') !== -1){
      (<HTMLInputElement>document.getElementById("edit_brood_none_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_brood_low_check")).checked = true;
      (<HTMLInputElement>document.getElementById("edit_brood_avg_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_brood_high_check")).checked = false;
    }

    if(this.eventToEdit.events.findIndex(_o => _o.name === 'Normbrood') !== -1){
      (<HTMLInputElement>document.getElementById("edit_brood_none_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_brood_low_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_brood_avg_check")).checked = true;
      (<HTMLInputElement>document.getElementById("edit_brood_high_check")).checked = false;
    }

    if(this.eventToEdit.events.findIndex(_o => _o.name === 'Highbrood') !== -1){
      (<HTMLInputElement>document.getElementById("edit_brood_none_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_brood_low_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_brood_avg_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_brood_high_check")).checked = true;
    }

    if(this.eventToEdit.events.findIndex(_o => _o.name === 'Nores') !== -1){
      (<HTMLInputElement>document.getElementById("edit_res_none_check")).checked = true;
      (<HTMLInputElement>document.getElementById("edit_res_low_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_res_avg_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_res_high_check")).checked = false;
    }

    if(this.eventToEdit.events.findIndex(_o => _o.name === 'Lowres') !== -1){
      (<HTMLInputElement>document.getElementById("edit_res_none_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_res_low_check")).checked = true;
      (<HTMLInputElement>document.getElementById("edit_res_avg_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_res_high_check")).checked = false;
    }

    if(this.eventToEdit.events.findIndex(_o => _o.name === 'Normres') !== -1){
      (<HTMLInputElement>document.getElementById("edit_res_none_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_res_low_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_res_avg_check")).checked = true;
      (<HTMLInputElement>document.getElementById("edit_res_high_check")).checked = false;
    }

    if(this.eventToEdit.events.findIndex(_o => _o.name === 'Highres') !== -1){
      (<HTMLInputElement>document.getElementById("edit_res_none_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_res_low_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_res_avg_check")).checked = false;
      (<HTMLInputElement>document.getElementById("edit_res_high_check")).checked = true;
    }

    const eventsDiv = (<HTMLElement>document.getElementsByClassName('edit-event-choice-events')[0]);
    eventsDiv.innerHTML = '';

    for (let i=0; i < this.PICTOS_HIVES_OBS.length; i++){

      const button = document.createElement('button');
      button.className = 'hives-events-add';
      button.classList.add(this.PICTOS_HIVES_OBS[i].class);
      
      if(this.eventToEdit.events != null && this.eventToEdit.events.findIndex( _o => _o.name.toLowerCase() === this.PICTOS_HIVES_OBS[i].name.toLowerCase() ) !== -1){
        button.classList.add(this.PICTOS_HIVES_OBS[i].class + '-active');
      }

      button.setAttribute('data-toggle', 'tooltip');
      button.setAttribute('data-placement', 'top');
      button.setAttribute('title', this.translateService.instant('INSP_CONF.' + this.PICTOS_HIVES_OBS[i].name.toUpperCase()));

      button.onclick = (evt: Event) => {
        this.hiveButton(evt, this.PICTOS_HIVES_OBS[i].name);
      }

      eventsDiv.appendChild(button);
    }



  }

  hiveButton(evt: Event, name: string): void {
    const button = (<HTMLButtonElement> evt.target);
    let index: number = this.PICTOS_HIVES_OBS.findIndex(_pictos => _pictos.name === name);
    if ( button.classList.contains(this.PICTOS_HIVES_OBS[index].class + '-active') ) {
      button.classList.remove(this.PICTOS_HIVES_OBS[index].class + '-active');
      const i = this.eventToEdit.events.findIndex(e => e.name === this.PICTOS_HIVES_OBS[index].name);
      this.eventToEdit.events.splice(i, 1);
      return;
    }
    button.classList.add(this.PICTOS_HIVES_OBS[index].class + '-active');
    this.eventToEdit.events.push({name: this.PICTOS_HIVES_OBS[index].name, img: this.PICTOS_HIVES_OBS[index].img});
    return;
  }

  setNewEventDate(): void {
    this.newEventDate = new Date( (<any>this.newEventDate)._d);
    (<HTMLInputElement>document.getElementsByClassName('edit-event-time-input')[0]).value = this.unitService.getDailyDate(this.newEventDate);
    this.newEventDate.setHours( parseInt( (<HTMLInputElement>document.getElementsByClassName('edit-event-hours-input')[0]).value ));
    this.newEventDate.setMinutes( parseInt( (<HTMLInputElement>document.getElementsByClassName('edit-event-minutes-input')[0]).value ));
    this.eventToEdit.opsDate = new Date(this.newEventDate);
    /*console.log(this.newEventDate);
    console.log((<HTMLInputElement>document.getElementsByClassName('edit-event-hours-input')[0]).value);
    console.log((<HTMLInputElement>document.getElementsByClassName('edit-event-minutes-input')[0]).value);*/
  }

  setNewEventHours(evt: Event): void{
    if(parseInt((<HTMLInputElement>evt.target).value) > 23){
      (<HTMLInputElement>evt.target).value = "23";
    }
    this.newEventDate.setHours( parseInt((<HTMLInputElement>evt.target).value) );
    this.eventToEdit.opsDate = new Date(this.newEventDate);
  }

  setNewEventMinutes(evt: Event): void{
    if(parseInt((<HTMLInputElement>evt.target).value) > 59){
      (<HTMLInputElement>evt.target).value = "59";
    }
    this.newEventDate.setMinutes( parseInt((<HTMLInputElement>evt.target).value) );
    this.eventToEdit.opsDate = new Date(this.newEventDate);
  }

  showNotes(evt: Event){
    let textArea = <HTMLTextAreaElement>(<HTMLElement>evt.target).parentNode.parentNode.children[1];
    if( (<HTMLElement>evt.target).nodeName === 'I' ){
      textArea = <HTMLTextAreaElement>(<HTMLElement>evt.target).parentNode.parentNode.parentNode.children[1];
    }
    if (textArea.classList.contains('hives-note-textarea-edit-active')) {
        textArea.classList.remove('hives-note-textarea-edit-active');
    } else {
      textArea.classList.add('hives-note-textarea-edit-active');
    }
  }

  saveNotes(evt: Event): void {
    const textArea = <HTMLTextAreaElement>evt.target;
    this.eventToEdit.description = textArea.value;
  }

  showTodo(evt: Event){
    let textArea = <HTMLTextAreaElement>(<HTMLElement>evt.target).parentNode.parentNode.parentNode.children[2].children[1];
    if (textArea.classList.contains('hives-todo-textarea-edit-active')) {
        textArea.classList.remove('hives-todo-textarea-edit-active');
    } else {
      textArea.classList.add('hives-todo-textarea-edit-active');
    }
  }

  saveTodo(evt: Event): void {
    const textArea = <HTMLTextAreaElement>evt.target;
    this.eventToEdit.todo = textArea.value;
  }


  addAlertList(): void {
    const alertDiv = (<HTMLElement>document.getElementsByClassName('edit-alert-choice-events')[0]);
    alertDiv.innerHTML = '';

    let alerts = this.melliFilters.alertsDisplay;
    let desc = <HTMLParagraphElement>document.getElementsByClassName('edit-alert-desc')[0];

    for(let i=0; i<alerts.length; i++){
      const button = document.createElement('button');
      button.className = 'hives-alert-edit ' + alerts[i].name;
      if(alerts[i].name === this.alertToEdit.icon){
        button.className += '-active';
        desc.innerHTML = this.translate.instant('MELLICHARTS.FILTERS.DISPLAY.' + this.alertToEdit.icon.toUpperCase());
      }
      button.onclick = (evt: Event) => {
        let t = i;
        this.hiveAlertButton(evt, alerts[t].name);
      }

      alertDiv.appendChild(button);
    }



  }

  setNewAlertDate(): void {
    (<HTMLInputElement>document.getElementsByClassName('edit-event-time-input')[0]).value = this.unitService.getDailyDate(this.newEventDate);
    this.alertToEdit.opsDate = this.newEventDate;
    (<HTMLInputElement>document.getElementsByClassName('edit-event-hours-input')[0]).disabled = false;
    (<HTMLInputElement>document.getElementsByClassName('edit-event-minutes-input')[0]).disabled = false;
  }

  setNewAlertHours(): void{
    this.newEventDate.setHours( parseInt((<HTMLInputElement>document.getElementsByClassName('edit-event-hours-input')[0]).value) );
    this.alertToEdit.opsDate = this.newEventDate;
  }

  setNewAlertMinutes(): void{
    this.newEventDate.setMinutes( parseInt((<HTMLInputElement>document.getElementsByClassName('edit-event-minutes-input')[0]).value) );
    this.alertToEdit.opsDate = this.newEventDate;
  }

  hiveAlertButton(evt: Event, name: string): void{
    let button = <HTMLButtonElement>evt.target;
    let desc = <HTMLParagraphElement>document.getElementsByClassName('edit-alert-desc')[0];
    const alertDiv = (<HTMLElement>document.getElementsByClassName('edit-alert-choice-events')[0]);
    if(button.className.includes('active')){
      button.className = button.className.slice(0, -7);
      desc.innerHTML = '';
      this.alertToEdit.icon = null;
      this.alertToEdit.code = null;
    }
    else{
      let index = Array.from(alertDiv.children).findIndex(_btn => _btn.className.includes('active'));
      if(index > -1){
        alertDiv.children[index].className = alertDiv.children[index].className.slice(0, -7);
      }
      desc.innerHTML = this.translate.instant('MELLICHARTS.FILTERS.DISPLAY.' + name.toUpperCase());
      this.alertToEdit.icon = name;
      let codeIndex = this.melliFilters.alertsDisplay.findIndex(_alt => _alt.name === name);
      this.alertToEdit.code = this.melliFilters.alertsDisplay[codeIndex].code;
      button.className += '-active'
    }
  }

  editBeeLevel(lvl: string): void{
    let index;
    switch(lvl){
      case 'low':
        (<HTMLInputElement>document.getElementById("edit_bees_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_bees_high_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_bees_none_check")).checked = false;
        index = this.eventToEdit.events.findIndex(_o => _o.name.includes("Normbees") || _o.name.includes("Highbees") || _o.name.includes("Nobees"));
        if(index > -1){
          this.eventToEdit.events.splice(index,1);
        }
        this.eventToEdit.events.push({name:'Lowbees', img:'lowbees_b.svg'});
        break;
      case 'avg':
        (<HTMLInputElement>document.getElementById("edit_bees_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_bees_high_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_bees_none_check")).checked = false;
        index = this.eventToEdit.events.findIndex(_o => _o.name.includes("Lowbees") || _o.name.includes("Highbees") || _o.name.includes("Nobees"));
        if(index > -1){
          this.eventToEdit.events.splice(index,1);
        }
        this.eventToEdit.events.push({name:'Normbees', img:'normbees_b.svg'});
        break;
      case 'high':
        (<HTMLInputElement>document.getElementById("edit_bees_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_bees_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_bees_none_check")).checked = false;
        index = this.eventToEdit.events.findIndex(_o => _o.name.includes("Normbees") || _o.name.includes("Lowbees") || _o.name.includes("Nobees"));
        if(index > -1){
          this.eventToEdit.events.splice(index,1);
        }
        this.eventToEdit.events.push({name:'Highbees', img:'highbees_b.svg'});
        break;
      case 'none':
        (<HTMLInputElement>document.getElementById("edit_bees_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_bees_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_bees_high_check")).checked = false;
        index = this.eventToEdit.events.findIndex(_o => _o.name.includes("Normbees") || _o.name.includes("Highbees") || _o.name.includes("Lowbees"));
        if(index > -1){
          this.eventToEdit.events.splice(index,1);
        }
        this.eventToEdit.events.push({name:'Nobees', img:'nobees_b.svg'});
        break;
    }
    return;
  }

  editBroodLevel(lvl: string){
    let index;
    switch(lvl){
      case 'low':
        (<HTMLInputElement>document.getElementById("edit_brood_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_brood_high_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_brood_none_check")).checked = false;
        index = this.eventToEdit.events.findIndex(_o => _o.name.includes("Normbrood") || _o.name.includes("Highbrood") || _o.name.includes("Nobrood"));
        if(index > -1){
          this.eventToEdit.events.splice(index,1);
        }
        this.eventToEdit.events.push({name:'Lowbrood', img:'lowbrood_b.svg'});
        break;
      case 'avg':
        (<HTMLInputElement>document.getElementById("edit_brood_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_brood_high_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_brood_none_check")).checked = false;
        index = this.eventToEdit.events.findIndex(_o => _o.name.includes("Lowbrood") || _o.name.includes("Highbrood") || _o.name.includes("Nobrood"));
        if(index > -1){
          this.eventToEdit.events.splice(index,1);
        }
        this.eventToEdit.events.push({name:'Normbrood', img:'normbrood_b.svg'});
        break;
      case 'high':
        (<HTMLInputElement>document.getElementById("edit_brood_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_brood_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_brood_none_check")).checked = false;
        index = this.eventToEdit.events.findIndex(_o => _o.name.includes("Normbrood") || _o.name.includes("Lowbrood") || _o.name.includes("Nobrood"));
        if(index > -1){
          this.eventToEdit.events.splice(index,1);
        }
        this.eventToEdit.events.push({name:'Highbrood', img:'highbrood_b.svg'});
        break;
      case 'none':
        (<HTMLInputElement>document.getElementById("edit_brood_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_brood_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_brood_high_check")).checked = false;
        index = this.eventToEdit.events.findIndex(_o => _o.name.includes("Normbrood") || _o.name.includes("Highbrood") || _o.name.includes("Lowbrood"));
        if(index > -1){
          this.eventToEdit.events.splice(index,1);
        }
        this.eventToEdit.events.push({name:'Nobrood', img:'nobrood_b.svg'});
        break;
    }
    return;
  }

  editResLevel(lvl: string): void{
    let index;
    switch(lvl){
      case 'low':
        (<HTMLInputElement>document.getElementById("edit_res_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_res_high_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_res_none_check")).checked = false;
        index = this.eventToEdit.events.findIndex(_o => _o.name.includes("Normres") || _o.name.includes("Highres") || _o.name.includes("Nores"));
        if(index > -1){
          this.eventToEdit.events.splice(index,1);
        }
        this.eventToEdit.events.push({name:'Lowres', img:'lowres_b.svg'});
        break;
      case 'avg':
        (<HTMLInputElement>document.getElementById("edit_res_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_res_high_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_res_none_check")).checked = false;
        index = this.eventToEdit.events.findIndex(_o => _o.name.includes("Lowres") || _o.name.includes("Highres") || _o.name.includes("Nores"));
        if(index > -1){
          this.eventToEdit.events.splice(index,1);
        }
        this.eventToEdit.events.push({name:'Normres', img:'normres_b.svg'});
        break;
      case 'high':
        (<HTMLInputElement>document.getElementById("edit_res_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_res_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_res_none_check")).checked = false;
        index = this.eventToEdit.events.findIndex(_o => _o.name.includes("Normres") || _o.name.includes("Lowres") || _o.name.includes("Nores"));
        if(index > -1){
          this.eventToEdit.events.splice(index,1);
        }
        this.eventToEdit.events.push({name:'Highres', img:'highres_b.svg'});
        break;
      case 'none':
        (<HTMLInputElement>document.getElementById("edit_res_low_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_res_avg_check")).checked = false;
        (<HTMLInputElement>document.getElementById("edit_res_high_check")).checked = false;
        index = this.eventToEdit.events.findIndex(_o => _o.name.includes("Normres") || _o.name.includes("Highres") || _o.name.includes("Lowres"));
        if(index > -1){
          this.eventToEdit.events.splice(index,1);
        }
        this.eventToEdit.events.push({name:'Nores', img:'nores_b.svg'});
        break;
    }
    return;
  }

}
