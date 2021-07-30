import { WeatherConfig } from './weatherConfig';

export interface WeatherSource{
    _id: string,
    apiaryId: string,
    apiaryName: string,
    userId: string,
    userName: string,
    begin: Date,
    end: Date,
    source: string,
    config: WeatherConfig,
}