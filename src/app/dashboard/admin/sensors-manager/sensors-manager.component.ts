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

}
