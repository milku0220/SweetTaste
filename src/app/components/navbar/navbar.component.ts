import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  public cartItemCount: number = 0;

  constructor(private authService: AuthService, private cartService: CartService) {}

  ngOnInit(): void {
    // 取得購物車商品總數量
    if(this.IsLogin()) {
      this.cartService.updateCartItemCount();
    }

    this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count; 
    });
  }

  // 是否登入
  public IsLogin(): boolean {
    return this.authService.isAuthenticated();
  }

  // 登出
  public Logout(): void {
    this.authService.onLogout();
    this.cartItemCount = 0;
  }

}
