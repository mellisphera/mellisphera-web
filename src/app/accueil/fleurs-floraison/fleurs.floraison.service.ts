import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from 'config';
import { FleursTheorique } from './fleurstheorique'
import { FleurObservees } from './fleurobservees'
import { Rucher } from '../ruche-rucher/rucher';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class FleursFloraisonService {
 
    
    constructor(private http:HttpClient) {}

    //Récupère la liste des fleurs théoriques
    getFleurTest(): Observable<FleursTheorique[]>{
        return this.http.get<FleursTheorique[]>(CONFIG.URL+'flowersTh/all');
    }

    //Service permettant de récuperer les fleurs du rucher selectionné d'un utilisateur x
    getUserFleur(idRucher): Observable<FleurObservees[]>{
        return this.http.get<FleurObservees[]>(CONFIG.URL+'flowersOb/'+ idRucher);
    }

    //Récupère la liste des fleurs théoriques
    getType(): Observable<String[]>{
        return this.http.get<String[]>(CONFIG.URL+'flowersTh/types');
    }

    //Récupère le noms des fleurs du rucher
    getNamesFlowers(idRucher): Observable <String[]>{
        return this.http.get<String[]>(CONFIG.URL+'flowersOb/namesflowers/'+ idRucher);
    }

     //Récupère le noms des fleurs du rucher
    getNameApiary(idRucher): Observable<Rucher>{
        return this.http.get<Rucher>(CONFIG.URL+'apiaries/details/'+ idRucher);
    }

    //Récupère le dates de floraisons théoriques des fleurs du rucher
    getFloraisonThFlowers(fleur): Observable <number[]>{
        return this.http.get<number[]>(CONFIG.URL+'flowersOb/datesthflowersd/'+fleur.id);
    }

    //Récupère les dates de floraisons observées des fleurs du rucher
    getFloraisonObFlowers(fleur,annee): Observable <number[]>{
        return this.http.get<number[]>(CONFIG.URL+'flowersOb/datesobflowersd/'+fleur.id+'/'+annee);
    }

    //Ajoute une fleur à un rucher de l'utilisateur
    addFlower(fleur,id){
        return this.http.put(CONFIG.URL+'flowersOb/add/'+id,fleur);
    }

    //Change la date de début de floraison obserevée d'une fleur
    updateFleurDebut(id,annee,dateDebut) {
        return this.http.put(CONFIG.URL+'flowersOb/updateDebd/'+id+'/'+annee,dateDebut);
    }

    //Change la date de fin de floraison obserevée d'une fleur
    updateFleurFin(id,annee,dateFin){
        return this.http.put(CONFIG.URL+'flowersOb/updateFind/'+id+'/'+annee,dateFin);
    }

    //Change le pourcentage d'une fleur dans le rucher
    updatePresence(fleur){
        return this.http.put(CONFIG.URL+'flowersOb/updatePresence/'+fleur.id,fleur.presence);
    }

    //on supprime une fleur de la bibliothèque
    deleteFleur(fleur) {
        return this.http.delete(CONFIG.URL+'flowersOb/' + fleur.id);
    }

    //Récupère les fleurs qui correspondet à la recherche
    rechercheFlowersVar(fleur) : Observable<FleursTheorique[]>{
        return this.http.put<FleursTheorique[]>(CONFIG.URL+'flowersTh/rechercheVar',fleur);
    }

    //Récupère les fleurs qui correspondet à la recherche
    rechercheFlowersPer(fleur) : Observable<FleursTheorique[]>{
        return this.http.put<FleursTheorique[]>(CONFIG.URL+'flowersTh/recherchePer',fleur);
    }

    
}