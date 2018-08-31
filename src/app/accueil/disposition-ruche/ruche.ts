export class Ruche{

    public id : string;
    public name : string;
    public description : string;
    public username : string;
    public idApiary: string;
    public hivePosX : string;
    public hivePosY : string;

    constructor(id: string, name : string, description : string, username : string, idApiary : string, hivePosX : string, hivePosY : string){
        this.id = id;
        this.name = name;
        this.description = description;
        this.username = username;
        this.idApiary  = idApiary;
        this.hivePosX = hivePosX;
        this.hivePosY = hivePosY;
    }

    toString(){
        return this.name+" : "+this.description;
    }

    setX(x : string){
        this.hivePosX = x;
    }

    setY(y: string){
        this.hivePosY = y;
    }

    getId(){
        return this.id;
    }
}

   