import { InspConf } from './inspConf';

export interface InspUser{
  _id : string;
  idUser : string;
  inspConf : InspConf[];
}
