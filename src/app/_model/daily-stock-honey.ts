import { Time } from "@angular/common";
import { Timestamp } from "rxjs";

export interface DailyStockHoney {
    id : String;
	nom : String;
	stockJ : number;
	apportJ : number;
	date : Date;
	idApiary : String;
	idHive : String;
	username : String;
	timestamp : Timestamp<number>;
}
