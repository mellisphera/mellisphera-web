import { RucheInterface } from '../_model/ruche';

export interface SharingHives {
     id? : String;
	 idUsername : String; // id du user avec qui sont partager les ruches
	 username : string;
	 hiveShare : Map<RucheInterface, String>; // Map (idHive -> idUser)
}
