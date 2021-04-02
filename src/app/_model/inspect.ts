import { InspectionRuche } from './inspecthive';

export interface Inspection{
  date: Date;
  apiary: {
    id: string,
    name: string,
    actions: string[],
    notes: string,
  }
  hives: InspectionRuche[]
}
