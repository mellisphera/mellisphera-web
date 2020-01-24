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

export interface CurrentDailyWeather {
    _id: String;
	date: Date;
	weather: Map<String, String>;
	main: Map<String, Number>;
	wind: Map<String, Number | String>;
    rain: Map<String, Number>;
	snow: Map<String, Number>;
	user: String ;
	apiary: String;
	apiaryId: String;
	city: String;
	_origin: String;
	
}
