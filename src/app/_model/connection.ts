import { Location } from './location';

export interface Connection {
    id: string;
    connectionDate: string;
    idUsername: string;
    username: string;
    location: Location;
}
