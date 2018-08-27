import { Meteo } from "./Meteo";

/*
    Class qui formate le json des requetes
*/
export  class JsonRequete{
    private meteo : any;
    private tabMeteo : any[];
    private premiereRequete : any[]=[];

    setJsonWeather(json : any){
        this.meteo = json; 
    }
    getResultat(){
        return this.tabMeteo;
    }

    convertDate(date : string){
        var dateIso = new Date(date);
        var jour = ''+dateIso.getDate();
        var mois = ''+(dateIso.getMonth()+1);
        var anee = dateIso.getFullYear();
        if(parseInt(jour) < 10 ){ jour = '0'+jour; }
        if(parseInt(mois) < 10 ){ mois = '0'+mois; }

        return anee + '-' +mois+'-'+ jour;  
    }

    sortProcess(){
        this.tabMeteo=[];
        console.log(this.tabMeteo);
        var date;
        this.meteo.list.forEach((element,index)=>{
            var heure = new Date(element.dt_txt).getHours();
            if(heure  == 12){
                console.log("true");
                this.tabMeteo.push(new Meteo(this.convertDate(element.dt_txt),element.weather[0].icon,Math.round(element.main.temp_min),Math.round(element.main.temp_max)).getArray());
            }
            date = new Date(element.dt_txt).getDate();
        })
    }

    recupMeteoById(id){
        console.log("id : "+id);
        this.tabMeteo=[];
        this.premiereRequete.forEach((element,index)=>{
            if(element[4] == id){
                this.tabMeteo.push(element);
            }
        });
    }
}
