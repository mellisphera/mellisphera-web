import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { CapteurInterface } from '../../../_model/capteur';

@Component({
  selector: 'app-global-status',
  templateUrl: './global-status.component.html',
  styleUrls: ['./global-status.component.css']
})
export class GlobalStatusComponent implements OnInit {

  constructor(public adminService: AdminService) { }

  ngOnInit() {
  }

}
