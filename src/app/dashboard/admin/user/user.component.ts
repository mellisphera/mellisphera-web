import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { AtokenStorageService } from '../../../auth/Service/atoken-storage.service';
import { UserloggedService } from '../../../userlogged.service';
import { RucherService } from '../../service/api/rucher.service';
import { RucheService } from '../../service/api/ruche.service';
import { AlertsService } from '../../service/api/alerts.service';
import { DeviceStatusService } from '../../service/api/device-status.service';
import { FitnessService } from '../../service/api/fitness.service';
import { Router } from '@angular/router';
import { CapteurService } from '../../service/api/capteur.service';
import { SocketService } from '../../service/socket.service';
import { HubService } from '../../service/api/hub.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(public adminService: AdminService, 
    private tokenService: AtokenStorageService,
    private userService: UserloggedService,
    private rucherService: RucherService,
    private alertService: AlertsService,
    private rucheService: RucheService,
    private socketService: SocketService,
    private hubService: HubService,
    private deviceStatusService: DeviceStatusService,
    private fitnessService: FitnessService,
    private capteurService: CapteurService,
    private router: Router) { }

  ngOnInit() {
    if (this.adminService.allUsers.length < 1) {
      this.adminService.getAllUsers().subscribe(
        _user => {
          this.adminService.allUsers = _user;
        }
      )
    }
  }

  exeChangeLog(userId: string) {
    this.adminService.exeChangeLog(userId).subscribe(
      _res => {}
    );
  }

  loadData(userId: string) {
    this.socketService.loadDataRequest(userId);
  }

  loginFromAdmin(userId: string) {
    const jwtAdmin: string = this.tokenService.getToken();
    const authority = this.tokenService.getAuthorities();
    this.adminService.signinFromUserId(userId).subscribe(
      _res => {
        _res.accessToken = jwtAdmin;
        _res.authorities = authority;
        console.log(_res);
        this.tokenService.saveToken(jwtAdmin);
        this.tokenService.saveAuthorities(authority);
        this.userService.setJwtReponse(_res);
        console.log(this.tokenService.getAuthorities());
        this.rucherService.getApiaryByUser(this.userService.getIdUserLoged());
        this.alertService.callInitRequest();
        this.rucheService.callHiveRequest();
        this.deviceStatusService.callRequest(this.userService.getIdUserLoged());
        this.fitnessService.callRequest(this.userService.getIdUserLoged());
        this.capteurService.getUserCapteurs();
        this.hubService.callRequest(this.userService.getIdUserLoged());
      }, () => {}, () => {
        this.router.navigateByUrl('dashboard/home/info-apiary');
      }
    )
  }
}
