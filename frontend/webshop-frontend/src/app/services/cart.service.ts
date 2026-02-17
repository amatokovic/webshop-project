import { Injectable } from '@angular/core';
import { Product } from './api.service';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private key = 'cart';

  getItems(): CartItem[] {
    return this.read();
  }

  getCount(): number {
    return this.read().reduce((sum, i) => sum + i.quantity, 0);
  }

  add(product: Product, quantity: number = 1) {
    const items = this.read();
    const existing = items.find(i => i.productId === product._id);

    const stock = Number(product.stock ?? 0);
    const safeQty = Math.max(1, Math.min(quantity, stock || 1));

    if (existing) {
      existing.stock = stock;
      existing.quantity = Math.min(existing.quantity + safeQty, existing.stock);
    } else {
      items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: safeQty,
        stock
      });
    }

    this.write(items);
  }

  setQuantity(productId: string, quantity: number) {
    const items = this.read();
    const it = items.find(i => i.productId === productId);
    if (!it) return;

    const q = Number(quantity);
    if (!Number.isFinite(q)) return;

    if (q <= 0) {
      this.remove(productId);
      return;
    }

    it.quantity = Math.min(q, it.stock);
    this.write(items);
  }

  remove(productId: string) {
    const items = this.read().filter(i => i.productId !== productId);
    this.write(items);
  }

  clear() {
    localStorage.removeItem(this.key);
  }

  getTotal(): number {
    return this.read().reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  toOrderItems(): { productId: string; quantity: number }[] {
    return this.getItems().map(i => ({
      productId: i.productId,
      quantity: i.quantity
    }));
  }

  private read(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(this.key) || '[]');
    } catch {
      return [];
    }
  }

  private write(items: CartItem[]) {
    localStorage.setItem(this.key, JSON.stringify(items));
  }
}
