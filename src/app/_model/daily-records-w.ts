import { DeprecatedDatePipe } from "@angular/common";

export interface DailyRecordsW {

    recordDate : Date;
    idHive : string;
    temp_ext_min : number;
    temp_ext_max : number;
    weight_min : number;
    weight_max : number;
    weight_gain : number;
    weight_income_gain : number;
    sensorRef: string;
    weight_foragingbees : number;
    weight_hive : number;
    weight_colony : number;
    weight_filling_rate : number;
}
