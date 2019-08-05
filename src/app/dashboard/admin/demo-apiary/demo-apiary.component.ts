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
import { RucherModel } from '../../../_model/rucher-model';
import { MyNotifierService } from '../../service/my-notifier.service';
import { NotifList } from '../../../../constants/notify';

@Component({
  selector: 'app-demo-apiary',
  templateUrl: './demo-apiary.component.html',
  styleUrls: ['./demo-apiary.component.css']
})
export class DemoApiaryComponent implements OnInit {


  public nameDemoAPiary: string;
  constructor(public adminService: AdminService, private myNotifer: MyNotifierService) {
/*     this.adminService.getDemoApiary().subscribe(
      (apiary: RucherModel) => {
        this.nameDemoAPiary = apiary.name;
      }
    ) */
  }

  ngOnInit() {
  }

  /**
   *
   *
   * @memberof DemoApiaryComponent
   */
  updateName(): void {
    this.adminService.updateDemoApiaryName(this.nameDemoAPiary).subscribe(
      () => {}, () => {}, () => {
        this.myNotifer.sendSuccessNotif(NotifList.CHANGE_NAME_DEMO_APIARY);
      }
    )
  }

}
