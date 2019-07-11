import { User } from '../_model/user';

export interface RucheInterface {
    id?: string;
    name: string;
    description: string;
    idUsername : string;
    username: string;
    apiaryName?: string;
    idApiary: string;
    hivePosX: string;
    hivePosY: string;
    sharingUser: User[];
    sensor?: Boolean;
}
