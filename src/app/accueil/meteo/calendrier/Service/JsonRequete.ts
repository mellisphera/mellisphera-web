import { Meteo } from "../Meteo";
import { DailyWeather } from "../DailyWeather";
/* 

trie le json obtenu de la requete pour avoir un tableau [date, icons ,tM, tm] utilisable par echarts 

*/

export  class JsonRequete{
    private json : any;
    private tabMeteo : any[];
    private premiereRequete : any[]=[];
    private tabDailyWeather : any[];

    constructor(json : any){
        this.json = json;
    }

    setJsonWeather(json){
        this.json = json; 
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

    sortMeteoProcess(){
        this.tabMeteo=[];
        console.log(this.tabMeteo);
        var date = null;
        this.tabMeteo.push(new Meteo(this.convertDate(this.json.list[0].dt_txt),this.json.list[0].weather[0].icon,Math.round(this.json.list[0].main.temp_min),Math.round(this.json.list[0].main.temp_max)).getArray());
        this.json.list.forEach((element,index)=>{
            var heure = new Date(element.dt_txt).getHours();
            date = new Date(element.dt_txt);
            if(heure  == 12 && date.getDate() != new Date().getDate()){
                this.tabMeteo.push(new Meteo(this.convertDate(element.dt_txt),element.weather[0].icon,Math.round(element.main.temp_min),Math.round(element.main.temp_max)).getArray());
            }
        })
    }

    sortProcessDailyWeather(){
        this.tabDailyWeather=[];
        var date = null;
        this.json.forEach((element, index)=>{
            date = new Date(element.day);
            this.tabDailyWeather.push(new DailyWeather(element.minTempDay,element.maxTempDay, element.avgTempDay, element.day, element.icons, element.idApiary));
        })
        
    }
}
