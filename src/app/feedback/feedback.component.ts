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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserloggedService } from '../userlogged.service';
import { NotifierService } from 'angular-notifier';
<<<<<<< HEAD
import { CONFIG } from 'src/config';
=======
import { CONFIG } from '../../constants/config';
import { TranslateService } from '@ngx-translate/core';
>>>>>>> release/2.0

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  private urlSlack: string;
  public feedbackForm: FormGroup;
  private notify: NotifierService;
  constructor(private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private userService: UserloggedService,
    private notifyService: NotifierService) {
<<<<<<< HEAD
      if (this.userService.getCountry()) {
        if (this.userService.getCountry().toUpperCase() === 'FR') {
          this.urlSlack = CONFIG.SLACK_FR;
        } else {
          this.urlSlack = CONFIG.SLACK_EN;
        }
      } else {
        this.urlSlack = CONFIG.SLACK_EN;
      }
=======
    this.urlSlack = CONFIG.SLACK;
>>>>>>> release/2.0
    this.notify = notifyService;
  }

  ngOnInit() {
    this.initForm();
  }

  /**
   *
   *
   * @returns {string}
   * @memberof FeedbackComponent
   */
  getUrlLoginByLang(): string {
    if (this.translateService.currentLang === 'fr') {
      return CONFIG.SLACK_LOGIN_FR;
    } else {
      return CONFIG.SLACK_LOGIN_EN;
    }
  }
  send() {
    const body = { 'text': this.userService.getUser() + ' : ' + this.feedbackForm.value.comment};
    this.httpClient.post(this.urlSlack, JSON.stringify(body)).subscribe();
    if(this.translateService.currentLang === 'fr'){
      this.notify.notify('success', 'Commentaire envoyé');
    } else {
      this.notify.notify('success', 'Feedback sent');
    }
    this.resForm();
  }

  resForm() {
    this.feedbackForm.reset();
  }
  initForm() {
    this.feedbackForm = this.formBuilder.group({
      'comment': [null, Validators.required]
    });
  }
}
