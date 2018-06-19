import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../../config';
import { Rucher } from './rucher';
import { Ruche } from './ruche';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class RucherService {
 
    
    constructor(private http:HttpClient) {}
    // -- RUCHER -- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER --
    // pour créer un rucher
    createRucher(rucher) {
        //let body = JSON.stringify(rucher);
        return this.http.post(CONFIG.URL+'apiaries', rucher ,httpOptions).
        catch(this.errorHandler);
    }
    // pour afficher tout les ruchers
    getRuchers() : Observable<Rucher[]>{
        return this.http.get<Rucher[]>(CONFIG.URL+'apiaries/all');
    }   
    // pour afficher tout les ruchers de l'utilsateur connecté
    getUserRuchers(username) : Observable<Rucher[]>{
        return this.http.get<Rucher[]>(CONFIG.URL+'apiaries/'+ username);
    }  
    // pour afficher tout les ruchers
    getRucherDetails(idApiary) : Observable<Rucher[]>{
            return this.http.get<Rucher[]>(CONFIG.URL+'apiaries/details/'+idApiary);
    }  
    updateRucher(rucher) {
        let body = JSON.stringify(rucher);
        return this.http.put(CONFIG.URL+'apiaries/update/' + rucher.id, body, httpOptions);
    }
    deleteRucher(rucher) {
        return this.http.delete(CONFIG.URL+'apiaries/' + rucher.id);
    }

    // -- RUCHE -- RUCHE -- -- RUCHE -- -- RUCHE -- -- RUCHE -- -- RUCHE -- -- RUCHE -- -- RUCHE -- 
    // pour créer une ruche dans un rucher
    createRuche(ruche) {
        let body = JSON.stringify(ruche);
        return this.http.post(CONFIG.URL+'hives', body , httpOptions);
    }
    updateRuche(ruche) {
        let body = JSON.stringify(ruche);
        return this.http.put(CONFIG.URL+'hives/update/' + ruche.id, body, httpOptions);
    }
    // Service permettant de récuperer les ruches du rucher selectionné d'un utilisateur X
    getUserRuches(username,idRucher) : Observable<Ruche[]>{
        return this.http.get<Ruche[]>(CONFIG.URL+'hives/'+ username +'/'+ idRucher);
    }   
    // pour supprimer une ruche
    deleteRuche(ruche) {
        return this.http.delete(CONFIG.URL+'hives/' + ruche.id);
    }

    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }


    /*
    createUser(user) {
                let body = JSON.stringify(user);
                return this.http.post('http://localhost:8091/user/signup', body, httpOptions);
    }       
    updateUser(user) {
                let body = JSON.stringify(user);
                return this.http.put('http://localhost:8091/user/' + user.id, body, httpOptions);
    }
    loginUser(user) {
                let body = JSON.stringify(user);
                return this.http.post('http://localhost:8091/user/login' + body, httpOptions);
    }
    deleteUser(user) {
                return this.http.delete('http://localhost:8091/user/' + user.id);
    }
    

//posts services
   
    updatePost(post) {
        let body = JSON.stringify(post);
        return this.http.put('http://localhost:8091/posts/update/' + post.id, body, httpOptions);
    }
    deletePost(post) {
        return this.http.delete('http://localhost:8091/posts/' + post.id);
    }   
    createPost(post) {
        let body = JSON.stringify(post);
        return this.http.post('http://localhost:8091/posts', body, httpOptions);
}    
   
/*
    getAll(): Observable<Post[]> {
        return this.http.get('http://localhost:8091/posts/all')
          .map(res => res.json().data)
          .catch(this.handleError);
    }
*/
    
    
}