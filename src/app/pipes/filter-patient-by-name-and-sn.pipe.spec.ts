import { FilterPatientByNameAndSnPipe } from './filter-patient-by-name-and-sn.pipe';

describe('FilterPatientByNameAndSnPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterPatientByNameAndSnPipe();
    expect(pipe).toBeTruthy();
  });
});
