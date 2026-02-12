import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AdminProductsComponent } from './pages/admin-products/admin-products.component';
import { PriceUsdPipe } from './pipes/price-usd.pipe';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CartComponent } from './pages/cart/cart.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductsComponent,
    ProductDetailsComponent,
    LoginComponent,
    RegisterComponent,
    AdminProductsComponent,
    PriceUsdPipe,
    CategoriesComponent,
    CartComponent,
    MyOrdersComponent,
    AdminOrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
