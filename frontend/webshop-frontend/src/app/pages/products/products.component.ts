import { Component, OnInit } from '@angular/core';
import { ApiService, Product } from '../../services/api.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';
  rateUsd: number | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products.';
        this.loading = false;
      }
    });

    this.api.getEurToUsdRate().subscribe({
      next: (r) => (this.rateUsd = r.rate),
      error: () => (this.rateUsd = null)
    });
  }

  getCategoryName(p: Product): string {
    return typeof p.categoryId === 'string' ? p.categoryId : p.categoryId.name;
  }
}
