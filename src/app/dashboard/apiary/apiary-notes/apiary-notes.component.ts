import { Component, OnInit } from '@angular/core';
import { RucherService } from '../../service/api/rucher.service';
import { ObservationService } from '../ruche-rucher/ruche-detail/observation/service/observation.service';
import { Subscription } from 'rxjs';
import { Observation } from '../../../_model/observation';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RucheInterface } from '../../../_model/ruche';
import { UserloggedService } from '../../../userlogged.service';
import { MyNotifierService } from '../../service/my-notifier.service';
import { NotifList } from '../../../../constants/notify';

@Component({
  selector: 'app-apiary-notes',
  templateUrl: './apiary-notes.component.html',
  styleUrls: ['./apiary-notes.component.css']
})
export class ApiaryNotesComponent implements OnInit {

  public hiveToMv: RucheInterface;
  public typeToMv: number;
  public message: string;
  public observationForm: FormGroup;
  public type: string;
  public noteDateTime: Date;
  private newObs: Observation;
  public updateRucherInput: boolean;
  public settings: any;
  private notify: NotifierService;
  public apiaryObs: Array<Observation>;
  constructor(public rucherService: RucherService,
    private myNoitifier: MyNotifierService,
    private notiferService: NotifierService,
    public observationService: ObservationService,
    private formBuilder: FormBuilder,
    public userService: UserloggedService) {
      this.type = 'ApiaryObs';
      this.notify = notiferService;
      this.message = '';
      this.typeToMv = 0;
  }

  ngOnInit() {
    this.initForm();
    this.observationService.setRange({ scale: 1, type: 'YEARS' });
    this.observationService.getObservationByIdApiary(this.rucherService.getCurrentApiary());
  }

  loadObservation() {

  }

  /**
   *
   *
   * @param {Observation} obs
   * @memberof ApiaryNotesComponent
   */
  onSelectObs(obs: Observation) {
    this.hiveToMv = this.rucherService.rucheService.ruches[0];
    this.newObs = obs;
    const donnée = {
      sentence: this.newObs.sentence,
      date: new Date(obs.date)
    };
    this.observationForm.setValue(donnée);
  }

  /**
   *
   *
   * @memberof ApiaryNotesComponent
   */
  mvToActions() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.idUsername)) {
      this.newObs.type = this.typeToMv === 0 ? 'HiveObs' : 'HiveAct';
      this.newObs.idApiary = null;
      this.newObs.idHive = this.hiveToMv.id;
      this.newObs.idLHive = new Array(this.hiveToMv.id);
      const index = this.apiaryObs.indexOf(this.newObs);
      this.observationService.updateObservation(this.newObs).subscribe(() => { }, () => { }, () => {
        this.observationService.observationsApiary.splice(index, 1);
        if(this.userService.getJwtReponse().country === "FR"){
          this.notify.notify('success', 'Note déplacée ' + this.hiveToMv.name);
        }else{
          this.notify.notify('success', 'Moved Note ' + this.hiveToMv.name);
        }
      });
    } else {
      this.myNoitifier.sendWarningNotif(NotifList.AUTH_WRITE_NOTES)
    }
  }
  /**
   *
   *
   * @memberof ApiaryNotesComponent
   */
  createObservation() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.idUsername)) {
      const formValue = this.observationForm.value;
      this.newObs = formValue;
      this.newObs.idApiary = this.rucherService.rucher.id;
      this.newObs.type = 'ApiaryObs';
      console.log(this.newObs);
      this.initForm();
      this.observationService.createObservation(this.newObs).subscribe((obs) => {
        this.observationService.observationsApiary.push(obs);
        this.observationService.observationsApiary.sort((a: Observation, b: Observation) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      }, () => { }, () => {
         if (this.userService.getJwtReponse().country === "FR"){
          this.notify.notify('success', 'Note créée');
        }else{
          this.notify.notify('success', 'Created Note');
        }
      });
    } else {
      this.myNoitifier.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }
  /**
   *
   *
   * @memberof ApiaryNotesComponent
   */
  onEditObservation() {

    if (this.userService.checkWriteObject(this.rucherService.rucher.idUsername)) {
      const formValue = this.observationForm.value;
      this.newObs.sentence = formValue.sentence;
      this.newObs.date = formValue.date;
      const index = this.apiaryObs.indexOf(this.newObs);
      this.observationService.updateObservation(this.newObs).subscribe(() => { }, () => { }, () => {
        this.observationService.observationsApiary[index] = this.newObs;
         if(this.userService.getJwtReponse().country === "FR"){
          this.notify.notify('success', 'Note mis à jour');
        }else{
          this.notify.notify('success', 'Updated Note');
        }
      });
    } else {
      this.myNoitifier.sendWarningNotif(NotifList.AUTH_WRITE_NOTES)
    }
  }
  /**
   *
   *
   * @param {number} index
   * @param {Observation} obsApiary
   * @memberof ApiaryNotesComponent
   */
  deleteObs(index: number, obsApiary: Observation) {

    if (this.userService.checkWriteObject(this.rucherService.rucher.idUsername)) {
      this.observationService.deleteObservation(obsApiary.id).subscribe(() => { }, () => { }, () => {
        this.observationService.observationsApiary.splice(index, 1);
         if(this.userService.getJwtReponse().country === "FR"){
          this.notify.notify('success', 'Note supprimée');
        }else{
          this.notify.notify('success', 'Deleted Note');
        }
      });
    } else {
      this.myNoitifier.sendWarningNotif(NotifList.AUTH_WRITE_NOTES)
    }
  }
  /**
   *
   *
   * @memberof ApiaryNotesComponent
   */
  initForm() {
    this.observationForm = this.formBuilder.group({
      'sentence': [null, Validators.compose([Validators.required])],
      'date': new Date(),
    });
  }
  /**
   *
   *
   * @memberof ApiaryNotesComponent
   */
  cancelUpdateRucher() {
    this.updateRucherInput = false;
    this.initForm();
  }
  receiveMessage($event) {
    this.message = $event;
  }


}
