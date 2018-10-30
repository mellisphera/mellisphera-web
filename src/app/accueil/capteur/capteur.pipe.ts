import { Pipe, PipeTransform } from '@angular/core';

// Pipe de traitement des listes
@Pipe({ name: 'capteurPipe' })
export class PipeCapteur implements PipeTransform {
  
  public transform(values: any[], filtre: string): any[] {
    // console.log(values[0], filtre);
    if (!values || !values.length) return [];
    if (!filtre) return values;

    // return values.filter(v => String(v).toLowerCase().indexOf(filtre.toLowerCase()) >= 0);
    return values.filter(v => {
        if(v.sensorRef){
            return v.sensorRef.indexOf(filtre.toUpperCase()) >= 0;
        }
    });
  }
}