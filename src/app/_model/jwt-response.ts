export interface JwtResponse {
    accessToken: string;
    type: string;
    username: string;
    authorities: string[];
}
