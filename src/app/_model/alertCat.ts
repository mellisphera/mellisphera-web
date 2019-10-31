export interface AlertCat {
    _id: string
    icon: string
    alterable: boolean;
    disable: boolean;
    basicValueMet: number;
    basicValueImp: number;
    priority: number;
    rangeValueMet: number[];
    rangeValueImp: number[];
    stepMet: number;
    stepImp: number;
    unitMet: string;
    unitImp: string;
}
