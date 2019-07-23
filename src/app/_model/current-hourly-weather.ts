export interface CurrentHourlyWeather {
    _id: String;
	date: Date;
	weather: Map<String, String>;
	main: Map<String, Number>;
	wind: Map<String, Number | String>;
    rain: Map<String, Number>;
	snow: Map<String, Number>;
	user: String ;
	apiary: String;
	idApiary: String;
	city: String;
	_origin: String;
	
}
