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

@Pipe({
  name: 'searchFleurByDate'
})
export class searchFleurByDate implements PipeTransform {

  public transform(values: any, filtre?: any): any {
    if (!values || !values.length || values == 0 ) return [];
    if (!filtre) return values;

    return values.filter(v=>{
      var dateValue = new Date();
      dateValue.setFullYear(new Date().getFullYear());
      dateValue.setMonth((v.flowerApi.flomind.split("-"))[0]);
      dateValue.setDate((v.flowerApi.flomind.split("-"))[1])


      if(v.flowerApi.flomind){
        return dateValue.getMonth()+''== filtre;
      }
    })
  }

}

