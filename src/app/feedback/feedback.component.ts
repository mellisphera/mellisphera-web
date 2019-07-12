import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserloggedService } from '../userlogged.service';
import { NotifierService } from 'angular-notifier';
import { CONFIG } from 'src/config';

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
    private userService: UserloggedService,
    private notifyService: NotifierService) {
      if (this.userService.getCountry()) {
        if (this.userService.getCountry().toUpperCase() === 'FR') {
          this.urlSlack = CONFIG.SLACK_FR;
        } else {
          this.urlSlack = CONFIG.SLACK_EN;
        }
      } else {
        this.urlSlack = CONFIG.SLACK_EN;
      }
    this.notify = notifyService;
  }

  ngOnInit() {
    this.initForm();
  }

  send() {
    const body = { 'text': this.userService.getUser() + ' : ' + this.feedbackForm.value.comment};
    this.httpClient.post(this.urlSlack, JSON.stringify(body)).subscribe();
    if(this.userService.getJwtReponse().country === "FR"){
      this.notify.notify('success', 'Commentaire envoyé');
    }else{
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
