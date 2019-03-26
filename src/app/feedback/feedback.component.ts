import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserloggedService } from '../userlogged.service';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../auth/Service/auth.service';

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
    private notifyService: NotifierService,
    private authService: AuthService) {
      if (this.authService.jwtReponse.country) {
        if (this.authService.jwtReponse.country.toUpperCase() === 'FR'){
          this.urlSlack = 'https://hooks.slack.com/services/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';
        } else {
          this.urlSlack = 'https://hooks.slack.com/services/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';
        }
      }
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
    });
    this.notify.notify('success', 'Feedback sent');
  }
}
