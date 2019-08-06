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

import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-sensors-manager',
  templateUrl: './sensors-manager.component.html',
  styleUrls: ['./sensors-manager.component.css']
})
export class SensorsManagerComponent implements OnInit {

  constructor(public adminService: AdminService) { }

  ngOnInit() {
  }

  /**
   *
   *
   * @param {number} batteryLevel
   * @returns {string}
   * @memberof SensorsManagerComponent
   */
  getColorByBatLevel(batteryLevel: number): string {
    if (batteryLevel <= 50) {
      return 'red';
    } else if (batteryLevel <= 80) {
      return '#CAEA0D';
    } else {
      return '#07DE26';
    }
  }
}
