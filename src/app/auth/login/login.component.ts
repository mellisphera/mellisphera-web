import { NotifierService } from 'angular-notifier';
import { Component, OnInit, Input, Output, EventEmitter, AfterContentInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserloggedService } from '../../userlogged.service';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from '../Service/auth.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Login } from '../../_model/login';
import { SignupService } from '../Service/signup.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterContentInit, OnDestroy {

  formLogin: boolean;
  loginErrorMsg: boolean;
  resetPassword: boolean;
  //@Output() messageEvent = new EventEmitter<string>();

  users: Login[];

  public username: string;
  public password: string;
  public emailForReset: string;
  myform: FormGroup;
  //loginForm: FormGroup;
  message: string;


  signupForm: FormGroup;
  success: boolean;
  private readonly notif: NotifierService;
  constructor(private formBuilder: FormBuilder,
    public router: Router,
    private data: UserloggedService,
    public authService: AuthService,
    public signupService: SignupService,
    private notifier: NotifierService) {

    this.resetPassword = false;
    this.loginErrorMsg = false;
    this.formLogin = true;
    this.notif = notifier;
    this.myform = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });

  }

  ngOnInit() {
    this.innitForm();
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/home']);
    }
    this.myform = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    })
  }

  ngAfterContentInit(): void {
    document.querySelector('body').className = 'login';
  }

  innitForm() {
    this.signupForm = this.formBuilder.group({
      'email': [null, Validators.required],
      'password': [null, Validators.compose([
        , Validators.minLength(6),
        Validators.required
      ])]
    });
  }
  receiveMessage($event) {
    this.message = $event;
  }
  signup() {
    if (this.signupForm.valid) {
      const data = this.signupForm.value;
      this.signupService.user = data;
      this.signupService.user.username = this.signupService.user.email.split('@')[0];
      this.signupService.user.role = new Array<string>('ROLE_STANDARD');
      this.signupService.user.createdAt = new Date();
      this.signupService.signupUser(() => {
        this.authService.login.email = this.signupService.user.email;
        this.authService.login.password = this.signupService.user.password;
        this.notif.notify('success', 'Sign up successful !');
        this.success = true;
        this.innitForm();
        setTimeout(() => {
          this.success = false;
          this.authService.signIn();
        }, 250);
      });
    }
  }
  verifLogin() {
    this.authService.signIn();
  }

  activeReset() {
    this.formLogin = !this.formLogin;
    this.resetPassword = !this.resetPassword
  }
  currentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser'));
  }

  ngOnDestroy(): void {
    document.querySelector('body').classList.remove('login');
  }

  sendMail() {
    this.authService.resetPassword(this.emailForReset).subscribe(
      () => {}, () => {}, () => {
        this.notif.notify('success', 'You have received an email with a new password');
        this.activeReset();
      }
    );
  }
}