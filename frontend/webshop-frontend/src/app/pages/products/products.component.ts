import { Component, OnInit } from '@angular/core';
import { ApiService, Product } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';
  rateUsd: number | null = null;

  qty: Record<string, number> = {};
  qtyError: Record<string, string> = {};

  constructor(
    private api: ApiService,
    public cart: CartService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.api.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        // init qty=1 za sve proizvode
        for (const p of data) {
          this.qty[p._id] = 1;
          this.qtyError[p._id] = '';
        }
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

  onQtyInput(p: Product, rawValue: string) {
    const n = Number(rawValue);

    if (!Number.isFinite(n)) {
      this.qty[p._id] = 1;
      this.qtyError[p._id] = 'Enter a number.';
      return;
    }

    const q = Math.floor(n);
    this.qty[p._id] = q;

    if (q < 1) {
      this.qtyError[p._id] = 'Quantity must be at least 1.';
      return;
    }

    if (q > p.stock) {
      this.qtyError[p._id] = `Only ${p.stock} in stock.`;
      return;
    }

    this.qtyError[p._id] = '';
  }

  canAdd(p: Product): boolean {
    const q = this.qty[p._id] ?? 1;
    return q >= 1 && q <= p.stock && !this.qtyError[p._id];
  }

  addToCart(p: Product) {
    const q = this.qty[p._id] ?? 1;
    if (!this.canAdd(p)) return;

    this.cart.add(p, q);
  }
}
