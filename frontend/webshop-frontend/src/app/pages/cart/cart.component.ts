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
    const orderedItems = this.cart.getItems();
    const invalid = orderedItems.find(i => i.quantity > i.stock);

    if (invalid) {
      this.error = `You selected ${invalid.quantity} but only ${invalid.stock} is available for "${invalid.name}".`;
      return;
    }

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
      paymentMethod: 'cod',
      items: this.cart.toOrderItems(),
    };

    this.api.createOrder(payload).subscribe({
      next: () => {
        this.loading = false;
        this.cart.clear();
        this.router.navigateByUrl('/my-orders');
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Checkout failed.';
      }
    });
  }
}
