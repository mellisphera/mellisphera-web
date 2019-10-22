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
