import { NavRucheModule } from './nav-ruche.module';

describe('NavRucheModule', () => {
  let navRucheModule: NavRucheModule;

  beforeEach(() => {
    navRucheModule = new NavRucheModule();
  });

  it('should create an instance', () => {
    expect(navRucheModule).toBeTruthy();
  });
});
