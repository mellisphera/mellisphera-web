import { Login } from '../_model/login';

export interface User {
    id : string;
    createdAt : Date;
    login : Login;
	phone : String;
	email : String;
	connexions : number;
	lastConnection : Date;
	fullName : String;
	position : String;
	country : String;
	city : String;
	levelUser : number;
}
