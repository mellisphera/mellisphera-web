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
    this.adminService.getDemoApiary().subscribe(
      (apiary: RucherModel) => {
        this.nameDemoAPiary = apiary.name;
      }
    )
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
