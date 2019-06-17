import { RucherModel } from "./rucher-model";

export interface SharingApiary {
    id: string;
    idUsername: string;
    sharingApiary: Map<string, RucherModel>;

}
