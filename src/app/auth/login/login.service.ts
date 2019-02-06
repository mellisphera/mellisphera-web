import { Injectable } from '@angular/core';
import { Login } from '../../_model/login';

@Injectable()
export class LoginService {
  
  
  login : Login;

  constructor() {
    this.login = { username : "", password : ""};
  }

}
