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

export interface Kpisynclog {
/*     "_id" : ObjectId("5ceb1eeadc30057405734911"),
    "user" : "countryparsonhoney",
    "date" : ISODate("2019-05-25T00:00:00.000Z"),
    "lastSync" : 3,
    "lastLog" : 1 */

    _id: String;
    user: String;
    date: String;
    lastSync: number;
    lastLog: number;
    
}
