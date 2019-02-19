import { Component, OnInit,Input,Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { UserloggedService } from '../../userlogged.service';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from '../Service/auth.service';
import { FormGroup, FormControl, Validators ,ReactiveFormsModule,FormBuilder } from '@angular/forms';
import { Login } from '../../_model/login';
import { SignupService } from '../../admin/service/signup.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formLogin : boolean;
  loginErrorMsg: boolean;
  //@Output() messageEvent = new EventEmitter<string>();
  
  users : Login[];

  public username;
  public password;
  myform: FormGroup;
  //loginForm: FormGroup;
  message : string;
 

  signupForm : FormGroup;
  success : boolean;
  constructor(private formBuilder: FormBuilder,
              public router: Router,
              private data : UserloggedService,
              public authService: AuthService,
              public signupService : SignupService) { 

    this.loginErrorMsg=false;
    this.formLogin = true;
    this.myform = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
  });

  }

  ngOnInit() {
    this.innitForm();
    if(this.authService.isAuthenticated){
      this.router.navigate(['/home']);
    }
    this.myform = new FormGroup({
         username: new FormControl(''),
         password: new FormControl('')
  })
  }

  innitForm(){
    this.signupForm = this.formBuilder.group({
      'email':[null,Validators.required],
      'username': [null,Validators.required],
      'password':[null,Validators.compose([
        ,Validators.minLength(6),
        Validators.required
      ])]
    });
  }
  receiveMessage($event){
      this.message=$event;
  }
  signup(){
    if(this.signupForm.valid){
      const data = this.signupForm.value;
      this.signupService.user = data;
      this.signupService.user.role = new Array<string>('ROLE_STANDARD');
      console.log(this.signupService.user);
      this.signupService.user.createdAt = new Date();
      this.signupService.signupUser(()=>{
        this.authService.login.username = this.signupService.user.username;
        this.authService.login.password = this.signupService.user.password;
        this.authService.signIn();
        this.success = true;
        this.innitForm();
        setTimeout(()=>{
          this.success = false;
        },1000);
      });
    }
  }
  verifLogin() {
    this.authService.login.username = this.authService.login.username.toUpperCase();
    console.log(this.authService.login )
    this.authService.signIn();
  }
  currentUser(){
    return JSON.parse(localStorage.getItem('currentUser'));
  }
  goToDashboard(){
  }
  test(){
    
  }



}
