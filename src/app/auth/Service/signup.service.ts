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
      _id : null,
      createdAt : new Date(),
      email : null,
      username : null,
      password : null,
      connexions : null,
      role : null,
      lastConnection : null,
      fullName : null,
    }
  }

  signupUser(callback){
    this.http.post(CONFIG.URL + 'api/auth/signup', this.user, httpOptions).subscribe(
      () => {},
      (err) => {
        this.errSignup = true;
        console.log(err);
        this.errSignupLabel = err.message.split('>')[1];
      },
      () => {
        if (!this.errSignup) {
          callback();
        }
      }
    );
  }
}
