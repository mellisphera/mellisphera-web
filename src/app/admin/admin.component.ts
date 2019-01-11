import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupService } from './service/signup.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  signupForm : FormGroup;
  success : boolean;
  message="";
  
  constructor(private formBuilder : FormBuilder, public signupService : SignupService) { 
    this.success = false;
  }

  ngOnInit() {
    this.innitForm();
    this.signupForm.controls['types'].setValue('1');
  }

  innitForm(){
    this.signupForm = this.formBuilder.group({
      'fullName':[null,Validators.required],
      'email':[null,Validators.required],
      'username': [null,Validators.required],
      'types': ['1',Validators.required],
      'password':[null,Validators.required],
      'phone' : [null,Validators.required],
      'position' : [null,Validators.required],
      'country' : [null,Validators.required],
      'city' : [null,Validators.required],
    });
  }
  receiveMessage($event){
      this.message=$event;
  }
  signup(){
    const data = this.signupForm.value;
    console.log(this.signupService.user);
    console.log(data);
    this.signupService.user = data;
    this.signupService.user.createdAt = new Date();
    this.signupService.user.login = { username: data.username, password : data.password};
    this.signupService.user.levelUser = data.types;
    console.log(this.signupService.user);
    this.signupService.signupUser(()=>{
      this.success = true;
      this.innitForm();
      setTimeout(()=>{
        this.success = false;
      },1000);
    });
  }

}
