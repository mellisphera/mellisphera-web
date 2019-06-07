import { ConnectionService } from './service/connection.service';
import { ConnectionsMapService } from './service/connections-map.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from './service/admin.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  message= "";
  private eltOnClick: EventTarget;
  constructor(private router: Router, 
    private adminService: AdminService,
    private renderer: Renderer2) {
    this.router.navigateByUrl('dashboard/admin/status');
  }

  ngOnInit() {
    this.eltOnClick = document.getElementById('status');
    this.renderer.addClass(this.eltOnClick, 'active');
  }

  receiveMessage($event) {
      this.message = $event;
  }
  focus(id: string) {
    console.log(id);
    if (this.eltOnClick === null ) {
      this.eltOnClick = document.getElementById(id);
      this.renderer.addClass(this.eltOnClick, 'active');
    } else {
      this.renderer.removeClass(this.eltOnClick, 'active');
      this.eltOnClick = document.getElementById(id);
      this.renderer.addClass(this.eltOnClick, 'active');
    }
  }

}
