import { FleursINRA } from "./fleursINRA";
import { FleurITSAP } from "./fleurITSAP";
export class FleursTheorique {
    private id : string;
	private flowerApi : FleursINRA;
    private flowerItsap : FleurITSAP;
    private type : String;
    private photo : string;

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getFlowerApi(): FleursINRA {
        return this.flowerApi;
    }

    public setFlowerApi(flowerApi: FleursINRA): void {
        this.flowerApi = flowerApi;
    }

    public getFlowerItsap(): FleurITSAP {
        return this.flowerItsap;
    }

    public setFlowerItsap(flowerItsap: FleurITSAP): void {
        this.flowerItsap = flowerItsap;
    }

    public getType(): String {
        return this.type;
    }

    public setType(type: String): void {
        this.type = type;
    }

    public getPhoto(): string {
        return this.photo;
    }

    public setPhoto(photo: string): void {
        this.photo = photo;
    }

   }