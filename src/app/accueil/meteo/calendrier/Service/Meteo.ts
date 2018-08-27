export class Meteo{

    private date : string;
    private icons ; string;
    private tempMin : number;
    private tempMpax : number;

    constructor(date : string, icons :string, tempMin : number , tempMax : number){
        this.date = date;
        this.icons = icons;
        this.tempMin = tempMin;
        this.tempMpax = tempMax;
    }

    getDate(){
        return this.date;
    }
    getIcons(){
        return this.icons;
    }
    getTempMin(){
        return this.tempMin;
    }
    getTempMax(){
        return this.tempMpax;
    }
    getArray(){
        return [this.date, this.icons, this.tempMin, this.tempMpax];
    }
}
