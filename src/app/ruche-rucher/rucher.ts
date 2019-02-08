export class Rucher {
 
id : string;
latitude: string;
longitude: string;
name: string
description : string;
createdAt : Date;
photo : string;
username : string;
codePostal : string;
ville : string;

    getCity(){
        return this.ville;
    }

  
}
