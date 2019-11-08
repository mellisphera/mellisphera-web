import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(public adminService: AdminService) { }

  ngOnInit() {
  }

  exeChangeLog(userId: string) {
    this.adminService.exeChangeLog(userId).subscribe(
      _res => {}
    );
  }
}
