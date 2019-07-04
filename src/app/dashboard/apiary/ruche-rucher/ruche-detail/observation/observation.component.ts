import { MyDate } from '../../../../../class/MyDate';
import { NotifierService } from 'angular-notifier';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { RucherService } from '../../../../service/api/rucher.service';
import { Ruche } from '../../ruche';
import { RucheDetailService } from '../ruche.detail.service';
import { ProcessReport } from '../../processedReport';
import { DailyRecordsWService } from '../service/daily-records-w.service';
import { ActivatedRoute } from '@angular/router';
import { DailyStockHoneyService } from '../service/daily-stock-honey.service';
import { RecordService } from '../service/Record/record.service';
import { ObservationService } from './service/observation.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RucheService } from '../../../../service/api/ruche.service';
import { Observation } from '../../../../../_model/observation';
import { Console } from '@angular/core/src/console';
import { UserParamsService } from '../../../../preference-config/service/user-params.service';
import { d } from '@angular/core/src/render3';
import { UserloggedService } from '../../../../../userlogged.service';
import { MyNotifierService } from '../../../../service/my-notifier.service';
import { NotifList } from '../../../../../../constants/notify';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.css']
})
export class ObservationComponent implements OnInit {

  ObservationForm: FormGroup;
  radioObs: boolean;
  typeAjout: any;
  private newObs: Observation;
  private notifier: NotifierService;
  typeObs: boolean;
  optionsDate = {
    weekday: 'short', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric',
  };

  //observationsHive : ProcessReport[] = [];
  constructor(public rucherService: RucherService,
    private formBuilder: FormBuilder,
    private myNotifer: MyNotifierService,
    public observationService: ObservationService,
    private rucheService: RucheService,
    private notifyService: NotifierService,
    public userParamService: UserParamsService,
    public userService: UserloggedService
  ) {
    this.typeObs = false;
    this.notifier = notifyService;
    this.initForm();
  }

  ngOnInit() {
  }


  initForm() {
    const defautDate = new Date();
    // defautDate.setUTCHours(new Date().getHours());
    this.ObservationForm = this.formBuilder.group({
      'sentence': [null, Validators.compose([Validators.required])],
      'type': 'HiveObs',
      'date': new Date()
    });
  }

  createObservation() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.idUsername)) {
      const formValue = this.ObservationForm.value;
      this.newObs = formValue;
      this.newObs.type = 'HiveObs';
      this.newObs.idHive = this.rucheService.getCurrentHive();
      this.newObs.idLHive = [this.rucheService.getCurrentHive()];
      this.ObservationForm.reset();
      this.observationService.createObservation(this.newObs).subscribe((obs) => {
        this.observationService.observationsHive.push(obs);
        this.observationService.observationsHive.sort((a: Observation, b: Observation) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      }, () => { }, () => {
        this.observationService.emitHiveSubject();
        this.initForm();
        if(this.userService.getJwtReponse().country === "FR"){
          this.notifier.notify('success', 'Observation créée');
        }else{
          this.notifier.notify('success', 'Created Observation');
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_NOTES_HIVE);
    }
  }
  createAction() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.idUsername)) {
      const formValue = this.ObservationForm.value;
      this.newObs = formValue;
      this.newObs.type = 'HiveAct';
      this.newObs.idHive = this.rucheService.getCurrentHive();
      this.newObs.idLHive = [this.rucheService.getCurrentHive()];
      this.ObservationForm.reset();
      this.observationService.createObservation(this.newObs).subscribe((obs) => {
        this.observationService.observationsHive.push(obs);
        this.observationService.observationsHive.sort((a: Observation, b: Observation) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      }, () => { }, () => {
        this.observationService.emitHiveSubject();
        if(this.userService.getJwtReponse().country === "FR"){
          this.notifier.notify('success', 'Action créée');
        }else{
          this.notifier.notify('success', 'Created Action');
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_NOTES_HIVE);
    }
  }
  onSelectObsR(hiveOBS) {
    this.newObs = hiveOBS;
    const donnée = {
      sentence: this.newObs.sentence,
      type: this.newObs.type,
      date: new Date(this.newObs.date)
    };;
    this.ObservationForm.setValue(donnée);
  }

  onEditObservation() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.idUsername)) {
      const formValue = this.ObservationForm.value;
      this.newObs.sentence = formValue.sentence;
      this.newObs.date = formValue.date;
      this.newObs.type = formValue.type;
      const index = this.observationService.observationsHive.indexOf(this.newObs);
      this.initForm();
      this.observationService.updateObservation(this.newObs).subscribe(() => { }, () => { }, () => {
        this.observationService.observationsHive[index] = this.newObs;
        this.observationService.emitHiveSubject();
        if(this.userService.getJwtReponse().country === "FR"){
          this.notifier.notify('success', 'Note mis à jour');
        }else{
          this.notifier.notify('success', 'Updated Note');
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_NOTES_HIVE);
    }
  }
  deleteObsR(index: number, hiveObs: Observation) {
    if (this.userService.checkWriteObject(this.rucherService.rucher.idUsername)) {
      this.observationService.deleteObservation(hiveObs.id).subscribe(() => { }, () => { }, () => {
        this.observationService.observationsHive.splice(index, 1);
        this.observationService.emitHiveSubject();
        if(this.userService.getJwtReponse().country === "FR"){
          this.notifier.notify('success', 'Note supprimée');
        }else{
          this.notifier.notify('success', 'Deleted Note');
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_NOTES_HIVE);
    }
  }
  resetObservationForm() {
    this.ObservationForm.get('sentence').reset();
  }
}
