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

export class Ruche{

    public id : string;
    public name : string;
    public description : string;
    public username : string;
    public idApiary: string;
    public hivePosX : string;
    public hivePosY : string;

    constructor(id: string, name : string, description : string, username : string, idApiary : string, hivePosX : string, hivePosY : string){
        this.id = id;
        this.name = name;
        this.description = description;
        this.username = username;
        this.idApiary  = idApiary;
        this.hivePosX = hivePosX;
        this.hivePosY = hivePosY;
    }

    toString(){
        return this.name+" : "+this.description;
    }

    setX(x : string){
        this.hivePosX = x;
    }

    setY(y: string){
        this.hivePosY = y;
    }

    getId(){
        return this.id;
    }
}

   