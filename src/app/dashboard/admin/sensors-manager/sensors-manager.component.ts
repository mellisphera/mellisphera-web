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
