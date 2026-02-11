import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, Category, Product } from '../../services/api.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html'
})
export class AdminProductsComponent implements OnInit {
  form: FormGroup;
  message = '';
  categories: Category[] = [];
  products: Product[] = [];
  editingId: string | null = null;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.api.getCategories().subscribe({
      next: (cats) => (this.categories = cats),
      error: () => (this.message = 'Failed to load categories.')
    });
  }

  loadProducts(): void {
    this.api.getProducts().subscribe({
      next: (prods) => (this.products = prods),
      error: () => (this.message = 'Failed to load products.')
    });
  }

  startEdit(p: Product): void {
    this.editingId = p._id;

    const categoryId =
      typeof p.categoryId === 'string' ? p.categoryId : p.categoryId._id;

    this.form.patchValue({
      name: p.name,
      price: p.price,
      stock: p.stock,
      categoryId,
      imageUrl: p.imageUrl || ''
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form.reset({ price: 0, stock: 0, imageUrl: '' });
  }

  submit(): void {
    this.message = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.editingId) {
      this.api.updateProduct(this.editingId, this.form.value).subscribe({
        next: () => {
          this.message = 'Product updated!';
          this.cancelEdit();
          this.loadProducts();
        },
        error: (err) => {
          this.message = err?.error?.message || 'Error updating product';
        }
      });
    } else {
      this.api.createProduct(this.form.value).subscribe({
        next: () => {
          this.message = 'Product created!';
          this.form.reset({ price: 0, stock: 0, imageUrl: '' });
          this.loadProducts();
        },
        error: (err) => {
          this.message = err?.error?.message || 'Error creating product';
        }
      });
    }
  }

  delete(p: Product): void {
    if (!confirm(`Delete "${p.name}"?`)) return;

    this.api.deleteProduct(p._id).subscribe({
      next: () => {
        this.message = '🗑Product deleted!';
        this.loadProducts();
      },
      error: (err) => {
        this.message = err?.error?.message || 'Error deleting product';
      }
    });
  }

  getCategoryName(p: Product): string {
    return typeof p.categoryId === 'string' ? p.categoryId : p.categoryId.name;
  }
}
