import { Injectable } from '@angular/core';
import { Product } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart: { product: Product, quantity: number }[] = [];

  addToCart(product: Product) {
    const existing = this.cart.find(i => i.product._id === product._id);

    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
  }

  removeFromCart(id: string) {
    this.cart = this.cart.filter(i => i.product._id !== id);
  }

  clearCart() {
    this.cart = [];
  }

  getTotal() {
    return this.cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }
}
