import { Component } from "@angular/core";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-admin-orders",
  templateUrl: "./admin-orders.component.html",
})
export class AdminOrdersComponent {
  orders: any[] = [];
  error = "";
  loading = true;

  constructor(private api: ApiService) {
    this.api.getAllOrders().subscribe({
      next: (data) => { this.orders = data; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || "Failed to load orders."; this.loading = false; }
    });
  }
}
