/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RucherModel } from '../../_model/rucher-model';
import { RucherService } from '../service/api/rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { RucheInterface } from '../../_model/ruche';
import { CapteurInterface } from '../../_model/capteur';
import { CapteurService } from '../service/api/capteur.service';
import { FleurObservees } from '../../_model/fleur-observees';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit, OnDestroy {

  title = 'wizard';
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
  private newFlower: FleurObservees;

  constructor(private formBuilder: FormBuilder,
    private rucherService: RucherService,
    private userService: UserloggedService,
    private capteurService: CapteurService,
    private render: Renderer2,
    public translateService: TranslateService) {
    }

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
      'sensorRef': [null, Validators.compose(
        [Validators.required, Validators.pattern(this.paternRef)])
      ]
    });
}

  subApiary() {
    this.apiary = this.apiaryForm.value;
    this.apiary.createDate = new Date();
    this.apiary.username = this.userService.getUser();
    if (this.userService.getJwtReponse().country === "FR") {
      this.apiary.photo = './assets/imageClient/background_draw_color_FR.png';
    } else {
      this.apiary.photo = './assets/imageClient/background_draw_color.png';
    }
    this.apiary.userId = this.userService.getIdUserLoged()
  }

  subHive() {
    this.hive = this.hiveForm.value;
    this.hive.id = null;
    this.hive.userId = this.userService.getIdUserLoged();
    this.hive.sensor = true;
    this.hive.username = this.userService.getUser();

  }
  subSensor() {
    this.sensor = this.sensorForm.value;
    this.sensor.apiaryName = this.apiary.name;
    this.sensor.type = this.getTypeFromRef(this.sensor.sensorRef);
    this.sensor.apiaryName = this.apiary.name;
    this.sensor.hiveName = this.hive.name;
    this.sensor.username = this.userService.getUser();
    this.capteurService.capteur = this.sensor;
/*     this.capteurService.createCapteur().subscribe(() => { }, () => { }, () => {
      this.capteurService.getUserCapteurs();
    }); */
  }

  addFlower(flower: string, event: MouseEvent) {
    this.render.addClass(event.target, 'flower-active');
/*     this.newFlower.nom = flower;
    this.newFlower.dateDebutd = 
    this.newFlower.dateFind = fleur.flowerApi.flomaxd;
    this.newFlower.dateThDebutd = fleur.flowerApi.flomind;
    this.newFlower.dateThFind = fleur.flowerApi.flomaxd;
    this.newFlower.dateThDebutdate = fleur.flowerApi.flomindate;
    this.newFlower.dateThFindate = fleur.flowerApi.flomaxdate;
    this.newFlower.presence = "";
    this.newFlower.username = this.userService.currentUser().username;
    this.newFlower.photo = fleur.photo; */
  }

  cancel() {
    this.userService.setWizardActive(false);
  }

  finishWizard() {
    this.rucherService.createRucher(this.apiary).subscribe((apiary) => {
      if (this.rucherService.ruchers != null) {
        this.rucherService.allApiaryAccount.push(apiary);
        this.rucherService.ruchers.push(apiary);
      } else {
        this.rucherService.ruchers = new Array(apiary);
        this.rucherService.allApiaryAccount.push(apiary)
      }
      this.rucherService.saveCurrentApiaryId(apiary._id);
    }, () => { }, () => {
      this.rucherService.emitApiarySubject();
      this.rucherService.rucher = this.rucherService.ruchers[this.rucherService.ruchers.length - 1];
      this.initForm();
      this.hive.idApiary = this.rucherService.getCurrentApiary();
      this.rucherService.rucheService.createRuche(this.hive).subscribe((hive) => {
        this.rucherService.rucheService.ruches = new Array(hive);
        this.rucherService.rucheService.saveCurrentHive(hive);
      }, () => { }, () => {
        this.rucherService.rucheService.emitHiveSubject();
        this.sensor.idHive = this.rucherService.rucheService.getCurrentHive().id;
        this.sensor.idApiary = this.rucherService.getCurrentApiary();
        this.capteurService.createCapteur().subscribe(() => { }, () => { }, () => {
          this.capteurService.getUserCapteurs();
          this.userService.setWizardActive(false);
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
    if (parseInt(ref, 10) === 41) {
      return 'T2';
    } else if (parseInt(ref, 10) === 42) {
      return 'T_HR';
    } else if (parseInt(ref, 10) === 43) {
      return 'WEIGHT';
    } else {
      return 'ALIEN';
    }
  }

  ngOnDestroy(): void {
    this.wrapper.classList.remove('wizard-active');
    this.mainPanel.classList.remove('wizard-z-index');
    this.sidebar.classList.remove('wizard-z-index');
  }
}
