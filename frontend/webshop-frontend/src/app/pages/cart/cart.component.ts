import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent {
  error = '';
  loading = false;

  constructor(
    public cart: CartService,
    private api: ApiService,
    public auth: AuthService,
    private router: Router
  ) {}

  items(): CartItem[] {
    return this.cart.getItems();
  }

  total(): number {
    return this.cart.getTotal();
  }

  updateQty(id: string, value: string) {
    const q = Number(value);
    this.cart.setQuantity(id, Number.isFinite(q) ? q : 1);
  }

  remove(id: string) {
    this.cart.remove(id);
  }

  checkout() {
    this.error = '';

    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }

    const items = this.cart.getItems();
    if (items.length === 0) {
      this.error = 'Cart is empty.';
      return;
    }

    this.loading = true;

    const payload = {
      paymentMethod: 'cod' as const,
      items: this.cart.toOrderItems(),
    };

    this.api.createOrder({
      paymentMethod: 'cod',
      items: this.cart.toOrderItems()
    })
  }
}
