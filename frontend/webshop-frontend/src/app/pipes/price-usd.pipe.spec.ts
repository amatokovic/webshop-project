import { PriceUsdPipe } from './price-usd.pipe';

describe('PriceUsdPipe', () => {
  it('create an instance', () => {
    const pipe = new PriceUsdPipe();
    expect(pipe).toBeTruthy();
  });
});
