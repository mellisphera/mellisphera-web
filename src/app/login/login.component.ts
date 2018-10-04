import { Component, OnInit,Input,Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../_model/user';
import { UserloggedService } from '../userlogged.service';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl, Validators ,ReactiveFormsModule,FormBuilder } from '@angular/forms';

import { UsersService } from '../auth/users.service';

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
  myform: FormGroup;
  users: User[];
  //loginForm: FormGroup;
  message : string;
 

  constructor(private formBuilder: FormBuilder,
              public router: Router,
              private data : UserloggedService,
              private usersServices : UsersService,
              private authService: AuthService) { 

    this.loginErrorMsg=false;

    this.myform = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', [Validators.required, Validators.minLength(3)]]
  });

    this.users =[
      {username: '***REMOVED***' ,pwd:'***REMOVED***'},
      {username: '***REMOVED***' ,pwd:'***REMOVED***'},
      {username: '***REMOVED***' ,pwd:'***REMOVED***'},
      {username: 'clo' ,pwd:'***REMOVED***'}
];

  }

/*  onSignIn(){
    //console.log(this.myform.value);
    localStorage.setItem('currentUser', JSON.stringify({ token: "jwt will come later", "user": this.myform.value})); 
    this.authService.signIn(this.myform.value); 
  }
  */

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
        this.router.navigate(['/position-Ruche']);
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
  }
  
  currentUser(){
    return JSON.parse(localStorage.getItem('currentUser'));
  }
  ngOnInit() {
    this.myform = new FormGroup({
         username: new FormControl(''),
         password: new FormControl('')
  })
  }
  goToDashboard(){
      console.log("holaaa!");
  }
  test(){
    
  }



}
