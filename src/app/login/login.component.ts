import { Component, OnInit,Input,Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { UserloggedService } from '../userlogged.service';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from '../auth/Service/auth.service';
import { FormGroup, FormControl, Validators ,ReactiveFormsModule,FormBuilder } from '@angular/forms';
import { Login } from '../_model/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginErrorMsg: boolean;
  //@Output() messageEvent = new EventEmitter<string>();
  
  users : Login[];

  public username;
  public password;
  myform: FormGroup;
  //loginForm: FormGroup;
  message : string;
 

  constructor(private formBuilder: FormBuilder,
              public router: Router,
              private data : UserloggedService,
              public authService: AuthService) { 

    this.loginErrorMsg=false;

    this.myform = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', [Validators.required, Validators.minLength(3)]]
  });

  }

  ngOnInit() {
    if(this.authService.isAuthenticated){
      this.router.navigate(['/position-Ruche']);
    }
    this.myform = new FormGroup({
         username: new FormControl(''),
         password: new FormControl('')
  })
  }


/*  onSignIn(){
    //console.log(this.myform.value);
    localStorage.setItem('currentUser', JSON.stringify({ token: "jwt will come later", "user": this.myform.value})); 
    this.authService.signIn(this.myform.value); 
  }
  */

  verifLogin(){
    console.log(this.authService.login);
    this.authService.signIn();
  }
  
  currentUser(){
    return JSON.parse(localStorage.getItem('currentUser'));
  }
  goToDashboard(){
      console.log("holaaa!");
  }
  test(){
    
  }



}
