import { Component, OnInit } from '@angular/core';
import { ApiService, Category } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];
  loading = false;
  error = '';
  message = '';

  editingId: string | null = null;

  createForm!: FormGroup;
  editForm!: FormGroup;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    public auth: AuthService
  ) {
    this.createForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });

    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;

    this.api.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load categories.';
        this.loading = false;
      }
    });
  }

  create() {
    this.error = '';
    this.message = '';

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.api.createCategory(this.createForm.value).subscribe({
      next: () => {
        this.message = 'Category created.';
        this.createForm.reset();
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Create failed.';
      }
    });
  }

  startEdit(c: Category) {
    this.message = '';
    this.error = '';

    this.editingId = c._id;

    this.editForm.setValue({
      name: c.name,
      description: c.description || ''
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.editForm.reset();
  }

  saveEdit() {
    if (!this.editingId) return;

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.api.updateCategory(this.editingId, this.editForm.value).subscribe({
      next: () => {
        this.message = 'Category updated.';
        this.editingId = null;
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Update failed.';
      }
    });
  }

  remove(id: string) {
    if (!confirm('Delete this category?')) return;

    this.api.deleteCategory(id).subscribe({
      next: () => {
        this.message = 'Category deleted.';
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Delete failed.';
      }
    });
  }
}
