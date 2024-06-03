import { Pipe, PipeTransform } from '@angular/core';
import { PatientDto } from '../../model/Registration';

@Pipe({
  name: 'filterPatientByNameAndSn',
  standalone: true,
})
export class FilterPatientByNameAndSnPipe implements PipeTransform {
  transform(items: PatientDto[], searchTerm: string): PatientDto[] {
    if (!items || !searchTerm) {
      return items;
    }
    searchTerm = searchTerm.toLowerCase();
    // TODO add filter by bday
    return items.filter((item) => {
      let newItem = { id: item.id, name: item.firstName };
      return Object.values(newItem).some((value: any) =>
        value.toString().toLowerCase().includes(searchTerm)
      );
    });
  }
}
