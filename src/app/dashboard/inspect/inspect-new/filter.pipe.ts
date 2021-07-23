import { Pipe } from "@angular/core";

@Pipe({
    name: 'filterBy'
})
export class FilterPipe{
    transform(value: [], field: string, fieldValue: string) : any {
        return value.filter((e) => {
            return (e[field] === fieldValue);
        });
    }
}