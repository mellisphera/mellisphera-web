import { RucheModule } from './ruche.module';

describe('RucheModule', () => {
  let rucheModule: RucheModule;

  beforeEach(() => {
    rucheModule = new RucheModule();
  });

  it('should create an instance', () => {
    expect(rucheModule).toBeTruthy();
  });
});
