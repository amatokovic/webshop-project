import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Category {
  _id: string;
  name: string;
  description?: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: { _id: string; name: string } | string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  createProduct(data: any) {
    return this.http.post(`${this.baseUrl}/products`, data);
  }

  updateProduct(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/products/${id}`, data);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.baseUrl}/products/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  createCategory(data: { name: string; description?: string }) {
    return this.http.post(`${this.baseUrl}/categories`, data);
  }

  getEurToUsdRate(): Observable<{ base: string; date: string; rate: number }> {
    return this.http.get<{ base: string; date: string; rate: number }>(`${this.baseUrl}/rates/eur-usd`);
  }

  createOrder(data: any) {
    return this.http.post(`${this.baseUrl}/orders`, data);
  }
}
