import { WeatherConfig } from './weatherConfig';

export interface WeatherSource{
    apiaryId: string,
    apiaryName: string,
    userId: string,
    userName: string,
    begin: Date,
    end: Date,
    source: string,
    config: WeatherConfig
}