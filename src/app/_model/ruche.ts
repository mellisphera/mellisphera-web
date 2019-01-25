import { User } from '../_model/user';

export interface RucheInterface {
    id? : string;
    name : string;
    description : string;
    username : string;
    idApiary: string;
    hivePosX : string;
    hivePosY : string;
    sharingUser : User[];
    shareStatus : Boolean;
}
