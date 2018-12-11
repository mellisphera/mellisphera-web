import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFleur'
})
export class SearchFleurPipe implements PipeTransform {

  public transform(values: any, filtre?: any): any {
    if (!values || !values.length) return [];
    if (!filtre) return values;

    return values.filter(v=>{
      if(v.flowerApi.francais){
        return v.flowerApi.francais.toLowerCase().indexOf(filtre)>=0;
      }
    })
  }

}

@Pipe({
  name: 'searchFleurByType'
})
export class searchFleurByType implements PipeTransform {

  public transform(values: any, filtre?: any): any {
    if (!values || !values.length) return [];
    if (!filtre) return values;

    return values.filter(v=>{
      if(v.type){
        return v.type.indexOf(filtre)>=0;
      }
    })
  }

}

