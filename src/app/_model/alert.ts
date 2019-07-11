export interface AlertInterface {
    _id: string;
    idUser : string;
    user: string;
    apiary: string;
    idApiary:string;
    idHive:string;
    hive:string;
    type:string;
    alert:string;
    message:string;
    date: Date;
    check:boolean;
    picto:string;
    loc:string;
    time:string;
}
