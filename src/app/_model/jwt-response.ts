import { UserPref } from './user-pref';

export interface JwtResponse {
    accessToken: string;
    type?: string;
    username: string;
    idUser: string;
    email: string;
    connexions?: number;
    authorities: string[];
    country: string;
    userPref: UserPref;
}
