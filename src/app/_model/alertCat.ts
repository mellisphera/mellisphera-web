export interface AlertCat {
    _id: string;
    type: string;
    alterable: boolean;
    disable: boolean;
    basicValue: number;
    priority: number;
    rangeValue: number[];
    unite: string;
}
