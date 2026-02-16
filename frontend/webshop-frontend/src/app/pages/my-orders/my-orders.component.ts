import { Component } from "@angular/core";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-my-orders",
  templateUrl: "./my-orders.component.html",
})
export class MyOrdersComponent {
  orders: any[] = [];
  error = "";
  loading = true;

  constructor(private api: ApiService) {
    this.api.getMyOrders().subscribe({
      next: (data) => { this.orders = data; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || "Failed to load orders."; this.loading = false; }
    });
  }
}
