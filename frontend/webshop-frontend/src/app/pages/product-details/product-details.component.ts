import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, Product } from '../../services/api.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Missing product id.';
      this.loading = false;
      return;
    }

    this.api.getProductById(id).subscribe({
      next: (p) => {
        this.product = p;
        this.loading = false;
      },
      error: () => {
        this.error = 'Product not found.';
        this.loading = false;
      }
    });
  }

  getCategoryName(): string {
    if (!this.product) return '';
    const c = this.product.categoryId;
    return typeof c === 'string' ? c : c.name;
  }
}
