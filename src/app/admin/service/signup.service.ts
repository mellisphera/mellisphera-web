import { Injectable } from '@angular/core';
import { User } from '../../_model/user';
import { AuthService } from '../../auth/Service/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../../config';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class SignupService {

  user : User;

  constructor(private http : HttpClient) {
    this.user = { 
      id : null,
      createdAt : new Date(),
      login : { username:null,password:null},
      phone : null,
      email : null,
      connexions : null,
      lastConnection : null,
      fullName : null,
      position : null,
      country : null,
      city : null,
      levelUser : null, 
    }
  }

  signupUser(callback){
    this.http.post(CONFIG.URL+'/user/signup',this.user,httpOptions).subscribe(
      ()=>{},
      (err)=>{
        console.log(err);
      },
      ()=>{
        callback();
      }
    )
  }
}
