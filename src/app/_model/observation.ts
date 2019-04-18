export interface Observation {
    id?: string;
    date: Date;
    type: string;
    sentence: string;
    idApiary?: string;
    idHive: string;
    idLHive?: Array<string>;
    Lruche: Array<string>;
    nluScore?: string;
}
