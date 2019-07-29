import { Pipe, PipeTransform } from '@angular/core';

// Pipe de traitement des listes
@Pipe({ name: 'capteurPipe' })
export class PipeCapteur implements PipeTransform {
  
  public transform(values: any[], filtre: string): any[] {
    if (!values || !values.length) return [];
    if (!filtre) return values;

    return values.filter(v => {
        if (v.sensorRef) {
            return v.sensorRef.indexOf(filtre.toUpperCase()) >= 0;
        }
    });
  }
}

@Pipe({ name: 'sensorType' })
export class SearchCapteur implements PipeTransform {
  public transform(values: any[], filtre: string): any[] {
    if (!values || !values.length) return [];
    if (!filtre) return values;

    const type = [41,42,43];
    const patern  = /[4][0-9]\:*/g;

    return values.filter(v => {
        if (v.sensorRef) {
            return filtre.startsWith(v.sensorRef);
        }
    });
  }
}