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
    this.urlSlack = 'https://hooks.slack.com/services/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'
    this.notify = notifyService;
  }

  ngOnInit() {
    this.feedbackForm = this.formBuilder.group({
      'comment': [null, Validators.required]
    });
  }

  send() {
    const body = { 'text': this.userService.getUser() + ' : ' + this.feedbackForm.value.comment};
    console.log(body);
    this.httpClient.post(this.urlSlack, JSON.stringify(body)).subscribe(() => {}, () => {}, () => {
      this.notify.notify('success','Feedback sent');
    });
  }
}
