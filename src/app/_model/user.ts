import { Login } from '../_model/login';

export interface User {
    id : String;
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
	levelUser : String;
}
