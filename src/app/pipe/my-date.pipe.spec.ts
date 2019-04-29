import { MyDatePipe } from './my-date.pipe';
import { UserParamsService } from '../dashboard/preference-config/service/user-params.service';

describe('MyDatePipe', () => {
  it('create an instance', () => {
    const pipe = new MyDatePipe(new UserParamsService());
    expect(pipe).toBeTruthy();
  });
});
