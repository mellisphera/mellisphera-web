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
