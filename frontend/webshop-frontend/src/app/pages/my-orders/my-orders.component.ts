import { Component, OnInit } from '@angular/core';
import { ApiService, Order } from '../../services/api.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html'
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  error = '';
  loading = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load orders.';
        this.loading = false;
      }
    });
  }
}
