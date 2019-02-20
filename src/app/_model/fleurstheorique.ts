import { FleursINRA } from "./fleursINRA";
import { FleurITSAP } from "./fleurITSAP";

export interface FleursTheorique {
    id : string;
	flowerApi : FleursINRA;
    flowerItsap : FleurITSAP;
    type : String;
    photo : string;


   }