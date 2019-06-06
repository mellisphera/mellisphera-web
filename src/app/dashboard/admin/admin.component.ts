import { ConnectionService } from './service/connection.service';
import { ConnectionsMapService } from './service/connections-map.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  message= "";

  constructor(private router: Router) {
    this.router.navigateByUrl('dashboard/admin/kpisynclog');
  }

  ngOnInit() {
  }

  receiveMessage($event) {
      this.message = $event;
  }

}
