export class DailyWeather{

    minTempDay : string;
    maxTempDay : string;
    avgTempDay : string;
    day : string;
    icons : any[]
    idApiary : string;

    constructor(minTempDay : string, maxTempDay : string, avgTempDay : string, day : string, icons : any[], idApiary : string){
        this.minTempDay = minTempDay;
        this.maxTempDay = maxTempDay;
        this.avgTempDay = avgTempDay;
        this.day = day;
        this.icons = icons;
        this.idApiary = idApiary;
    }

    getIcons(){
        return this.icons;
    }

    getIdApiary(){
        return this.idApiary;
    }

    getDay(){
        return this.day;
    }
}
