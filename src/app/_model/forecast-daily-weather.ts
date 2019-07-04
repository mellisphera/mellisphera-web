export interface ForecastDailyWeather {
    _id: String;
	weather: Map<String, String>;
	wind: Map<String, String>;
	main: Map<String, String>;
	_origin: String;
	user: String;
	date: String;
	city: String;
	rain: Map<String, Number>;
	idApiary: String;
	show: Map<String, Number>;
	apiary: String;
}
