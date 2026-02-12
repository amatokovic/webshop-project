import { Component, OnInit } from '@angular/core';
import { ApiService, Order } from '../../services/api.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html'
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  error = '';
  loading = false;

  statuses = ['pending', 'paid', 'shipped', 'cancelled'];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.loading = true;
    this.api.getAllOrders().subscribe({
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

  changeStatus(orderId: string, status: string) {
    this.api.updateOrderStatus(orderId, status).subscribe({
      next: (updated) => {
        const idx = this.orders.findIndex(o => o._id === updated._id);
        if (idx >= 0) this.orders[idx] = updated;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to update status.';
      }
    });
  }
}
