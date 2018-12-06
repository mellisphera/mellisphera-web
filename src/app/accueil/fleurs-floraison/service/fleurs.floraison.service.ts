import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../../../config';
import { FleursTheorique } from '../fleurstheorique'
import { Rucher } from '../../ruche-rucher/rucher';
import { RucherService } from '../../ruche-rucher/rucher.service';
import { FleurObservees } from '../../../_model/fleur-observees'

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class FleursFloraisonService {
 
    fleursByRucher : FleurObservees[];
    fleurThs : FleursTheorique[];

    typesFleur : String[];
    nomFleur : String[];
    datesFleur : number[];

    mergeOption  : any;
    dataNom : ['ceriser', 'toto', 'ds', 'dsd', 'q', 's'];
    tabFleurByDateGraph : any[];
    templateSerie = {
        name: '',
        type: 'line',
        color:'#509B21',
        symbolSize: 12,
        data : []
    };
    templateLegend: {
        left: 'right',
        data: any
    };
    fleursObs : Observable<FleurObservees[]>;
    constructor(private http:HttpClient, public rucherService : RucherService) {
        this.rucherService.ruchersObs.subscribe(
            ()=>{},()=>{},
            ()=>{
                console.log(this.rucherService.rucher.id);
                this.getUserFleur(this.rucherService.rucher.id);
            }
        )
    }
    data : [
        ['2018-03-13','ceriser']
    ]
    //Récupère la liste des fleurs théoriques
    getFleurTest(){
        this.http.get<FleursTheorique[]>(CONFIG.URL+'flowersTh/all').subscribe(
            (data)=>{
                this.fleurThs = data;
                console.log(this.fleurThs);
            },
            (err)=>{
                console.log(err);
            }
        );
    }

    sortTheoricalFlower(){
        this.tabFleurByDateGraph = [];
        this.mergeOption = {
            series : [],
            yAxis: {
                data : []
            },
            legend : {
                left: 'right',
                data:''
            }
        };
        this.nomFleur = [];
        var date = new Date();
        this.fleursByRucher.forEach(element => {
            //console.log(element.nom );
            this.tabFleurByDateGraph.push([
                [date.getFullYear()+'-'+element.dateThDebutd, element.nom],
                [date.getFullYear()+'-'+element.dateThFind, element.nom]
            ]);
            //console.log(this.tabFleurByDateGraph[this.tabFleurByDateGraph.length-1]);
            this.templateSerie.name = element.nom;
            this.templateSerie.data = this.tabFleurByDateGraph[this.tabFleurByDateGraph.length-1];
            this.mergeOption.series.push(this.templateSerie);
            this.nomFleur.push(element.nom);
            this.cleanTemplate();
        });
        console.log(this.mergeOption);
        this.mergeOption.legend.data = this.nomFleur;
        this.mergeOption.yAxis.data = this.nomFleur;
    }
    //Service permettant de récuperer les fleurs du rucher selectionné d'un utilisateur x
    getUserFleur(idRucher){
        console.log(idRucher);
        this.fleursObs = this.http.get<any[]>(CONFIG.URL+'flowersOb/'+ idRucher);
        this.fleursObs.subscribe(
            (data)=>{
                this.fleursByRucher = data;
                console.log(this.fleursByRucher);
            },
            (err)=>{
                console.log(err);
            },
            ()=>{
                this.sortTheoricalFlower();
                this.getFleurTest();
                this.getType();
                //this.getNamesFlowers(this.rucherService.rucher.id);
            }
        );
    }

    cleanTemplate(){
        this.templateSerie = {
            name: '',
            type: 'line',
            color:'#509B21',
            symbolSize: 12,
            data : []
        };
    }
    //Récupère la liste des fleurs théoriques
    getType(){
        this.http.get<String[]>(CONFIG.URL+'flowersTh/types').subscribe(
            (data)=>{
                this.typesFleur = data;
                console.log(this.typesFleur);
            },
            (err)=>{
                console.log(err);
            }
        );
    }

    //Récupère le noms des fleurs du rucher
    getNamesFlowers(idRucher){
        this.http.get<String[]>(CONFIG.URL+'flowersOb/namesflowers/'+ idRucher).subscribe(
            (data)=>{
                this.nomFleur = data;
                console.log(this.nomFleur);
            },
            (err)=>{
                console.log(err);
            }
        );
    }
    //Récupère le dates de floraisons théoriques des fleurs du rucher
    getFloraisonThFlowers(fleur){
        this.http.get<number[]>(CONFIG.URL+'flowersOb/datesthflowersd/'+fleur.id).subscribe(
            (data)=>{
                this.datesFleur = data;
                console.log(data);
            },
            (err)=>{
                console.log(err);
            }
        );
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