import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder) {
    this.urlSlack = 'https://hooks.slack.com/services/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'
  }

  ngOnInit() {
    this.feedbackForm = this.formBuilder.group({
      'comment': [null, Validators.required]
    });
  }

  send() {
    const body = { text: this.feedbackForm.value};
    console.log(body);
    this.httpClient.post<any>(this.urlSlack, body, httpOptions).subscribe((data) => {
      console.log(data);
    });
  }
}
