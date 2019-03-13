import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RucherModel } from '../../_model/rucher-model';
import { RucherService } from '../../apiary/ruche-rucher/rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { RucheInterface } from '../../_model/ruche';
import { CapteurInterface } from '../../_model/capteur';
import { CapteurService } from '../../capteur/capteur.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit, OnDestroy {

  private wrapper: Element;
  private mainPanel: Element;
  private sidebar: Element;


  public apiaryForm: FormGroup;
  public sensorForm: FormGroup;
  public hiveForm: FormGroup;
  private paternRef: RegExp;

  private hive: RucheInterface;
  private apiary: RucherModel;
  private sensor: CapteurInterface;

  constructor(private formBuilder: FormBuilder,
    private rucherService: RucherService,
    private userService: UserloggedService,
    private capteurService: CapteurService) { }

  ngOnInit() {
    this.paternRef = /[4][0-3]\:([a-z]|[A-Z]|[0-9])([A-Z]|[0-9]|[a-z])\:([A-Z]|[a-z]|[0-9])([a-z]|[A-Z]|[0-9])$/;
    this.initForm();
    this.wrapper = document.getElementsByClassName('wrapper')[0];
    this.mainPanel = document.getElementsByClassName('main-panel')[0]
    this.sidebar = document.getElementsByClassName('sidebar')[0];

    this.wrapper.classList.add('wizard-active');
    this.mainPanel.classList.add('wizard-z-index');
    this.sidebar.classList.add('wizard-z-index');
  }


  initForm() {
    this.apiaryForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'ville': [null, Validators.required],
      'codePostal': [null, Validators.required]
    });
    this.hiveForm = this.formBuilder.group({
      'name': [null, Validators.required]
    });
    this.sensorForm = this.formBuilder.group({
      'reference': [null, Validators.compose(
        [Validators.required, Validators.pattern(this.paternRef)])
      ]
    });
}

  subApiary() {
    this.apiary = this.apiaryForm.value;
    this.apiary.createdAt = new Date();
    this.apiary.username = this.userService.getUser();
/*     this.rucherService.createRucher(this.apiary).subscribe((apiary) => {
      if (this.rucherService.ruchers != null) {
        this.rucherService.ruchers.push(apiary);
      } else {
        this.rucherService.ruchers = new Array(apiary);
      }
      this.rucherService.saveCurrentApiaryId(apiary.id);
    }, () => { }, () => {
      console.log(this.rucherService.ruchers);
      this.rucherService.emitApiarySubject();
      this.rucherService.rucher = this.rucherService.ruchers[this.rucherService.ruchers.length - 1];
      this.initForm();
    }); */
  }

  subHive() {
    this.hive = this.hiveForm.value;
    this.hive.id = null;
    this.hive.username = this.userService.getUser();
   // this.initForm();
/*     this.rucherService.rucheService.createRuche(this.hive).subscribe((hive) => {
      this.rucherService.rucheService.ruches.push(hive);
      this.rucherService.rucheService.saveCurrentHive(hive.id);
    }, () => { }, () => {
      console.log(this.rucherService.rucheService.ruches);
      this.rucherService.rucheService.emitHiveSubject();
    }); */
  }
  subSensor() {
    this.sensor = this.sensorForm.value;
    this.sensor.apiaryName = this.apiary.name;
    this.sensor.type = this.getTypeFromRef(this.sensor.reference);
    this.sensor.idHive = this.rucherService.rucheService.getCurrentHive();
    this.sensor.apiaryName = this.apiary.name;
    this.sensor.hiveName = this.apiary.name;
    this.sensor.username = this.userService.getUser();
    this.capteurService.capteur = this.sensor;
/*     this.capteurService.createCapteur().subscribe(() => { }, () => { }, () => {
      this.capteurService.getUserCapteurs();
    }); */
  }

  finishWizard() {
    this.rucherService.createRucher(this.apiary).subscribe((apiary) => {
      if (this.rucherService.ruchers != null) {
        this.rucherService.ruchers.push(apiary);
      } else {
        this.rucherService.ruchers = new Array(apiary);
      }
      this.rucherService.saveCurrentApiaryId(apiary.id);
    }, () => { }, () => {
      console.log(this.rucherService.ruchers);
      this.rucherService.emitApiarySubject();
      this.rucherService.rucher = this.rucherService.ruchers[this.rucherService.ruchers.length - 1];
      this.initForm();
      this.hive.idApiary = this.rucherService.getCurrentApiary();
      console.log(this.rucherService.getCurrentApiary());
      this.rucherService.rucheService.createRuche(this.hive).subscribe((hive) => {
        this.rucherService.rucheService.ruches.push(hive);
        this.rucherService.rucheService.saveCurrentHive(hive.id);
      }, () => { }, () => {
        console.log(this.rucherService.rucheService.ruches);
        this.rucherService.rucheService.emitHiveSubject();
        this.sensor.idApiary = this.rucherService.getCurrentApiary();
        this.capteurService.createCapteur().subscribe(() => { }, () => { }, () => {
          this.capteurService.getUserCapteurs();
          this.userService.setWizardActive();
        });
      });
    });
  }

  /**
   * @param {string} sensorRef
   * @returns {string}
   * @memberof WizardComponent
   */
  getTypeFromRef(sensorRef: string): string {
    const ref = sensorRef.split(':')[0];
    if (parseInt(ref, 10) === 41){
      return 'T2';

    } else if (parseInt(ref, 10) === 42) {
      return 'T_HR';
    } else {
      return 'weight';
    }
  }

  ngOnDestroy(): void {
    this.wrapper.classList.remove('wizard-active');
    this.mainPanel.classList.remove('wizard-z-index');
    this.sidebar.classList.remove('wizard-z-index');
  }
}
