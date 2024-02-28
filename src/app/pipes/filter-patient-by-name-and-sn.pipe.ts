import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPatientByNameAndSn',
  standalone: true,
})
export class FilterPatientByNameAndSnPipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) {
      return items;
    }
    searchTerm = searchTerm.toLowerCase();

    return items.filter((item) => {
      let newItem = { sn: item.sn, name: item.name };
      return Object.values(newItem).some((value: any) =>
        value.toString().toLowerCase().includes(searchTerm)
      );
    });
  }
}
