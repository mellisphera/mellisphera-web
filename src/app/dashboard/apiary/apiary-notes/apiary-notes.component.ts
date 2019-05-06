import { RucherService } from '../../service/rucher.service';
import { RucheService } from '../../service/ruche.service';
import { UserloggedService } from '../../../userlogged.service';
import { MyDate } from '../../../class/MyDate';
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RucheInterface } from '../../../_model/ruche';
import { Observation } from '../../../_model/observation';
import { ObservationService } from '../ruche-rucher/ruche-detail/observation/service/observation.service';
import { UserParamsService } from '../../preference-config/service/user-params.service';

@Component({
  selector: 'app-apiary-notes',
  templateUrl: './apiary-notes.component.html',
  styleUrls: ['./apiary-notes.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiaryNotesComponent implements OnInit {

  public hiveToMv: RucheInterface;
  public typeToMv: number;
  message: string;
  private selectHive: RucheInterface;
  observationForm: FormGroup;
  private hiveIndex: number;
  type: string;
  public noteDateTime: Date;
  private username: string;
  private notify: NotifierService;
  private newObs: Observation;
  updateRucherInput: boolean;
  public settings: any;
  constructor(private notifyService: NotifierService,
    private userService: UserloggedService,
    public rucherService: RucherService,
    private formBuilder: FormBuilder,
    public observationService: ObservationService,
    public userParams: UserParamsService) {
    this.username = userService.getUser();
    this.type = 'ApiaryObs';
    this.message = '';
    this.typeToMv = 0;
    this.notify = notifyService;
  }

  ngOnInit() {
    this.observationService.setRange({scale: 1, type: 'YEAR'});
    this.initForm();
    if (!this.observationService.obsApiarySubject.closed) {
      this.observationService.getObservationByIdApiary(this.rucherService.getCurrentApiary());
    }
  }

  /**
   *
   *
   * @param {Date} date
   * @returns {Date}
   * @memberof ApiaryNotesComponent
   */
  getLocalDate(date: Date): string{
    let dt = new Date(date);
    return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
  }
  onSelectObs(obs: Observation) {
    this.hiveToMv = this.rucherService.rucheService.ruches[0];
    this.newObs = obs;
    const donnée = {
      sentence: this.newObs.sentence,
      date: new Date(obs.date)
    };
    this.observationForm.setValue(donnée);
  }

  mvToActions() {
    this.newObs.type = this.typeToMv === 0 ? 'HiveObs' : 'HiveAct';
    this.newObs.idApiary = null;
    this.newObs.idHive = this.hiveToMv.id;
    this.newObs.idLHive = new Array(this.hiveToMv.id);
    const index = this.observationService.observationsApiary.indexOf(this.newObs);
    this.observationService.updateObservation(this.newObs).subscribe(() => { }, () => { }, () => {
      this.observationService.observationsApiary.splice(index, 1);
      this.observationService.emitApiarySubject();
      this.notify.notify('success', 'Moved Note ' + this.hiveToMv.name);
    });
  }
  createObservation() {
    const formValue = this.observationForm.value;
    this.newObs = formValue;
    this.newObs.idApiary = this.rucherService.rucher.id;
    this.newObs.type = 'ApiaryObs';
    this.initForm();
    this.observationService.createObservation(this.newObs).subscribe((obs) => {
      this.observationService.observationsApiary.push(obs);
    }, () => { }, () => {
      this.observationService.emitApiarySubject();
      this.notify.notify('success', 'Created Note');
    });
  }
  onEditObservation() {
    const formValue = this.observationForm.value;
    this.newObs.sentence = formValue.sentence;
    this.newObs.date = formValue.date;
    const index = this.observationService.observationsApiary.indexOf(this.newObs);
    this.observationService.updateObservation(this.newObs).subscribe(() => { }, () => { }, () => {
      this.observationService.observationsApiary[index] = this.newObs;
      this.observationService.emitApiarySubject();
      this.notify.notify('success', 'Updated Note');
    });
  }
  deleteObs(index: number, obsApiary: Observation) {
    this.observationService.deleteObservation(obsApiary.id).subscribe(() => { }, () => { }, () => {
      this.observationService.observationsApiary.splice(index, 1);
      this.observationService.emitApiarySubject();
      this.notify.notify('success', 'Deleted Note');
    });
  }
  initForm() {
    this.observationForm = this.formBuilder.group({
      'sentence': [null, Validators.compose([Validators.required])],
      'date': new Date(),
    });
  }
  cancelUpdateRucher() {
    this.updateRucherInput = false;
    this.initForm();
  }
  receiveMessage($event) {
    this.message = $event;
  }

}
