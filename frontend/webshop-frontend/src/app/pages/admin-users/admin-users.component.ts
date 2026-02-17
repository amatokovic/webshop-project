import { Component, OnInit } from '@angular/core';
import { ApiService, UserRow } from '../../services/api.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  users: UserRow[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getUsers().subscribe({
      next: (u) => { this.users = u; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Failed to load users.'; this.loading = false; }
    });
  }
}
