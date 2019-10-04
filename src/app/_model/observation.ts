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

export interface Observation {
    _id?: string;
    createDate: Date;
    typeS: string;
    opsDate: Date;
    description: string;
    apiaryId?: string;
    hiveId: string;
    userId: string;
    typeInspect: string;
    tags: string[];
}


/**{
    "_id" : "cJIoXm05XanU1dPHkUVQ",
    "createDate" : ISODate("1970-01-01T00:00:00.000Z"),
    "type" : "hive",
    "description" : "No stressors ? ",
    "hiveId" : "HpfcjKqPG36v52DyikSwoaWUbzMTFVxE",
    "apiaryId" : "p3IOv7syGNte82qUkcR0ohKF6bgVwjXL",
    "opsDate" : ISODate("1970-01-18T14:18:06.480Z"),
    "userId" : "G8zsCAgnehvF2ajfL3pQ5HXKmZNklEyB",
    "typeInspect" : "HiveObs",
    "_class" : "com.mellisphera.entities.Note"
} */