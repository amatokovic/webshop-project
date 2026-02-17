import { Injectable } from '@angular/core';
import { Product } from './api.service';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  stock: number; // ✅ obavezno
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private key = 'cart';

  getItems(): CartItem[] {
    return this.read();
  }

  getQuantity(productId: string): number {
    return this.read().find(i => i.productId === productId)?.quantity ?? 0;
  }

  isAtMax(productId: string, stock: number): boolean {
    if (!Number.isFinite(stock) || stock <= 0) return true;
    return this.getQuantity(productId) >= stock;
  }

  add(product: Product, quantity: number = 1) {
    const items = this.read();
    const existing = items.find(i => i.productId === product._id);

    const stock = Number(product.stock ?? 0);
    if (!Number.isFinite(stock) || stock <= 0) return;

    const addQty = Math.max(1, Math.min(quantity, stock));

    if (existing) {
      existing.stock = stock;
      existing.quantity = Math.min(existing.quantity + addQty, stock);
    } else {
      items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: addQty,
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

    const stock = Number(it.stock ?? 0);
    if (!Number.isFinite(stock) || stock <= 0) {
      it.quantity = q;
    } else {
      it.quantity = Math.min(q, stock);
    }

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
      const raw = JSON.parse(localStorage.getItem(this.key) || '[]');
      return (Array.isArray(raw) ? raw : []).map((x: any) => ({
        productId: String(x.productId),
        name: String(x.name ?? ''),
        price: Number(x.price ?? 0),
        imageUrl: x.imageUrl || '',
        quantity: Math.max(1, Number(x.quantity ?? 1)),
        stock: Number.isFinite(Number(x.stock)) ? Number(x.stock) : 0,
      }));
    } catch {
      return [];
    }
  }

  private write(items: CartItem[]) {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  toOrderItems() {
    return this.read().map(i => ({ productId: i.productId, quantity: i.quantity }));
  }
}
