export interface Swarm {
    _id: string;
    date: Date;
    weight_fall: number;
    t_ext: number;
    var_temp: number;
    probability: number;
    info: any;
    sys: {
        city: string;
        lat: string;
        lon: string;

    }

}
