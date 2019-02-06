import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

/*
    class dont les fonctions éxécute les requetes
*/
@Injectable()
export class Requete{
    urlRequete : string;
    city : string = 'Pau';
    private data : string[] ; // Atribut qui contiend les resultats des requettes une fois réalisés
    
    constructor(private httpClient :  HttpClient){}

    /* 
    Recupere l'url depuis laquelle on va faire la requete
    */
    setUrl(url : string){
        this.urlRequete = url;
    }

    /*
        Exécute la requete     
    */
    exeRequete() {
        this.httpClient.get<string[]>(this.urlRequete).subscribe(
            (reponse)=>{
                this.data = reponse;
            }
        );
    }
    getDataRequete(){
        return this.data;
    }
    /*
    get -> Observable . subscribe -> observable
    */
}