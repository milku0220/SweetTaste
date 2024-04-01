// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductsComponent } from './pages/products/products.component';
import { CartComponent } from './pages/cart/cart.component';
import { Checkout1Component } from './pages/checkout/checkout1/checkout1.component';
import { Checkout2Component } from './pages/checkout/checkout2/checkout2.component';
import { Checkout3Component } from './pages/checkout/checkout3/checkout3.component';
import { CheckoutSuccessComponent } from './pages/checkout/checkout-success/checkout-success.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title:"Sweetaste 首頁" },
  { path: 'login', component: LoginComponent, title:"Sweetaste 會員登入" },
  { path: 'products', component: ProductsComponent, title:"Sweetaste 甜點產品" },
  { path: 'cart', component: CartComponent, title:"Sweetaste 購物車" },
  { path: 'checkout/step1', component: Checkout1Component, title:"Sweetaste 結帳列表" },
  { path: 'checkout/step2', component: Checkout2Component, title:"Sweetaste 結帳列表" },
  { path: 'checkout/step3', component: Checkout3Component, title:"Sweetaste 結帳列表" },
  { path: 'checkout/success', component: CheckoutSuccessComponent, title:"Sweetaste 結帳成功" },
  { path: '**', redirectTo: '' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
