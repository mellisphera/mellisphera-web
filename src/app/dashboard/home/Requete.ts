/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

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