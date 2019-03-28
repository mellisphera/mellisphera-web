import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RucherModel } from '../../../../_model/rucher-model';
import { CONFIG } from '../../../../../config';
import { UserloggedService } from '../../../../userlogged.service';
import { RucherService } from '../../../apiary/ruche-rucher/rucher.service';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-dialog-apiary',
  templateUrl: './dialog-apiary.component.html',
  styleUrls: ['./dialog-apiary.component.css']
})
export class DialogApiaryComponent implements OnInit {

  public rucherForm: FormGroup;
  public photoApiary: File;
  public hasBaseDropZoneOver: Boolean = false;
  public updateStatus: boolean;
  public newApiary: RucherModel;
  private notifier: NotifierService;
  constructor(
    public dialogRef: MatDialogRef<DialogApiaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private userService: UserloggedService,
    private rucherService: RucherService,
    public notifierService: NotifierService
  ) {
    this.notifier = this.notifierService;
    this.newApiary = {
      id: null,
      latitude: '',
      longitude: '',
      name: '',
      description: '',
      createdAt: null,
      photo: 'void',
      username: '',
      codePostal: '',
      ville: ''
    };
    console.log(this.data);
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.rucherForm = this.formBuilder.group({
      'name': [null, Validators.compose([Validators.required])],
      'description': [null],
      'ville': [null, Validators.compose([Validators.required])],
      'codePostal': [null, Validators.compose([Validators.required])],
      'validate': ``,
    });
  }

  close() {
    this.rucherForm.reset();
    this.dialogRef.close();
  }

  apiarySubmit() {
    const formValue = this.rucherForm.value;
    if (this.photoApiary == null) {
      this.newApiary.photo = CONFIG.URL_FRONT + 'assets/imageClient/testAccount.png';
    }
    this.newApiary.id = null;
    this.newApiary.description = formValue.description;
    this.newApiary.name = formValue.name;
    this.newApiary.ville = formValue.ville;
    this.newApiary.codePostal = formValue.codePostal;
    this.newApiary.createdAt = new Date();
    this.newApiary.username = this.userService.getUser();
    this.initForm();
    this.rucherService.createRucher(this.newApiary).subscribe((apiary) => {
      if (this.rucherService.ruchers != null) {
        this.rucherService.ruchers.push(apiary);
      } else {
        this.rucherService.ruchers = new Array(apiary);
      }
      this.rucherService.saveCurrentApiaryId(apiary.id);
    }, () => { }, () => {
      console.log(this.rucherService.ruchers);
      this.rucherService.emitApiarySubject();
      this.rucherService.rucheService.getRucheByApiary(this.rucherService.getCurrentApiary());
      this.rucherService.rucher = this.rucherService.ruchers[this.rucherService.ruchers.length - 1];
      this.notifier.notify('success', 'Created Apiary');
      this.photoApiary = null;
      this.dialogRef.close();
    });
  }
}
