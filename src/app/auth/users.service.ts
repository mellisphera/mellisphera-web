import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs";
import { Observable } from 'rxjs';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { User } from '../_model/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../config';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class UsersService {

    
    constructor(private http:HttpClient) {}

    getUsers(){
        return this.http.get('http://localhost:8091/posts/all');
    }   
}
