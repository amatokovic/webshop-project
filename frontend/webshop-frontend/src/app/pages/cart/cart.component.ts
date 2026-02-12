import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent {

  constructor(
    public cartService: CartService,
    private api: ApiService
  ) {}

  checkout() {
    const items = this.cartService.cart.map(i => ({
      productId: i.product._id,
      quantity: i.quantity
    }));

    this.api.createOrder({ items }).subscribe({
      next: () => {
        alert("Order created!");
        this.cartService.clearCart();
      },
      error: () => alert("Order failed!")
    });
  }
}
