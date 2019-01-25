import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../auth/Service/auth.service';
import { SharingHives } from '../../../_model/sharing-hives';
import { CONFIG } from '../../../../config';
import { Ruche } from '../../disposition-ruche/ruche';
import { RucheInterface } from '../../../_model/ruche';
import { User } from '../../../_model/user';
import { RucheService } from '../../disposition-ruche/Service/ruche.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SharingService {

  sharingHive : SharingHives;
  constructor(private http : HttpClient, private authService : AuthService, private rucheService : RucheService) {
    //this.getSharringHiveByUser()
  }

  getSharringHiveByUser(){
    this.http.get<SharingHives>(CONFIG.URL+'share/user/'+this.authService.user.id).subscribe(
      (data)=>{
        this.sharingHive = data;
      },
      (err)=>{
        console.log(err);
      },
      ()=>{}
    );
  }

  addSharing(userTarget : String, hive : RucheInterface, username : User){
    console.log(username);
    this.http.get<Boolean>(CONFIG.URL+'share/sharing/'+username.login.username+'/'+hive.id+'/'+userTarget).subscribe(
      (data)=>{
        console.log(data);
      },
      (err)=>{
        console.log(err);
      },
      ()=>{
        this.rucheService.getRucheByApiary(username.login.username,window.sessionStorage.getItem("currentApiary"));
      }
    )
  }
}
///sharing/{userShare}/{idHive}/{userTarget}"