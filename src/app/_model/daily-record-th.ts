/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

export interface DailyRecordTh {

    id : string;
	recordDate : Date;
	hiveId : string;
	humidity_int_min : number;
	humidity_int_max : number;
	temp_int_min : number;
	temp_int_max : number;
	temp_int_moy : number;
	temp_int_stddev : number;
	health_status : string;
	health_trend  :string;
    r_int_text : string;
	timestamp : number;
	brood: number;
    //[class]="getColorStatus(i)"
}
