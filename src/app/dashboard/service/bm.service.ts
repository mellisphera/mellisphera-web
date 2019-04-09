import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../../config';

const httpHeader = {
  headers: new HttpHeaders({ 'Content-Type': 'aplication/x-www-form-urlencoded' }),
  h2 : new HttpHeaders({'license_key': CONFIG.LICENCE_KEY})
};

@Injectable({
  providedIn: 'root'
})
export class BmService {

  form: FormData;
  constructor(private httpClient: HttpClient) { }


  checkBmUser(username: string, password: string) {
    this.form = new FormData();
    this.form.append('username', username);
    this.form.append('password', password);
    this.httpClient.post<any>(CONFIG.BM_API + 'does_user_exist', this.form, httpHeader).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );

  }
}
