import { Injectable } from '@angular/core';
import { User } from '../../_model/user';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../../constants/config';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class SignupService {

  user:User;
  errSignup:boolean;
  errSignupLabel : string;

  constructor(private http: HttpClient) {
    this.errSignup = false;
    this.user = {
      id : null,
      createdAt : new Date(),
      login : { email: null, password: null},
      phone : null,
      email : null,
      username : null,
      password : null,
      connexions : null,
      role : null,
      lastConnection : null,
      fullName : null,
      position : null,
      country : null,
      city : null,
      levelUser : null,
    }
  }

  signupUser(callback){
    this.http.post(CONFIG.URL + 'api/auth/signup', this.user, httpOptions).subscribe(
      () => {},
      (err) => {
        this.errSignup = true;
        console.log(err);
        this.errSignupLabel = err.error.message.split('->')[1];
      },
      () => {
        if (!this.errSignup) {
          callback();
        }
      }
    );
  }
}
