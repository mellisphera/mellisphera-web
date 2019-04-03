import { ConnectionService } from './service/connection.service';
import { ConnectionsMapService } from './service/connections-map.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  message= "";

  constructor(public connectionMap: ConnectionsMapService, public connectionService: ConnectionService) {
  }

  ngOnInit() {
    this.connectionService.getConnection().subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err);
      }
    );

  }

  receiveMessage($event) {
      this.message = $event;
  }

}
