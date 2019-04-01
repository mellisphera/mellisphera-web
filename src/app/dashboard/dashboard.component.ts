import { Component, OnInit } from '@angular/core';
import { UserloggedService } from '../userlogged.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  message: string;
  constructor(public login: UserloggedService) {
    this.message = '';
  }

  ngOnInit() {
  }

  receiveMessage($event) {
    this.message = $event;
  }
}
