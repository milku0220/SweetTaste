import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize, map } from 'rxjs/operators';
import { CartItem } from 'src/app/models/cart-item';
import { CustomDialogComponent } from 'src/app/models/custom-dialog/custom-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['../../../assets/css/cart.css', './cart.component.css']
})
export class CartComponent {

  public cartList: CartItem[] = [];
  public isLoading: boolean = false;  // true時show blockUI
  
  constructor(private cartService: CartService, private authService: AuthService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){    // 檢查是否為登入狀態
      this.cartService.getUserCart().subscribe( 
        cartList => {
          if(cartList) {
            this.cartList = cartList;
          }
        }
      )
      // this.cartService.getUserCart().subscribe({    // 取得購物車內容
      //   next: (resp) =>{
      //     this.cartList = resp.data.map((productData: any[]) => {
      //       const product = new CartItem();
      //       product.productId = productData[resp.fieldIndex.productId];
      //       product.orderQuantity = Number(productData[resp.fieldIndex.orderQuantity]);
      //       product.curOrderQuantity = Number(productData[resp.fieldIndex.orderQuantity]);
      //       product.name = productData[resp.fieldIndex.name];
      //       product.price = productData[resp.fieldIndex.price];
      //       product.inventories = productData[resp.fieldIndex.inventories];
      //       product.img = productData[resp.fieldIndex.img];
      //       return product;
      //     });
      //     // console.log('carList=>' + this.cartList);
      //   },
      //   error: (err)=> console.log('Error:', err)
      // });
    }
  }

  // 刪除購物車商品
  public deleteCartProduct(productId: number) {
    const token: string = this.authService.getUserToken();
    this.isLoading = true;  // blockUI

    this.cartService.deleteUserCart(token, productId)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: (resp)=>{
        console.log(resp.message);
        this.cartList = this.cartList.filter(product => product.productId !== productId);
        this.cartService.updateCartItemCount();   // 更新購物車icon數量
      },
      error: (err)=> console.log('Error', err)
    })
  }

  // 更新購物車商品數量
  public updateCart(productId: number, newOrderQuantity: number): void {
    
    this.isLoading = true;  //blockUI
    const curQuantity = this.cartList.find(p => p.productId === productId)?.curOrderQuantity || 0;
    const newQuantity: number = Number(newOrderQuantity);
    const token: string = this.authService.getUserToken();    // 取得token

    if (newQuantity >= 1) {   // 如果更新後數量 >= 1
      this.cartService.updateUserCart(token, productId, newQuantity)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (resp) => {
          console.log('Cart updated successfully', resp);
          const index = this.cartList.findIndex(p => p.productId === productId);
          if (index !== -1) {
            this.cartList[index].orderQuantity = newQuantity;
            this.cartList[index].curOrderQuantity = newQuantity;
            this.cartService.updateCartItemCount();   // 更新購物車icon數量
          }
        },
        error: (err) => {
          const index = this.cartList.findIndex(p => p.productId === productId);
          this.openDialog('庫存不足!');
          console.error('Error updating cart', err);
          if (index !== -1) {
            this.cartList[index].orderQuantity = curQuantity;
            console.log(curQuantity);
          }
        }
      });
    } 

    else {    // 刪除購物車內該商品
      this.deleteCartProduct(productId);
      this.cartService.updateCartItemCount();   // 更新購物車icon數量
    }
  }


  // 進入結帳頁面前檢查
  public toCheckoutPage() {

    // 是否登入
    if(!this.authService.isAuthenticated()){
      this.openDialog('您尚未登入會員 請先登入!');
      this.router.navigate(['/login']);
      return;
    }

    // 購物車是否為空
    if(!this.cartList.length){
      this.openDialog('您的購物車沒有商品');
    }

    else{
      const token = this.authService.getUserToken();
      if (token) {
        const data = {
          token: token,
          userCarts: this.cartList.map(product => ({
            productId: product.productId,
            orderQuantity: product.orderQuantity
          }))
        };

        // 檢查庫存數量
        this.cartService.batchUpdateUserCart(data).subscribe({
          next: (resp) => {
            this.router.navigate(['/checkout/step1']);
          },
          error: (err) => {
            console.error('Error updating cart quantities', err);
            this.openDialog('庫存不足!');
          }
        });
      } 
      else {  // Token過期需重新登入
        this.openDialog('驗證過期 請重新登入');
        this.router.navigate(['/login']);
      }
    }
  }    
    
  // 計算總金額
  public getTotalAmount(): number {
    return this.cartList.reduce((acc, product) => acc + (product.orderQuantity * product.price), 0);
  }  

  // Dialog
  public openDialog(msg: string): void {
    this.dialog.open(CustomDialogComponent, {
      width: '250px',
      data: { message: msg }, 
    });
  }
    

}
