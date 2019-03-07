import { share } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../../config';
import { FleursTheorique } from '../../_model/fleurstheorique'
import { Rucher } from '../../apiary/ruche-rucher/rucher';
import { RucherService } from '../../apiary/ruche-rucher/rucher.service';
import { FleurObservees } from '../../_model/fleur-observees'
import { UserloggedService } from '../../userlogged.service';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class    FleursFloraisonService {
 
    fleursByRucher : FleurObservees[];
    fleurThs : FleursTheorique[];

    typesFleur : String[];
    typeFleurDef : String;

    nomFleur : String[];
    datesFleur : number[];
    subjectFlower : BehaviorSubject<any[]>;
    newFlower : FleurObservees;

    mergeOption  : any;
    dataNom : ['ceriser', 'toto', 'ds', 'dsd', 'q', 's'];
    tabFleurByDateGraph : any[];
    templateSerie;
    templateLegend;
    fleursObs: Observable<FleurObservees[]>;
    constructor(private http:HttpClient, public rucherService : RucherService, private userService : UserloggedService) {
        this.cleanTemplate();
        this.initFleurObservees();
        this.getFleurTest();
        this.subjectFlower = new BehaviorSubject([]);
        // this.subjectFlower.share();
    }
    // Récupère la liste des fleurs théoriques
    getFleurTest(){
        this.http.get<FleursTheorique[]>(CONFIG.URL+'flowersTh/all').subscribe(
            (data)=>{
                this.fleurThs = data;
            },
            (err)=>{
                console.log(err);
            },
            ()=>{
                this.getType();
            }
        );
    }

    initFleurObservees() {
        this.newFlower = {
            id : '',
            nom : '',
            dateDebutd : null,
            dateFind : null,
            dateDebutdate : null,
            dateFindate : null,
            dateThDebutd : '',
            dateThFind : '',
            dateThDebutdate: '',
            dateThFindate: '',
            presence : '',
            username : '',
            idApiary : '',
            photo : ''
        };
    }
    sortTheoricalFlower(){
        this.nomFleur = [];
        const date = new Date();
        this.fleursByRucher.forEach(element => {
            this.tabFleurByDateGraph.push([
                [date.getFullYear()+'-'+element.dateThDebutd, element.nom],
                [date.getFullYear()+'-'+element.dateThFind, element.nom]
            ]);
            this.templateSerie.name = element.nom;
            this.templateSerie.data = this.tabFleurByDateGraph[this.tabFleurByDateGraph.length - 1];
            this.mergeOption.series.push(this.templateSerie);
            this.nomFleur.push(element.nom);
            this.cleanTemplate();
        });
        this.mergeOption.legend.data = this.nomFleur;
        this.mergeOption.yAxis.data = this.nomFleur;
    }
    // Service permettant de récuperer les fleurs du rucher selectionné d'un utilisateur x
    getUserFleur(idRucher) {
        console.log(idRucher);
        this.tabFleurByDateGraph = new Array();
        this.fleursObs = this.http.get<any[]>(CONFIG.URL + 'flowersOb/' + idRucher);
        this.fleursObs.subscribe(
            (data)=>{
                this.fleursByRucher = data;
                this.subjectFlower.next(data);
            },
            (err)=>{
                console.log(err);
            },
            ()=>{
                this.cleanTemplate();
                this.cleanMerge();
                if (this.fleursByRucher.length > 0) {
                    this.sortTheoricalFlower();
                    this.subjectFlower.complete();
                } else {
                    //throw 'Empty';
                    console.log("Aucune");
                }
            }
        );
    }

    cleanTemplate(){
        this.templateSerie = {
            name: '',
            type: 'line',
            color:'#509B21',
            symbolSize: 12,
            data : [],
            label: {
                show:'true',
                position:'top',
                formatter:'{a}'
            }
        }   
        this.templateLegend = {
            left: 'center',
            data: []
        };
    }
    cleanMerge() {
        this.mergeOption = {
            series : new Array(),
            yAxis: {
                data : new Array()
            },
            legend : {
                left: 'center',
                data: new Array()
            }
        };
    }
    //Récupère la liste des fleurs théoriques
    getType(){
        this.http.get<String[]>(CONFIG.URL+'flowersTh/types').subscribe(
            (data)=>{
                this.typesFleur = data;
                this.typeFleurDef = this.typesFleur[0];
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
    addFlower(fleur){
        this.newFlower.nom = fleur.flowerApi.francais;
        this.newFlower.dateDebutd = fleur.flowerApi.flomind;
        this.newFlower.dateFind = fleur.flowerApi.flomaxd;
        this.newFlower.dateThDebutd = fleur.flowerApi.flomind;
        this.newFlower.dateThFind = fleur.flowerApi.flomaxd;
        this.newFlower.dateThDebutdate = fleur.flowerApi.flomindate;
        this.newFlower.dateThFindate = fleur.flowerApi.flomaxdate;
        this.newFlower.presence = "";
        this.newFlower.username = this.userService.currentUser().username;
        this.newFlower.photo = fleur.photo;
        this.http.put(CONFIG.URL+'flowersOb/add/'+this.rucherService.rucher.id,this.newFlower).subscribe(
            ()=>{},
            (err)=>{
                console.log(err);
            },
            ()=>{
                this.getUserFleur(this.rucherService.rucherSelectUpdate.id);
            }
        );
    }

    //Change la date de début de floraison obserevée d'une fleur
    updateFleurDebut(/*id,annee,dateDebut*/fleur,currentyear) {
        this.http.put(CONFIG.URL+'flowersOb/updateDebd/'+fleur.id+'/'+currentyear,fleur.dateDebutdate[currentyear]).subscribe(
            ()=>{},
            (err)=>{
                console.log(err);
            },
            ()=>{
                this.updatePresence(fleur);
            }
        );
    }

    //Change la date de fin de floraison obserevée d'une fleur
    updateFleurFin(currentyear,fleur){
        fleur.dateDebutdate[currentyear] = (fleur.dateDebutdate[currentyear] == '') ? 'null' : fleur.dateDebutdate[currentyear] ;
        fleur.dateFindate[currentyear] = (fleur.dateFindate[currentyear] == '') ? 'null' : fleur.dateFindate[currentyear];
        this.http.put(CONFIG.URL+'flowersOb/updateFind/'+fleur.id+'/'+currentyear,fleur.dateFindate[currentyear]).subscribe(
            ()=>{},
            (err)=>{
                console.log(err);
            },
            ()=>{
                this.updateFleurDebut(fleur,currentyear);
            }
        )
    }

    //Change le pourcentage d'une fleur dans le rucher
    updatePresence(fleur){
        this.http.put(CONFIG.URL+'flowersOb/updatePresence/'+fleur.id,fleur.presence).subscribe(
            ()=>{},
            (err)=>{
                console.log(err);
            },
            ()=>{

            }
        )
    }

    //on supprime une fleur de la bibliothèque
    deleteFleur(fleur) {
        this.http.delete(CONFIG.URL+'flowersOb/' + fleur.id).subscribe(
            ()=>{},
            (err)=>{
                console.log(err);
            },
            ()=>{
                this.getUserFleur(this.rucherService.rucher.id);
            }
        );
    }

    
}