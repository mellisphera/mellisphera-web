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

import { Component, OnInit } from '@angular/core';
import { ObservationService } from '../../service/api/observation.service';
import { UserloggedService } from '../../../userlogged.service';
import { RucherService } from '../../service/api/rucher.service';
import { RucheService } from '../../service/api/ruche.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observation } from '../../../_model/observation';
import { MyNotifierService } from '../../service/my-notifier.service';
import { NotifierService } from 'angular-notifier';
import { NotifList } from '../../../../constants/notify';
import { RucheInterface } from '../../../_model/ruche';
import { RucherModel } from '../../../_model/rucher-model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-notes',
  templateUrl: './manage-notes.component.html',
  styleUrls: ['./manage-notes.component.css']
})
export class ManageNotesComponent implements OnInit {

  observationSearch: string;
  observationSearch1: string;
  NoteForm: FormGroup;
  newObs: Observation;
  private notifier: NotifierService;
  hiveNoteSelect: RucheInterface;
  hivesNoteForm: RucheInterface[];
  newNoteCheckbox: boolean;
  editNoteCheckbox: boolean;
  editNoteCheckbox2: boolean;
  noteToEdit: Observation;
  apiaryToEdit: RucherModel;
  noteInitialList: string;
  noteNewList: string;

  newNoteType: string;
  constructor(
    public observationService: ObservationService,
    private userService: UserloggedService,
    public rucherService: RucherService,
    private translateService: TranslateService,
    public rucheService: RucheService,
    private formBuilder: FormBuilder,
    private myNotifer: MyNotifierService,
    private notifyService: NotifierService
  ) {
    this.notifier = notifyService;
    this.initForm();
  }

  ngOnInit() {
    this.observationService.getObservationByUserId(this.userService.getIdUserLoged()).subscribe(_notes => {
      this.rucherService.rucherSubject.subscribe(() => { }, () => { }, () => {
        this.observationService.observationsApiaryUser = (_notes.filter(note => note.type === 'apiary')).sort((a, b) => {
          return this.getApiaryNameByID(a.apiaryId).localeCompare(this.getApiaryNameByID(b.apiaryId));
        });
      });
      this.rucheService.getHiveByUserId(this.userService.getUser()).subscribe(ruches => {
        this.rucheService.ruchesAllApiary = ruches;
        this.observationService.observationsHiveUser = (_notes.filter(note => (note.type === 'hive') || (note.typeInspect === 'HiveAct'))).sort((a, b) => {
          return this.getHiveNameById(a.hiveId).localeCompare(this.getHiveNameById(b.hiveId));
        });
      });
    });
  }

  // getObservationsByApiary(apiaryId : string) : any[]{
  //   return ((this.observationService.observationsUser.filter(_note => (_note.apiaryId === apiaryId) || (this.getapiaryIdByHive(_note.hiveId) === apiaryId))));
  // }

  // getapiaryIdByHive(hiveId: string): string {
  //   if (this.rucheService.ruchesAllApiary.filter(hive => hive.id === hiveId)[0] !== undefined) {
  //     return (this.rucheService.ruchesAllApiary.filter(hive => hive.id === hiveId)[0].apiaryId);
  //   } else {
  //     return ('');
  //   }
  // }

  getHiveNameById(hiveId: string): string {
    if (this.rucheService.ruchesAllApiary.filter(hive => hive._id === hiveId)[0] !== undefined) {
      return (this.rucheService.ruchesAllApiary.filter(hive => hive._id === hiveId)[0].name);
    } else {
      return '';
    }
  }

  getApiaryNameByID(apiaryId: string): string {
    if (this.rucherService.ruchers.filter(apiary => apiary._id === apiaryId)[0] !== undefined) {
      return (this.rucherService.ruchers.filter(apiary => apiary._id === apiaryId)[0].name);
    } else {
      return '';
    }
  }

  getType(type: string): string {
    return type === 'HiveObs' ? 'Observation' : 'Action';
  }

  sortObservations(HiveOrApiary: string, colonne: string) {
    if (HiveOrApiary === 'apiary') {
      switch (colonne) {
        case 'date':
          this.observationService.observationsApiaryUser.sort((b, a) => {
            return new Date(a.createDate).getTime() - new Date(b.createDate).getTime();
          });
          break;
        case 'apiary':
          this.observationService.observationsApiaryUser.sort((a, b) => {
            return this.getApiaryNameByID(a.apiaryId).localeCompare(this.getApiaryNameByID(b.apiaryId));
          });
          break;
        case 'note':
          this.observationService.observationsApiaryUser.sort((a, b) => {
            return a.description.localeCompare(b.description);
          });
          break;
      }
    } else {
      switch (colonne) {
        case 'date':
          this.observationService.observationsHiveUser.sort((b, a) => {
            return new Date(a.createDate).getTime() - new Date(b.createDate).getTime();
          });
          break;
        case 'type':
          this.observationService.observationsHiveUser.sort((a, b) => {
            return a.typeInspect.localeCompare(b.typeInspect);
          });
          break;
        case 'hive':
          this.observationService.observationsHiveUser.sort((a, b) => {
            return this.getHiveNameById(a.hiveId).localeCompare(this.getHiveNameById(b.hiveId));
          });
          break;
        case 'note':
          this.observationService.observationsHiveUser.sort((a, b) => {
            return a.description.localeCompare(b.description);
          });
          break;
      }
    }
  }

