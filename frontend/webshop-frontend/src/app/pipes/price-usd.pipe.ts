import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceUsd'
})
export class PriceUsdPipe implements PipeTransform {
  transform(eur: number, rate: number | null | undefined): string {
    if (eur == null) return '';
    if (!rate) return `${eur.toFixed(2)} EUR`;
    const usd = eur * rate;
    return `${eur.toFixed(2)} EUR ($${usd.toFixed(2)} USD)`;
  }
}
