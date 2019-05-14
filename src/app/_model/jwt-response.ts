import { UserPref } from './user-pref';

export interface JwtResponse {
    accessToken: string;
    type?: string;
    username: string;
    email: string;
    connexions?: number;
    authorities: string[];
    country: string;
    userPrefœ: UserPref;
}
