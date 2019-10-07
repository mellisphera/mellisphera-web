import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bm-login',
  templateUrl: './bm-login.component.html',
  styleUrls: ['./bm-login.component.css']
})
export class BmLoginComponent implements OnInit, OnDestroy {

  public email: string;
  public password: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    document.querySelector('body').classList.add('login-bm');
    this.email = this.route.snapshot.params.email;
  }

  ngOnDestroy(): void {
    document.querySelector('body').classList.remove('login-bm');
  }

}