  // ###############################################################
  // ###############################################################
  // ###################      CRUD     ###################
  // ###############################################################
  // ###############################################################

  initForm() {
    const defautDate = new Date();
    // defautDate.setUTCHours(new Date().getHours());
    this.NoteForm = this.formBuilder.group({
      'sentence': [null, Validators.compose([Validators.required])],
      'type': ['HiveObs', Validators.required],
      'date': new Date(),
      'checkbox': ['apiary', Validators.required],
    });
  }

  resetNoteForm() {
    this.NoteForm.get('sentence').reset();
  }

  // ###################      CREATE      ###################

  newNoteInit() {
    // Apiary init
    this.rucherService.rucherSelectUpdate = this.rucherService.rucher;

    // Hive init
    this.rucherService.rucheService.getHiveByUserId(this.userService.getUser()).subscribe(ruches => {
      this.rucherService.rucheService.ruchesAllApiary = ruches;
      this.hivesNoteForm = this.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === this.rucherService.rucherSelectUpdate._id);
      if (this.hivesNoteForm.length !== 0) {
        this.hiveNoteSelect = this.hivesNoteForm[0];
      }
    })
  }

  onSelectApiaryNewNoteForm() {
    // init hive
    this.hivesNoteForm = this.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === this.rucherService.rucherSelectUpdate._id);
    if (this.hivesNoteForm.length !== 0) {
      this.hiveNoteSelect = this.hivesNoteForm[0];
    }
  }

  onchangeCheckbox(event) {
    this.newNoteCheckbox = (event.target.value === 'hive');
  }

  createObservation() {
    if (this.userService.checkWriteObject(this.rucherService.rucherSelectUpdate.userId)) {
      const formValue = this.NoteForm.value;
      this.newObs = formValue;
      this.newObs.typeInspect = 'HiveObs';
      this.newObs.type = 'hive';
      this.newObs.opsDate = formValue.date;
      this.newObs.createDate = new Date();
      this.newObs.description = formValue.sentence;
      this.newObs.hiveId = this.hiveNoteSelect._id;
      this.newObs.userId = this.userService.getIdUserLoged();
      this.NoteForm.reset();
      this.observationService.createObservation(this.newObs).subscribe((obs) => {
        this.observationService.observationsHive.push(obs);
        this.observationService.observationsHive.sort((a: Observation, b: Observation) => {
          return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
        });
        this.observationService.observationsHiveUser.push(obs);
        this.observationService.observationsHiveUser.sort((a, b) => {
          return this.getHiveNameById(a.hiveId).localeCompare(this.getHiveNameById(b.hiveId));
        });
      }, () => { }, () => {
        this.initForm();
        this.newNoteCheckbox = false;
        if (this.translateService.currentLang === 'fr') {
          this.notifier.notify('success', 'Observation créée');
        } else {
          this.notifier.notify('success', 'Created Observation');
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }

  createAction() {
    if (this.userService.checkWriteObject(this.rucherService.rucherSelectUpdate.userId)) {
      const formValue = this.NoteForm.value;
      this.newObs = formValue;
      this.newObs.typeInspect = 'HiveAct';
      this.newObs.hiveId = this.hiveNoteSelect._id;
      this.newObs.description = formValue.sentence;
      this.newObs.type = 'hive';
      this.newObs.opsDate = formValue.date;
      this.newObs.createDate = new Date();
      this.newObs.userId = this.userService.getIdUserLoged();
      this.NoteForm.reset();
      this.observationService.createObservation(this.newObs).subscribe((obs) => {
        this.observationService.observationsHive.push(obs);
        this.observationService.observationsHive.sort((a: Observation, b: Observation) => {
          return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
        });
        this.observationService.observationsHiveUser.push(obs);
        this.observationService.observationsHiveUser.sort((a, b) => {
          return this.getHiveNameById(a.hiveId).localeCompare(this.getHiveNameById(b.hiveId));
        });
      }, () => { }, () => {
        this.initForm();
        this.newNoteCheckbox = false;
        if (this.translateService.currentLang === 'fr') {
          this.notifier.notify('success', 'Action créée');
        } else {
          this.notifier.notify('success', 'Created Action');
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }

  createNote() {
    if (this.userService.checkWriteObject(this.rucherService.rucherSelectUpdate.userId)) {
      const formValue = this.NoteForm.value;
      this.newObs = formValue;
      this.newObs.typeInspect = 'ApiaryObs';
      this.newObs.type = 'hive';
      this.newObs.opsDate = formValue.date;
      this.newObs.description = formValue.sentence;
      this.newObs.createDate = new Date();
      this.newObs.apiaryId = this.rucherService.rucherSelectUpdate._id;
      this.newObs.userId = this.userService.getIdUserLoged();
      this.NoteForm.reset();
      this.observationService.createObservation(this.newObs).subscribe((obs) => {
        this.observationService.observationsApiary.push(obs);
        this.observationService.observationsApiary.sort((a: Observation, b: Observation) => {
          return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
        });
        this.observationService.observationsApiaryUser.push(obs);
        this.observationService.observationsApiaryUser.sort((a, b) => {
          return this.getApiaryNameByID(a.apiaryId).localeCompare(this.getApiaryNameByID(b.apiaryId));
        });
      }, () => { }, () => {
        this.initForm();
        this.newNoteCheckbox = false;
        if (this.translateService.currentLang === 'fr') {
          this.notifier.notify('success', 'Note créée');
        } else {
          this.notifier.notify('success', 'Created Note');
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }

  // ###################      EDIT      ###################

  onchangeCheckbox1Edit(event) {
    this.editNoteCheckbox = (event.target.value === 'hive');
  }

  onchangeCheckbox2Edit(event) {
    this.editNoteCheckbox2 = (event.target.value === 'HiveAct');
  }

  editNoteInit(note: Observation) {
    this.noteToEdit = note;

    if (this.noteToEdit.typeInspect === 'ApiaryObs') {
      const donnée = {
        sentence: this.noteToEdit.description,
        type: 'HiveObs',
        date: new Date(this.noteToEdit.createDate),
        checkbox: 'apiary'
      };
      this.NoteForm.setValue(donnée);
      this.editNoteCheckbox = false;
      this.noteInitialList = 'apiary';
    } else {
      const donnée = {
        sentence: this.noteToEdit.description,
        type: this.noteToEdit.typeInspect,
        date: new Date(this.noteToEdit.createDate),
        checkbox: 'hive'
      };
      this.NoteForm.setValue(donnée);
      this.editNoteCheckbox = true;
      this.noteInitialList = 'hive';
    }

    this.rucherService.rucheService.getHiveByUserId(this.userService.getUser()).subscribe(ruches => {
      this.rucherService.rucheService.ruchesAllApiary = ruches;
      // Apiary init
      if (this.noteToEdit.typeInspect === 'ApiaryObs') {
        this.rucherService.rucherSelectUpdate = this.rucherService.ruchers.filter(apiary => apiary._id === this.noteToEdit.apiaryId)[0];
      } else {
        let apiaryId = this.rucheService.ruchesAllApiary.filter(hive => hive._id === this.noteToEdit.hiveId)[0].apiaryId;
        this.rucherService.rucherSelectUpdate = this.rucherService.ruchers.filter((apiary: RucherModel) => apiary._id === apiaryId)[0];
      }
      this.apiaryToEdit = this.rucherService.rucherSelectUpdate;
      // Hive init
      this.hivesNoteForm = this.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === this.rucherService.rucherSelectUpdate._id);
      if (this.noteToEdit.typeInspect === 'ApiaryObs') {
        if (this.hivesNoteForm.length !== 0) {
          this.hiveNoteSelect = this.hivesNoteForm[0];
        }
      } else {
        this.hiveNoteSelect = this.rucheService.ruchesAllApiary.filter(hive => hive._id === this.noteToEdit.hiveId)[0];
      }
    })
  }

  onSelectApiaryEditNoteForm() {
    // init hive
    this.hivesNoteForm = this.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === this.rucherService.rucherSelectUpdate._id);
    if (this.hivesNoteForm.length !== 0) {
      this.hiveNoteSelect = this.hivesNoteForm[0];
    }
  }

  editNote() {
    if (this.userService.checkWriteObject(this.apiaryToEdit.userId)) {
      const formValue = this.NoteForm.value;
      this.noteToEdit.description = formValue.sentence;
      this.noteToEdit.createDate = formValue.date;
      this.noteToEdit.typeInspect = formValue.type;
      this.noteNewList = this.NoteForm.value.checkbox;
      if (this.NoteForm.value.checkbox === 'apiary') {
        this.noteToEdit.typeInspect = 'ApiaryObs';
        this.noteToEdit.apiaryId = this.rucherService.rucherSelectUpdate._id;
        this.noteToEdit.hiveId = '';
      } else {
        this.noteToEdit.apiaryId = '';
        this.noteToEdit.hiveId = this.hiveNoteSelect._id;
      }
      this.noteToEdit.userId = this.userService.getIdUserLoged();
      this.NoteForm.reset();
      this.observationService.updateObservation(this.noteToEdit).subscribe(() => { }, () => { }, () => {
        // If the note switch from apiary to hive note
        if (this.noteInitialList === 'apiary' && this.noteNewList !== 'apiary') {
          // delete note from apiary note lists
          let index = this.observationService.observationsApiary.indexOf(this.noteToEdit);
          this.observationService.observationsApiary.splice(index, 1);
          index = this.observationService.observationsApiaryUser.indexOf(this.noteToEdit);
          this.observationService.observationsApiaryUser.splice(index, 1);
          // Create the note on hive note lists
          this.observationService.observationsHive.push(this.noteToEdit);
          this.observationService.observationsHive.sort((a: Observation, b: Observation) => {
            return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
          });
          this.observationService.observationsHiveUser.push(this.noteToEdit);
          this.observationService.observationsHiveUser.sort((a, b) => {
            return this.getHiveNameById(a.hiveId).localeCompare(this.getHiveNameById(b.hiveId));
          });
          // If the note switch from hive to apiary note
        } else if (this.noteInitialList === 'hive' && this.noteNewList === 'apiary') {
          // Create the note on apiary note lists
          this.observationService.observationsApiary.push(this.noteToEdit);
          this.observationService.observationsApiary.sort((a: Observation, b: Observation) => {
            return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
          });
          this.observationService.observationsApiaryUser.push(this.noteToEdit);
          this.observationService.observationsApiaryUser.sort((a, b) => {
            return this.getApiaryNameByID(a.apiaryId).localeCompare(this.getApiaryNameByID(b.apiaryId));
          });
          // delete note from hive note lists
          let index = this.observationService.observationsHive.indexOf(this.noteToEdit);
          this.observationService.observationsHive.splice(index, 1);
          index = this.observationService.observationsHiveUser.indexOf(this.noteToEdit);
          this.observationService.observationsHiveUser.splice(index, 1);
          // If the note don't switch
        } else {
          // Edit the note on lists
          if (this.NoteForm.value.checkbox === 'apiary') {
            let index = this.observationService.observationsApiary.indexOf(this.noteToEdit);
            this.observationService.observationsApiary[index] = this.noteToEdit;
            this.observationService.observationsApiary.sort((a: Observation, b: Observation) => {
              return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
            });
            index = this.observationService.observationsApiaryUser.indexOf(this.noteToEdit);
            this.observationService.observationsApiaryUser[index] = this.noteToEdit;
            this.observationService.observationsApiaryUser.sort((a, b) => {
              return this.getApiaryNameByID(a.apiaryId).localeCompare(this.getApiaryNameByID(b.apiaryId));
            });
          } else {
            let index = this.observationService.observationsHive.indexOf(this.noteToEdit);
            this.observationService.observationsHive[index] = this.noteToEdit;
            this.observationService.observationsHive.sort((a: Observation, b: Observation) => {
              return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
            });
            index = this.observationService.observationsHiveUser.indexOf(this.noteToEdit);
            this.observationService.observationsHiveUser[index] = this.noteToEdit;
            this.observationService.observationsHiveUser.sort((a, b) => {
              return this.getHiveNameById(a.hiveId).localeCompare(this.getHiveNameById(b.hiveId));
            });
          }
        }
        this.initForm();
        this.editNoteCheckbox = false;
        if (this.translateService.currentLang === 'fr') {
          this.notifier.notify('success', 'Note modifiée');
        } else {
          this.notifier.notify('success', 'Edited Note');
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }

  // ###################      DELETE      ###################

  deleteNote(note: Observation) {
    if (this.userService.checkWriteObject(note.userId)) {
      this.observationService.deleteObservation(note._id).subscribe(() => { }, () => { }, () => {
        // Delete an apiary note
        if(note.typeInspect === 'ApiaryObs'){
          let index = this.observationService.observationsApiary.indexOf(note);
          this.observationService.observationsApiary.splice(index, 1);
          index = this.observationService.observationsApiaryUser.indexOf(note);
          this.observationService.observationsApiaryUser.splice(index, 1);
        // Delete a hive note
        }else{
          let index = this.observationService.observationsHive.indexOf(note);
          this.observationService.observationsHive.splice(index, 1);
          index = this.observationService.observationsHiveUser.indexOf(note);
          this.observationService.observationsHiveUser.splice(index, 1);
        }
        if (this.translateService.currentLang === 'fr') {
          this.notifier.notify('success', 'Note supprimée');
        } else {
          this.notifier.notify('success', 'Deleted Note');
        }
      });
    } else {
    this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }

}
