import { HexBase64BinaryEncoding } from "crypto";

export interface RucherModel {
    id? : string;
    latitude: string;
    longitude: string;
    name: string
    description : string;
    createdAt : Date;
    photo : string;
    username : string;
    codePostal : string;
    ville : string;
}
