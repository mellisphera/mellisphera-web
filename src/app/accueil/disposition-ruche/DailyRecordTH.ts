export class DailyRecordsTH{

	private recordDate : string;
	private  idHive : string
	private  humidity_int_min : string
	private  humidity_int_max : string
	private  temp_int_min: string
	private  temp_int_max: string
	private  temp_int_moy: string
	private  temp_int_stddev : string
	private  health_status : string
	private  health_trend :string
    private  r_int_text : string
    
    constructor(recordDate : string , idHive : string, humidity_int_min : string, humidity_int_max : string, temp_int_min :  string, temp_int_max : string, temp_int_moy : string, temp_int_stddev : string, health_status : string, health_trend : string, r_int_text : string){
        this.recordDate = recordDate;
		this.idHive = idHive;
		this.humidity_int_min = humidity_int_min;
		this.humidity_int_max = humidity_int_max;
		this.temp_int_min = temp_int_min;
		this.temp_int_max = temp_int_max;
		this.temp_int_moy = temp_int_moy;
		this.temp_int_stddev = temp_int_stddev;
		this.health_status = health_status;
		this.health_trend = health_trend;
		this.r_int_text = r_int_text;
    }

    public getIdHive(){
        return this.idHive;
    }

    public getHealthStatus(){
        return this.health_status;
    }

    public getHealthTrend(){
        return this.health_trend;
	}
	
	public getColorStatus(){
		if(this.health_status == 'A'){ return "statusA"; }
		else if(this.health_status == 'B'){ return 'statusB'; }
		else{
			return 'statusC';
		}
	}

}