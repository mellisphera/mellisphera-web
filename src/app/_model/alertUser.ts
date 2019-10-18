export interface AlertUser {
    _id: string;
    userId: string;
    alertConf: Map<string, {
        enable: boolean,
        value: number[]
    }>
}