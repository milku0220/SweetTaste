import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomDialogComponent } from 'src/app/models/custom-dialog/custom-dialog.component';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../../assets/css/index.css']
})
export class HomeComponent {

  public productsList: Product[] = [];
  private typeId : number = 3;

  constructor(private productService: ProductService, private cartService: CartService, private router: Router, public dialog: MatDialog, private authService: AuthService) {}

  ngOnInit() {
    this.cartService.updateCartItemCount();

    // 取得product
    this.productService.getProductsByTypeId(this.typeId).subscribe(
      products => {
        this.productsList = products;
      }
    );
  }

  // 加入購物車資訊
  public getInfoCart(productId: number, orderQuantity: number) {
    const token = this.authService.getUserToken()
    console.log(token, productId, orderQuantity);

    if(this.authService.isAuthenticated()){   // 有登入的情況
      console.log('有登入');
      this.cartService.addUserCart(token, productId, orderQuantity).subscribe({
        next: (resp)=> {
          this.openDialog('成功加入購物車')
          this.cartService.updateCartItemCount();
          console.log(token, productId, orderQuantity);
          console.log(resp);
        },
        error: (err)=> console.log('Error', err)
      })
    }
    else{   // 沒登入=>跳到登入頁面
      this.openDialog('請先登入會員');
      this.router.navigate(['/login']);
    }
  }

  public openDialog(msg: string): void {
    console.log('Opening dialog with message:', msg);
    const dialogRef = this.dialog.open(CustomDialogComponent, {
      width: '250px',
      data: { message: msg }
    });
  }

}
