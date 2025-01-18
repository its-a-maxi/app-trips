import { FormatDatePipe } from './format-date.pipe';

describe('FormatDatePipe', () => {
  
  const pipe = new FormatDatePipe();

  it('should transform date to string', () => {
    expect(pipe.transform(new Date)).toBeInstanceOf(String);
  });
});