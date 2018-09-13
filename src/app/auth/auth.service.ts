import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs";
import { Observable } from 'rxjs';
import { UsersService } from './users.service';

import { User } from '../_model/user';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../config';

@Injectable()
export class AuthService {

 public users;
  showLoginErrMsg : boolean;
  //private _showNavBar = new BehaviorSubject<boolean>(null);
  public showNavBarEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  private authenticated = false;

  constructor(private router: Router, 
              private usersService: UsersService) {}

  signIn(user: User) {
         //load users
    this.usersService.getUsers().subscribe(
        data => { this.users = data},
        err => console.error(err),
        () => console.log('done loading users')
      );

      this.users.forEach(element => {
        console.log("user : "+ user.username);
        if(element.username==user.username && element.pwd==user.pwd){       
//          localStorage.setItem('currentUser', JSON.stringify({ token: "jwt will come later", username: user.username}));         
//         this.router.navigate(['/accueil']);
        
        }
        else
        this.showLoginErrMsg=true;
      });

/*
    if ((user.username === 'nizar' || user.password === 'nizar') 
      && user.password === 'nizar'){
      this.authenticated = true;
      this.showNavBar(true);
      this.router.navigate(['/accueil']);
    } else {
      this.authenticated = false;
    }
*/

  }
  

  logout() {
    this.authenticated = false;
    this.showNavBar(false);
    this.router.navigate(['/']);
  }

 

  isAuthenticated() {
    return this.authenticated;
  }

  private showNavBar(ifShow: boolean) {
     this.showNavBarEmitter.emit(ifShow);
  }
}
