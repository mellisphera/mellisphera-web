import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserloggedService } from '../userlogged.service';
import { NotifierService } from 'angular-notifier';

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
          this.urlSlack = '***REMOVED***';
        } else {
          this.urlSlack = '***REMOVED***';
        }
      } else {
        this.urlSlack = '***REMOVED***';
      }
    this.notify = notifyService;
  }

  ngOnInit() {
    this.initForm();
  }

  send() {
    const body = { 'text': this.userService.getUser() + ' : ' + this.feedbackForm.value.comment};
    this.httpClient.post(this.urlSlack, JSON.stringify(body)).subscribe();
    this.notify.notify('success', 'Feedback sent');
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
