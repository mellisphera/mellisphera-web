export interface JwtResponse {
    accessToken: string;
    type: string;
    username: string;
    connexions : number;
    authorities: string[];
}
