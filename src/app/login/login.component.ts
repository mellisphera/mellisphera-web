import { Component, OnInit,Input,Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { user } from '../_model/user';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { UserloggedService } from '../userlogged.service';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginErrorMsg: boolean;
  //@Output() messageEvent = new EventEmitter<string>();
  
  public username;
  public password;
  users: user[];
  loginForm: FormGroup;
  message : string;
 

  constructor(public router: Router, private data : UserloggedService) { 
    this.loginErrorMsg=false;
    this.users =[
      {username: 'jcp' ,pwd:'apis123'},
      {username: 'blg' ,pwd:'apis123'},
      {username: 'jhe' ,pwd:'apis123'},
      {username: 'clo' ,pwd:'apis123'}
];

  }

  login(username,password){

  if(username==null || password==null){
    console.log("verifiez vos identifiants");
    this.loginErrorMsg=true;
    this.password='';
    this.username='';
  }
  else if(username!=null || password!=null){
    this.users.forEach( element => {
      if(element.username== username && element.pwd==password){
        this.router.navigate(['/accueil']);
        this.data.changeMessage(username);
        //localStorage.setItem('currentUser',username);
        localStorage.setItem('currentUser', JSON.stringify({ token: "jwt will come later", username: username}));
        
      }
      else{
        console.log("login ou mdp incorrecte");
        this.loginErrorMsg=true;
        this.password='';
        this.username='';
      }
    })
  }
//  console.log('Name:' + this.loginForm.get('name').value);
  }
  currentUser(){
    return JSON.parse(localStorage.getItem('currentUser'));
  }
  ngOnInit() {
    this.loginForm = new FormGroup({
         username: new FormControl('Username'),
         password: new FormControl('pwd')
  })

  }
  goToDashboard(){
      console.log("holaaa!");
  }
  test(){
    
  }



}
