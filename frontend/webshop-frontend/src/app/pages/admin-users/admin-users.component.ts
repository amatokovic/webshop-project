import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {

  users: any[] = [];
  error = '';
  message = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.api.getUsers().subscribe({
      next: (data) => this.users = data,
      error: () => this.error = 'Failed to load users.'
    });
  }

  deleteUser(id: string) {

    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    this.api.deleteUser(id).subscribe({
      next: () => {
        this.message = "User deleted.";
        this.loadUsers(); // refresh list
      },
      error: (err) => {
        this.error = err?.error?.message || "Delete failed.";
      }
    });
  }
}
