import { Meteo } from "./Meteo";

/* 

trie le json obtenu de la requete pour avoir un tableau [date, icons ,tM, tm] utilisable par echarts 

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
        this.tabMeteo.push(new Meteo(this.convertDate(this.meteo.list[0].dt_txt),this.meteo.list[0].weather[0].icon,Math.round(this.meteo.list[0].main.temp_min),Math.round(this.meteo.list[0].main.temp_max)).getArray());
        this.meteo.list.forEach((element,index)=>{
            var heure = new Date(element.dt_txt).getHours();
            console.log(date != new Date().getDate());
            if(heure  == 12 && date != new Date().getDate()){
                this.tabMeteo.push(new Meteo(this.convertDate(element.dt_txt),element.weather[0].icon,Math.round(element.main.temp_min),Math.round(element.main.temp_max)).getArray());
            }
            date = new Date(element.dt_txt).getDate();
        })
    }
}
