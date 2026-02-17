import { Component, OnInit } from '@angular/core';
import { ApiService, Product, Category } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  loading = true;
  error = '';
  rateUsd: number | null = null;

  qty: Record<string, number> = {};
  qtyError: Record<string, string> = {};

  filters = {
    q: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    categoryId: ''
  };

  constructor(
    private api: ApiService,
    public cart: CartService,
    public auth: AuthService,
  ) {}

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

    this.api.getCategories().subscribe({
      next: (cats) => (this.categories = cats),
      error: () => (this.categories = [])
    });

    this.api.getEurToUsdRate().subscribe({
      next: (r) => (this.rateUsd = r.rate),
      error: () => (this.rateUsd = null)
    });
  }

  getCategoryName(p: Product): string {
    return typeof p.categoryId === 'string' ? p.categoryId : p.categoryId.name;
  }

  getCategoryId(p: Product): string {
    return typeof p.categoryId === 'string' ? p.categoryId : p.categoryId._id;
  }

  filteredProducts(): Product[] {
    const q = (this.filters.q || '').trim().toLowerCase();
    const min = this.filters.minPrice;
    const max = this.filters.maxPrice;
    const cat = this.filters.categoryId;

    return this.products.filter(p => {
      const nameOk = !q || p.name.toLowerCase().includes(q);

      const minOk = (min === null || min === undefined) ? true : p.price >= min;
      const maxOk = (max === null || max === undefined) ? true : p.price <= max;

      const catOk = !cat || this.getCategoryId(p) === cat;

      return nameOk && minOk && maxOk && catOk;
    });
  }

  clearFilters() {
    this.filters = { q: '', minPrice: null, maxPrice: null, categoryId: '' };
  }

  onQtyInput(p: Product, value: string) {
    const num = Number(value);
    const v = Number.isFinite(num) ? Math.floor(num) : 1;

    this.qty[p._id] = v;

    if (p.stock <= 0) {
      this.qtyError[p._id] = 'Out of stock.';
      return;
    }
    if (v < 1) {
      this.qtyError[p._id] = 'Quantity must be at least 1.';
      return;
    }
    if (v > p.stock) {
      this.qtyError[p._id] = `Only ${p.stock} in stock.`;
      return;
    }

    this.qtyError[p._id] = '';
  }

  canAdd(p: Product): boolean {
    if (!this.auth.isUser()) return false;
    if (p.stock <= 0) return false;

    const v = this.qty[p._id] ?? 1;
    if (v < 1) return false;
    if (v > p.stock) return false;

    return true;
  }

  addToCart(p: Product) {
    const v = this.qty[p._id] ?? 1;
    this.cart.add(p, v);
  }
}
