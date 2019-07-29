import { Component, OnInit, Renderer2, AfterViewChecked,HostListener  } from '@angular/core';
import { RucherService } from '../../../service/api/rucher.service';
import { ObservationService } from '../../../service/api/observation.service';
import { Subscription } from 'rxjs';
import { Observation } from '../../../../_model/observation';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RucheInterface } from '../../../../_model/ruche';
import { UserloggedService } from '../../../../userlogged.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit,AfterViewChecked {
  screenHeight:any;
  screenWidth:any;

  public hiveToMv: RucheInterface;
  private eltOnClickId: EventTarget;
  public typeToMv: number;
  public message: string;
  private selectHive: RucheInterface;
  public observationForm: FormGroup;
  private hiveIndex: number;
  public type: string;
  public noteDateTime: Date;
  private username: string;
  private notify: NotifierService;
  private subscribe: Subscription;
  private newObs: Observation;
  public updateRucherInput: boolean;
  public settings: any;
  private obsSubject: Subscription;
  public apiaryObs: Array<Observation>;
  constructor(public rucherService: RucherService,
    private notifyService: NotifierService,
    public observationService: ObservationService,
    private formBuilder: FormBuilder,
    private userService: UserloggedService,
    private renderer: Renderer2) {
      this.type = 'ApiaryObs';
      this.message = '';
      this.typeToMv = 0;
      this.notify = notifyService;
      this.eltOnClickId = null;
      this.getScreenSize();
  }

  ngOnInit() {
    this.initForm();
    this.observationService.setRange({ scale: 1, type: 'YEARS' });
    this.observationService.getObservationByIdApiary(this.rucherService.getCurrentApiary());
  }

  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.screenHeight = window.innerHeight;
          this.screenWidth = window.innerWidth;
    }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    const heightPicture = document.getElementById('cadre').offsetHeight;
    const heightRight = document.getElementById('graph').offsetHeight;
    if(this.screenWidth >990){
      document.getElementById('notesApiary').style.height = ''+(6 + heightRight - heightPicture) + 'px';
    }else{
      document.getElementById('notesApiary').style.height = ''+(40) + 'vh';
    }

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
    this.newObs.type = this.typeToMv === 0 ? 'HiveObs' : 'HiveAct';
    this.newObs.idApiary = null;
    this.newObs.idHive = this.hiveToMv.id;
    this.newObs.idLHive = new Array(this.hiveToMv.id);
    const index = this.observationService.observationsApiary.indexOf(this.newObs);
    this.observationService.updateObservation(this.newObs).subscribe(() => { }, () => { }, () => {
      this.observationService.observationsApiary.splice(index, 1);
      if(this.userService.getJwtReponse().country === "FR"){
        this.notify.notify('success', 'Note déplacée ' + this.hiveToMv.name);
      }else{
        this.notify.notify('success', 'Moved Note ' + this.hiveToMv.name);
      }
    });
  }
  /**
   *
   *
   * @memberof ApiaryNotesComponent
   */
  createObservation() {
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
      if(this.userService.getJwtReponse().country === "FR"){
        this.notify.notify('success', 'Note créée');
      }else{
        this.notify.notify('success', 'Created Note');
      }
    });
  }
  /**
   *
   *
   * @memberof ApiaryNotesComponent
   */
  onEditObservation() {
    const formValue = this.observationForm.value;
    this.newObs.sentence = formValue.sentence;
    this.newObs.date = formValue.date;
    const index = this.observationService.observationsApiary.indexOf(this.newObs);
    this.observationService.updateObservation(this.newObs).subscribe(() => { }, () => { }, () => {
      this.observationService.observationsApiary[index] = this.newObs;
      if(this.userService.getJwtReponse().country === "FR"){
        this.notify.notify('success', 'Note mis à jour');
      }else{
        this.notify.notify('success', 'Updated Note');
      }
    });
  }
  /**
   *
   *
   * @param {number} index
   * @param {Observation} obsApiary
   * @memberof ApiaryNotesComponent
   */
  deleteObs(index: number, obsApiary: Observation) {
    this.observationService.deleteObservation(obsApiary.id).subscribe(() => { }, () => { }, () => {
      this.observationService.observationsApiary.splice(index, 1);
      if(this.userService.getJwtReponse().country === "FR"){
        this.notify.notify('success', 'Note supprimée');
      }else{
        this.notify.notify('success', 'Deleted Note');
      }
    });
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
