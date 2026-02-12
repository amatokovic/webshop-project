import { Injectable } from '@angular/core';
import { Product } from './api.service';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private key = 'cart';

  getItems(): CartItem[] {
    return this.read();
  }

  add(product: Product, quantity: number = 1) {
    const items = this.read();
    const existing = items.find(i => i.productId === product._id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity
      });
    }

    this.write(items);
  }

  setQuantity(productId: string, quantity: number) {
    const items = this.read();
    const it = items.find(i => i.productId === productId);
    if (!it) return;

    if (quantity <= 0) {
      this.remove(productId);
      return;
    }

    it.quantity = quantity;
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
